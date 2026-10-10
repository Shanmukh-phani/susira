#!/usr/bin/env bash
# One-time server setup for Ubuntu 22.04 / 24.04. Run as root:
#   bash setup.sh
# Safe to re-run: existing .env files and database data are kept.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/Shanmukh-phani/susira.git}"
APP_DIR="${APP_DIR:-/var/www/susira}"
SERVER_IP="${SERVER_IP:-46.202.164.114}"
DOMAIN="${DOMAIN:-susira.in}"
ADMIN_USERNAME="${ADMIN_USERNAME:-9866774076}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@123}"

log() { echo -e "\n\033[1;34m==> $*\033[0m"; }

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root (or with sudo)." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
CODENAME="$(. /etc/os-release && echo "${VERSION_CODENAME:-jammy}")"

log "Installing base packages"
apt-get update -y
apt-get install -y curl git nginx gnupg ca-certificates openssl ufw

if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  log "Installing Node.js 22"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v

if ! command -v mongod >/dev/null; then
  log "Installing MongoDB 8.0"
  curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${CODENAME}/mongodb-org/8.0 multiverse" \
    > /etc/apt/sources.list.d/mongodb-org-8.0.list
  apt-get update -y
  apt-get install -y mongodb-org
fi
systemctl enable --now mongod

if ! command -v pm2 >/dev/null; then
  log "Installing PM2"
  npm install -g pm2
fi

log "Fetching code into ${APP_DIR}"
if [ -d "${APP_DIR}/.git" ]; then
  git -C "${APP_DIR}" pull --ff-only
else
  mkdir -p "$(dirname "${APP_DIR}")"
  git clone "${REPO_URL}" "${APP_DIR}"
fi
cd "${APP_DIR}"

ORIGINS="http://${SERVER_IP},http://${DOMAIN},https://${DOMAIN},http://www.${DOMAIN},https://www.${DOMAIN}"

if [ ! -f backend/.env ]; then
  log "Creating backend/.env and socket/.env with new secrets"
  JWT_SECRET="$(openssl rand -hex 32)"
  SERVICE_KEY="$(openssl rand -hex 24)"
  cat > backend/.env <<EOF
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/susira
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
CLIENT_URL=${ORIGINS}
SOCKET_URL=http://127.0.0.1:5051
SOCKET_SERVICE_KEY=${SERVICE_KEY}
ADMIN_NAME=Super Admin
ADMIN_USERNAME=${ADMIN_USERNAME}
ADMIN_EMAIL=admin@${DOMAIN}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF
  cat > socket/.env <<EOF
SOCKET_PORT=5051
CLIENT_URL=${ORIGINS}
JWT_SECRET=${JWT_SECRET}
SOCKET_SERVICE_KEY=${SERVICE_KEY}
EOF
  chmod 600 backend/.env socket/.env
else
  log "Keeping existing .env files"
fi

log "Installing dependencies and building the website"
npm --prefix backend install --omit=dev
npm --prefix socket install --omit=dev
npm --prefix frontend install
npm --prefix frontend run build

log "Starting API and socket servers with PM2"
pm2 startOrReload ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null

log "Configuring Nginx"
cp deploy/nginx.conf /etc/nginx/sites-available/susira
ln -sf /etc/nginx/sites-available/susira /etc/nginx/sites-enabled/susira
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx

log "Configuring firewall (SSH + HTTP/HTTPS only)"
ufw allow OpenSSH >/dev/null
ufw allow 'Nginx Full' >/dev/null
ufw --force enable >/dev/null

sleep 2
log "Health checks"
curl -fsS http://127.0.0.1:5050/api/health && echo || echo "API not responding yet - check: pm2 logs susira-api"
curl -fsS http://127.0.0.1:5051/health && echo || echo "Socket not responding yet - check: pm2 logs susira-socket"
pm2 status

log "Done! Open http://${SERVER_IP} in your browser."
echo "Admin login: http://${SERVER_IP}/admin/login  (username: ${ADMIN_USERNAME})"
