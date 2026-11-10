# 🚀 Deploying Glacia to cPanel (https://glacia.binyamfeyissa.dev)

This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the Glacia documentation static site and deploys it directly to your cPanel hosting whenever you push to `main` (or trigger it manually via the Actions tab).

---

## 1. Required GitHub Secrets

Go to your repository settings:
👉 **[GitHub Repo Settings -> Secrets and variables -> Actions](https://github.com/binyamfeyissa/Glacia/settings/secrets/actions)**

Click **New repository secret** and add the following:

| Secret Name | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `CPANEL_FTP_SERVER` | **Yes** | Your cPanel FTP host or server IP | `ftp.binyamfeyissa.dev` or `123.45.67.89` |
| `CPANEL_FTP_USERNAME` | **Yes** | FTP account username | `glacia@binyamfeyissa.dev` or your cPanel username |
| `CPANEL_FTP_PASSWORD` | **Yes** | FTP account password | `••••••••••••` |
| `CPANEL_FTP_DIR` | No | Target path on server (defaults to `/`) | `/` (dedicated FTP user) or `public_html/glacia.binyamfeyissa.dev/` |
| `CPANEL_FTP_PORT` | No | FTP Port (defaults to `21`) | `21` |
| `CPANEL_FTP_PROTOCOL` | No | Protocol: `ftp` or `ftps` (defaults to `ftp`) | `ftp` |

*(Note: The workflow also accepts `FTP_SERVER`, `FTP_USERNAME`, and `FTP_PASSWORD` interchangeably).*

---

## 2. Recommended cPanel Setup

### Option A: Dedicated Subdomain FTP Account (Recommended)
1. In cPanel, navigate to **FTP Accounts**.
2. Create an account:
   - **Log in**: `glacia`
   - **Domain**: `binyamfeyissa.dev` (Full username will be `glacia@binyamfeyissa.dev`)
   - **Directory**: Set to the Document Root of your subdomain (e.g. `public_html/glacia.binyamfeyissa.dev/`).
3. Under this setup, the FTP user's root is already the subdomain directory, so `CPANEL_FTP_DIR` can simply be left as `/`.

### Option B: Main cPanel Account
1. Use your main cPanel username & password.
2. Set `CPANEL_FTP_DIR` secret to `public_html/glacia.binyamfeyissa.dev/` (or wherever your subdomain's document root is located).

---

## 3. What the Workflow Does

1. **Checks out the repository**.
2. **Installs dependencies** using pnpm.
3. **Runs core tests** (`pnpm --filter glacia test`) to guarantee zero regressions.
4. **Builds the tokens, core library, native components, and component registry**.
5. **Exports the Next.js docs site** to static HTML/CSS/JS (`apps/docs/out/`).
6. **Includes `.htaccess`** with Apache clean URL rewrite rules, HTTP -> HTTPS redirects, security headers, and MIME types.
7. **Uploads files to cPanel** via FTPS/FTP using `SamKirkland/FTP-Deploy-Action`.
