#!/usr/bin/env python3
"""
Glacia cPanel FTPS Resilient Direct Deployer
Uploads static export from apps/docs/out to cPanel web root with:
- Native FTPS over TLS (PatchedFTP_TLS avoiding unwrap hang)
- Directory pre-creation & caching
- Smart incremental file sync (skips files with identical size)
- Automatic connection recovery & per-file retries
"""

import os
import sys
import time
import socket
import ssl
import getpass
import subprocess
from ftplib import FTP, FTP_TLS

HOST = os.environ.get("CPANEL_FTP_SERVER", "ftp.plutotechnologies.org")
USER = os.environ.get("CPANEL_FTP_USERNAME", "glacia@glacia.binyamfeyissa.dev")
PASSWORD = os.environ.get("CPANEL_FTP_PASSWORD")
PORT = int(os.environ.get("CPANEL_FTP_PORT", 21))
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOCAL_DIR = os.path.abspath(os.path.join(ROOT_DIR, "apps", "docs", "out"))
REMOTE_DIR = os.environ.get("CPANEL_FTP_DIR", "/")
BLOCK_SIZE = 65536  # 64 KB buffers for fast transfer
SOCKET_TIMEOUT = 60  # 60 seconds before timeout


class PatchedFTP(FTP):
    """Subclass of FTP that overrides makepasv to connect to control host (avoids internal NAT timeout)."""
    def makepasv(self):
        host, port = super().makepasv()
        return self.host, port


class PatchedFTP_TLS(FTP_TLS):
    """
    Subclass of FTP_TLS that:
    1. Overrides makepasv to always connect to control host (avoids internal NAT timeout on cPanel).
    2. Prevents conn.unwrap() from hanging indefinitely.
    Pure-FTPd closes TLS data connections without sending a TLS close_notify alert,
    which causes standard Python ftplib to block forever in unwrap().
    """
    def makepasv(self):
        host, port = super().makepasv()
        return self.host, port

    def storbinary(self, cmd, fp, blocksize=BLOCK_SIZE, callback=None, rest=None):
        self.voidcmd("TYPE I")
        with self.transfercmd(cmd, rest) as conn:
            conn.settimeout(SOCKET_TIMEOUT)
            while True:
                buf = fp.read(blocksize)
                if not buf:
                    break
                conn.sendall(buf)
                if callback:
                    callback(buf)
            if hasattr(conn, "unwrap"):
                try:
                    conn.settimeout(0.5)
                    conn.unwrap()
                except Exception:
                    pass
        return self.voidresp()


