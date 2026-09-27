#!/usr/bin/env bash
#
# Multisheets - first deploy to the Hostinger VPS.
#
# Paste this into the SSH session opened with:
#   ssh -p 65002 u747113332@82.112.229.152
#
# It is safe to re-run. Every step checks before it acts.
set -euo pipefail

PROJECT=/home/u747113332/domains/multisheets.com/public_html
REPO=https://github.com/mohitsiddhi-art/multisheets.git

say() { printf '\n\033[1m== %s\033[0m\n' "$1"; }

say "Environment"
node -v || { echo "Node missing. Install Node 20+ first."; exit 1; }
npm -v
pm2 -v || echo "pm2 not installed yet, will install"
df -h "$PROJECT" | tail -1
free -m | head -2

say "Fetch source"
cd "$PROJECT"
if [ -d .git ]; then
  git pull --ff-only
else
  git init -q
  git remote add origin "$REPO" 2>/dev/null || true
  git fetch -q origin
  git checkout -q -B main origin/main
fi
git log --oneline -1

say "Install dependencies and build"
# --production would omit devDependencies, and `next build` needs them.
npm ci
npm run build

say "Scan log directory"
# The honeypot writes here. It must exist and be writable by the app user.
mkdir -p /home/u747113332/var/security
touch /home/u747113332/var/security/scans.jsonl
chmod 700 /home/u747113332/var/security

say "Start the app under PM2"
pm2 start deploy/ecosystem.config.cjs --env production || \
  pm2 delete multisheets >/dev/null 2>&1 && pm2 start deploy/ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd -u u747113332 --hp /home/u747113332

say "Verify locally on the box"
sleep 3
curl -s -o /dev/null -w 'homepage          %{http_code}\n' http://127.0.0.1:3000/
curl -s -o /dev/null -w 'security.txt     %{http_code}\n' http://127.0.0.1:3000/.well-known/security.txt
curl -s -o /dev/null -w 'honeypot /admin  %{http_code} (200 = decoy login, expected)\n' http://127.0.0.1:3000/admin
curl -s -o /dev/null -w 'honeypot /.env   %{http_code} (404 = trapped, expected)\n' http://127.0.0.1:3000/.env

say "Install nginx config"
sudo cp deploy/nginx.multisheets.conf /etc/nginx/sites-available/multisheets
sudo ln -sf /etc/nginx/sites-available/multisheets /etc/nginx/sites-enabled/multisheets
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

say "Confirm the edge is actually in front"
curl -s -o /dev/null -w 'https /.env              %{http_code} (404 expected)\n' https://multisheets.com/.env
curl -s -o /dev/null -w 'https /.well-known/sec    %{http_code} (200 expected)\n' https://multisheets.com/.well-known/security.txt
echo "IMPORTANT: also check http://82.112.229.152:3000 from outside."
echo "If that responds, the app is exposed and the header hardening can be bypassed."

say "Done"
pm2 status
