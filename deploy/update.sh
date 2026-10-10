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

if ! grep -qs "managed by Certbot" /etc/nginx/conf.d/susira.conf && ! cmp -s deploy/nginx.conf /etc/nginx/conf.d/susira.conf; then
  cp deploy/nginx.conf /etc/nginx/conf.d/susira.conf
  rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/susira /etc/nginx/conf.d/default.conf
  nginx -t && systemctl reload nginx
fi

pm2 status
echo "Update complete."
