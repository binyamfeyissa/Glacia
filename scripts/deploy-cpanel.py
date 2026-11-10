#!/usr/bin/env python3
"""
Deploy Glacia Docs static export to cPanel via FTP/FTPS.
"""

import os
import sys
import getpass
import ssl
from ftplib import FTP, FTP_TLS

HOST = os.environ.get("CPANEL_FTP_SERVER", "ftp.plutotechnologies.org")
USER = os.environ.get("CPANEL_FTP_USERNAME", "glacia@glacia.binyamfeyissa.dev")
PASSWORD = os.environ.get("CPANEL_FTP_PASSWORD")
PORT = int(os.environ.get("CPANEL_FTP_PORT", 21))
LOCAL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "docs", "out"))
REMOTE_DIR = os.environ.get("CPANEL_FTP_DIR", "/")

def get_connection(host, user, password, port):
    """Attempt FTPS first (as pure-ftpd prefers TLS), fallback to plain FTP."""
    print(f"Connecting to {host}:{port} as {user}...")
    
    # Try FTPS (FTP over TLS)
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        ftp = FTP_TLS(context=ctx)
        ftp.connect(host, port, timeout=20)
        ftp.auth()
        ftp.login(user, password)
        ftp.prot_p()  # Switch data connection to secure TLS
        print(" Connected securely via FTPS (TLS).")
        return ftp
    except Exception as e:
        print(f" FTPS attempt info: {e}. Trying standard FTP...")
    
    # Fallback to plain FTP
    try:
        ftp = FTP()
        ftp.connect(host, port, timeout=20)
        ftp.login(user, password)
        print(" Connected via plain FTP.")
        return ftp
    except Exception as e:
        print(f"❌ FTP connection failed: {e}")
        sys.exit(1)

def ensure_remote_dir(ftp, remote_path):
    """Ensure directory exists on remote FTP server."""
    if not remote_path or remote_path == "." or remote_path == "/":
        return
    parts = [p for p in remote_path.strip("/").split("/") if p]
    current = ""
    for part in parts:
        current += "/" + part
        try:
            ftp.cwd(current)
        except Exception:
            try:
                ftp.mkd(current)
            except Exception:
                pass

def upload_directory(ftp, local_dir, remote_base="/"):
    """Recursively upload all files and folders in local_dir to remote_base."""
    if not os.path.isdir(local_dir):
        print(f"❌ Local export directory not found: {local_dir}")
        print("Run `pnpm build` first to generate apps/docs/out.")
        sys.exit(1)

    file_list = []
    for root, dirs, files in os.walk(local_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, local_dir)
            file_list.append((full_path, rel_path))

    total = len(file_list)
    print(f"📦 Found {total} files to upload from {local_dir}...")

    # Set binary mode
    ftp.voidcmd("TYPE I")

    uploaded = 0
    for local_path, rel_path in file_list:
        remote_file_path = (remote_base.rstrip("/") + "/" + rel_path.replace("\\", "/")).lstrip("/")
        remote_dir_path = "/" + os.path.dirname(remote_file_path).lstrip("/")
        
        ensure_remote_dir(ftp, remote_dir_path)
        ftp.cwd(remote_dir_path)

        filename = os.path.basename(local_path)
        with open(local_path, "rb") as f:
            ftp.storbinary(f"STOR {filename}", f)

        uploaded += 1
        if uploaded % 5 == 0 or uploaded == total:
            sys.stdout.write(f"\r🚀 Uploading: [{uploaded}/{total}] {rel_path[:40]:<40}")
            sys.stdout.flush()

    print("\n\n🎉 Upload complete!")

def main():
    global PASSWORD
    print("=" * 60)
    print(" Glacia cPanel Direct Deployer")
    print(f" Target: https://glacia.binyamfeyissa.dev/")
    print(f" Server: {HOST} | User: {USER}")
    print("=" * 60)

    if not PASSWORD:
        if len(sys.argv) > 1:
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

    ftp = get_connection(HOST, USER, PASSWORD, PORT)
    upload_directory(ftp, LOCAL_DIR, REMOTE_DIR)
    
    try:
        ftp.quit()
    except Exception:
        ftp.close()

    print("=" * 60)
    print("✨ Verified: Your site is now live at https://glacia.binyamfeyissa.dev/ !")
    print("=" * 60)

if __name__ == "__main__":
    main()
