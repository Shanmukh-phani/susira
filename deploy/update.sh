#!/usr/bin/env bash
# Pull the latest code from git and redeploy. Run on the server as root:
#   bash /var/www/susira/deploy/update.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/susira}"
cd "${APP_DIR}"

git pull --ff-only
npm --prefix backend install --omit=dev
npm --prefix socket install --omit=dev
npm --prefix frontend install
npm --prefix frontend run build
pm2 startOrReload ecosystem.config.js
pm2 save

if ! cmp -s deploy/nginx.conf /etc/nginx/sites-available/susira; then
  cp deploy/nginx.conf /etc/nginx/sites-available/susira
  nginx -t && systemctl reload nginx
fi

pm2 status
echo "Update complete."
