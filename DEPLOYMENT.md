# Deployment Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure events endpoint (optional)
cp .env.example .env
# Edit .env and set EVENTS_ENDPOINT

# 3. Build the site
npm run build

# 4. Output is in dist/ directory
```

## GitHub Actions Deployment

### Required Secrets

Add these secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SSH_HOST` | VPS hostname or IP | `123.45.67.89` or `aijam.pl` |
| `SSH_USER` | SSH username | `deploy` or `root` |
| `SSH_KEY` | Private SSH key | Contents of `~/.ssh/id_rsa` |
| `SSH_PATH` | Target directory on VPS | `/var/www/aijam.pl/` |

### SSH Key Setup

```bash
# On your local machine, generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/aijam_deploy

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/aijam_deploy.pub user@your-vps-ip

# Copy private key content for GitHub secret
cat ~/.ssh/aijam_deploy
```

## VPS Server Setup

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Create Web Directory

```bash
sudo mkdir -p /var/www/aijam.pl
sudo chown -R $USER:$USER /var/www/aijam.pl
```

### 3. Configure Nginx

```bash
# Copy example config
sudo cp nginx.conf.example /etc/nginx/sites-available/aijam.pl

# Edit the config if needed
sudo nano /etc/nginx/sites-available/aijam.pl

# Enable the site
sudo ln -s /etc/nginx/sites-available/aijam.pl /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Setup SSL (Optional but Recommended)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d aijam.pl -d www.aijam.pl

# Certbot will automatically update nginx config and setup auto-renewal
```

### 5. Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Manual Deployment

If you prefer to deploy manually without GitHub Actions:

```bash
# Build locally
npm run build

# Deploy via rsync
rsync -avz --delete dist/ user@your-vps:/var/www/aijam.pl/
```

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Nginx 404 Errors

Check nginx error log:
```bash
sudo tail -f /var/nginx/error.log
```

Verify file permissions:
```bash
ls -la /var/www/aijam.pl/
```

### GitHub Actions Deployment Fails

1. Check SSH connection manually:
```bash
ssh -i ~/.ssh/aijam_deploy user@your-vps
```

2. Verify secrets are set correctly in GitHub

3. Check GitHub Actions logs for specific errors

## Monitoring

### Check Nginx Status

```bash
sudo systemctl status nginx
```

### View Access Logs

```bash
sudo tail -f /var/log/nginx/access.log
```

### View Error Logs

```bash
sudo tail -f /var/log/nginx/error.log
```

## Performance Optimization

### Enable HTTP/2

Already configured in nginx.conf.example for HTTPS

### Verify Caching

```bash
# Check cache headers
curl -I https://aijam.pl/assets/css/styles.css
```

Should see:
```
Cache-Control: public, immutable
Expires: [1 year from now]
```

## Events API Configuration

### Local Development

```bash
# Copy example env file
cp .env.example .env

# Edit .env and configure your events endpoint
nano .env
```

Example `.env`:
```
EVENTS_ENDPOINT=http://localhost:1337/luma_events.json
EVENTS_TIMEOUT=5000
```

### Production (GitHub Actions)

Add `EVENTS_ENDPOINT` as a GitHub Actions secret or environment variable:

1. Go to repository Settings → Secrets and variables → Actions
2. Add new secret: `EVENTS_ENDPOINT`
3. Value: Your production events API URL

Update `.github/workflows/deploy.yml` to use the secret:
```yaml
- name: Build site
  run: npm run build
  env:
    EVENTS_ENDPOINT: ${{ secrets.EVENTS_ENDPOINT }}
```

### Testing Events API

Start a local server to serve the example events:
```bash
# Serve docs/luma_events.json on port 1337
python3 -m http.server 1337 --directory docs

# In another terminal, build the site
npm run build
```

You should see: `✓ Fetched 7 events from API`

## Updating Content

1. Edit markdown files in `src/content/`
2. Commit and push to main branch
3. GitHub Actions will automatically build and deploy

Or manually:
```bash
npm run build
rsync -avz --delete dist/ user@your-vps:/var/www/aijam.pl/
```