class FTPDeployer:
    def __init__(self, host, user, password, port=21):
        self.host = host
        self.user = user
        self.password = password
        self.port = port
        self.ftp = None
        self.use_tls = True
        self.created_dirs = set()
        self.current_remote_dir = None

    def connect(self):
        """Establish FTPS (or plain FTP fallback) connection."""
        if self.ftp:
            try:
                self.ftp.quit()
            except Exception:
                try:
                    self.ftp.close()
                except Exception:
                    pass
            self.ftp = None

        if self.use_tls:
            for attempt in range(2):
                try:
                    ctx = ssl.create_default_context()
                    ctx.check_hostname = False
                    ctx.verify_mode = ssl.CERT_NONE
                    ftp = PatchedFTP_TLS(context=ctx)
                    ftp.connect(self.host, self.port, timeout=SOCKET_TIMEOUT)
                    ftp.auth()
                    ftp.login(self.user, self.password)
                    ftp.prot_p()  # Secure data transfers
                    ftp.voidcmd("TYPE I")  # Binary mode
                    self.ftp = ftp
                    return self.ftp
                except Exception as e:
                    if attempt == 0:
                        time.sleep(2)
                        continue
                    print(f"⚠️  FTPS connection notice: {e}. Attempting standard FTP...")
                    self.use_tls = False

        # Fallback to plain FTP
        try:
            ftp = PatchedFTP()
            ftp.connect(self.host, self.port, timeout=SOCKET_TIMEOUT)
            ftp.login(self.user, self.password)
            ftp.voidcmd("TYPE I")
            self.ftp = ftp
            return self.ftp
        except Exception as e:
            raise ConnectionError(f"Failed to connect to {self.host}:{self.port} as {self.user}: {e}")

    def get_ftp(self, force_reconnect=False):
        if self.ftp is None or force_reconnect:
            self.connect()
            self.current_remote_dir = None
        return self.ftp

    def ensure_remote_dir(self, remote_dir_path):
        """Ensures a directory hierarchy exists on the remote server using cached lookups."""
        if not remote_dir_path or remote_dir_path in ("/", "."):
            return

        normalized = "/" + remote_dir_path.strip("/")
        if normalized in self.created_dirs:
            return

        ftp = self.get_ftp()
        parts = [p for p in normalized.split("/") if p]
        accumulated = ""
        for part in parts:
            accumulated += "/" + part
            if accumulated in self.created_dirs:
                continue
            try:
                ftp.cwd(accumulated)
                self.created_dirs.add(accumulated)
            except Exception:
                try:
                    ftp.mkd(accumulated)
                    self.created_dirs.add(accumulated)
                except Exception:
                    self.created_dirs.add(accumulated)
        self.current_remote_dir = accumulated

    def change_remote_dir(self, remote_dir_path):
        """Change directory only if not already there."""
        normalized = "/" + remote_dir_path.strip("/") if remote_dir_path not in ("", "/") else "/"
        if self.current_remote_dir == normalized:
            return
        self.ensure_remote_dir(normalized)
        if self.current_remote_dir != normalized:
            ftp = self.get_ftp()
            try:
                ftp.cwd(normalized)
                self.current_remote_dir = normalized
            except Exception:
                self.ensure_remote_dir(normalized)
                ftp.cwd(normalized)
                self.current_remote_dir = normalized

    def get_remote_file_size(self, remote_file_path):
        """Get file size on remote server using SIZE command. Returns -1 if not found."""
        ftp = self.get_ftp()
        try:
            return ftp.size(remote_file_path)
        except Exception:
            return -1

    def upload_file(self, local_path, remote_dir_path, filename, max_retries=6):
        """Upload a single file with resume/skip check and automatic retries."""
        local_size = os.path.getsize(local_path)
        rel_dir = remote_dir_path.strip("/")
        remote_full_path = "/" + (rel_dir + "/" + filename if rel_dir else filename)

        # Check if already uploaded and identical in size
        remote_size = self.get_remote_file_size(remote_full_path)
        if remote_size == local_size:
            return "skipped", local_size

        for attempt in range(1, max_retries + 1):
            try:
                self.change_remote_dir(remote_dir_path)
                ftp = self.get_ftp()
                with open(local_path, "rb") as f:
                    ftp.storbinary(f"STOR {filename}", f, blocksize=BLOCK_SIZE)
                return "uploaded", local_size
            except Exception as err:
                if attempt == max_retries:
                    raise RuntimeError(f"Failed to upload {filename} after {max_retries} attempts: {err}")
                wait_sec = attempt * 3.0
                sys.stdout.write(f"\n   ⚠️  [Attempt {attempt}/{max_retries}] Retrying {filename} in {wait_sec:.1f}s ({err})... ")
                sys.stdout.flush()
                # Ensure socket is cleanly closed before waiting so Pure-FTPd frees the session slot
                if self.ftp:
                    try:
                        self.ftp.close()
                    except Exception:
                        pass
                    self.ftp = None
                time.sleep(wait_sec)
                try:
                    self.get_ftp(force_reconnect=True)
                except Exception:
                    pass

    def close(self):
        if self.ftp:
            try:
                self.ftp.quit()
            except Exception:
                try:
                    self.ftp.close()
                except Exception:
                    pass
            self.ftp = None


def ensure_build():
    """Verify that apps/docs/out exists and contains index.html, building if needed."""
    index_file = os.path.join(LOCAL_DIR, "index.html")
    if not os.path.isfile(index_file):
        print("📦 apps/docs/out not built yet or missing index.html. Running production build...")
        cmd = ["pnpm", "--filter", "docs", "build"]
        res = subprocess.run(cmd, cwd=ROOT_DIR)
        if res.returncode != 0:
            print("❌ Build failed. Aborting deploy.")
            sys.exit(1)


def main():
    global PASSWORD
    print("=" * 60)
    print(" Glacia cPanel Resilient FTPS Deployer")
    print(f" Target: https://glacia.binyamfeyissa.dev/")
    print(f" Server: {HOST}:{PORT} | User: {USER}")
    print("=" * 60)

    # 1. Password detection
    if not PASSWORD:
        if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
            PASSWORD = sys.argv[1]
        else:
            try:
                PASSWORD = getpass.getpass(f"Enter FTP Password for {USER}: ")
            except (KeyboardInterrupt, EOFError):
                print("\nAborted.")
                sys.exit(1)

    if not PASSWORD:
        print("❌ No password provided. Exiting.")
        sys.exit(1)

    # 2. Check export build
    ensure_build()

    # 3. Gather files
    file_list = []
    total_bytes = 0
    for root, dirs, files in os.walk(LOCAL_DIR):
        for f in sorted(files):
            if f in (".DS_Store", "Thumbs.db"):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, LOCAL_DIR)
            file_size = os.path.getsize(full_path)
            file_list.append((full_path, rel_path, file_size))
            total_bytes += file_size

    total_files = len(file_list)
    print(f"📦 Found {total_files} files ({total_bytes / (1024 * 1024):.2f} MB) in {LOCAL_DIR}...")

    # 4. Connect to remote host
    deployer = FTPDeployer(HOST, USER, PASSWORD, PORT)
    print(f"🔌 Connecting securely to {HOST}:{PORT} as {USER}...")
    deployer.connect()
    print(" Connected securely via FTPS.")

    # 5. Pre-create directories in order
    all_remote_dirs = set()
    for _, rel_path, _ in file_list:
        remote_file_path = (REMOTE_DIR.rstrip("/") + "/" + rel_path.replace("\\", "/")).lstrip("/")
        remote_dir = "/" + os.path.dirname(remote_file_path).lstrip("/")
        all_remote_dirs.add(remote_dir)

    sorted_dirs = sorted(all_remote_dirs, key=lambda d: (len(d.split("/")), d))
    print(f"📁 Pre-verifying {len(sorted_dirs)} remote directories...")
    for d in sorted_dirs:
        deployer.ensure_remote_dir(d)

    # 6. Upload files with progress
    start_time = time.time()
    uploaded_count = 0
    skipped_count = 0
    transferred_bytes = 0

    print("🚀 Starting sync...")
    for idx, (local_path, rel_path, file_size) in enumerate(file_list, 1):
        remote_file_path = (REMOTE_DIR.rstrip("/") + "/" + rel_path.replace("\\", "/")).lstrip("/")
        remote_dir_path = "/" + os.path.dirname(remote_file_path).lstrip("/")
        filename = os.path.basename(local_path)

        status, size = deployer.upload_file(local_path, remote_dir_path, filename)
        if status == "uploaded":
            uploaded_count += 1
            transferred_bytes += size
        else:
            skipped_count += 1

        percent = (idx / total_files) * 100
        display_name = rel_path if len(rel_path) <= 35 else "..." + rel_path[-32:]
        stat_tag = "↑" if status == "uploaded" else "="
        sys.stdout.write(f"\r[{percent:5.1f}%] [{idx}/{total_files}] {stat_tag} {display_name:<35} ({uploaded_count} up, {skipped_count} sync)")
        sys.stdout.flush()

    elapsed = time.time() - start_time
    deployer.close()

    print("\n\n" + "=" * 60)
    print(f"🎉 Deployment Complete in {elapsed:.1f}s!")
    print(f"   • Total files processed: {total_files}")
    print(f"   • Files newly uploaded: {uploaded_count} ({transferred_bytes / (1024 * 1024):.2f} MB)")
    print(f"   • Files unchanged (skipped): {skipped_count}")
    print(f"   • Live URL: https://glacia.binyamfeyissa.dev/")
    print("=" * 60)


if __name__ == "__main__":
    main()
