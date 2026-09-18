#!/bin/bash

# ============================================================
#  RHHC Invoice Management - One Click VPS Setup
#  Ubuntu / Debian | MySQL + Node.js + Nginx + SSL
# ============================================================
#  
#  HOW TO USE:
#  1. Apni puri project folder VPS pe upload karo /root/rhhc-invoice mein
#  2. SSH into VPS: ssh root@your-vps-ip
#  3. Run: cd /root/rhhc-invoice && sudo bash deploy/setup-vps.sh
#
# ============================================================

set -e

# ---------- Colors ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║   RHHC Invoice - VPS Deployment Script    ║"
echo "  ╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# ---------- Check root ----------
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root: sudo bash deploy/setup-vps.sh${NC}"
  exit 1
fi

# ---------- Input ----------
read -p "📌 Apna domain name daalo (e.g. rhhcinvoice.com): " DOMAIN
read -p "📌 Apna email daalo (SSL ke liye): " EMAIL

if [ -z "$DOMAIN" ]; then
  echo -e "${RED}Domain name zaroori hai!${NC}"
  exit 1
fi

PROJECT_DIR="/var/www/rhhc-invoice"
BACKEND_SRC="$(pwd)/backend_invoice_management_RHHC-main/backend_invoice_management_RHHC-main"
FRONTEND_SRC="$(pwd)/frontend_invoice_management_RHHC-main/frontend_invoice_management_RHHC-main"

# Check source directories
if [ ! -d "$BACKEND_SRC" ] || [ ! -d "$FRONTEND_SRC" ]; then
  echo -e "${RED}Error: Project files nahi mili. Make sure you're running this from project root.${NC}"
  exit 1
fi

# ---------- Generate secrets ----------
JWT_SECRET=$(openssl rand -hex 32)
REFRESH_SECRET=$(openssl rand -hex 32)
MYSQL_ROOT_PASS=$(openssl rand -hex 16)
MYSQL_APP_PASS=$(openssl rand -hex 16)

echo ""
echo -e "${GREEN}[1/9] System update...${NC}"
apt-get update -qq
apt-get upgrade -y -qq

echo -e "${GREEN}[2/9] Installing Node.js 22...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y -qq nodejs
fi
echo "  Node: $(node --version)"
echo "  NPM: $(npm --version)"

echo -e "${GREEN}[3/9] Installing MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    apt-get install -y -qq mysql-server
    systemctl enable mysql
    systemctl start mysql
    
    # Secure MySQL
    mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASS}';
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
FLUSH PRIVILEGES;
EOF
fi

echo -e "${GREEN}[4/9] Setting up database...${NC}"
mysql -u root -p"${MYSQL_ROOT_PASS}" <<EOF
CREATE DATABASE IF NOT EXISTS rhhc_invoice CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'rhhc_user'@'localhost' IDENTIFIED BY '${MYSQL_APP_PASS}';
GRANT ALL PRIVILEGES ON rhhc_invoice.* TO 'rhhc_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Import SQL dump
if [ -f "$(pwd)/rhhc_invoice.sql" ]; then
    echo "  Importing database dump..."
    mysql -u root -p"${MYSQL_ROOT_PASS}" rhhc_invoice < "$(pwd)/rhhc_invoice.sql"
    echo "  ✅ Database imported!"
elif [ -f "$BACKEND_SRC/src/db/invoice_management_rhhc.sql" ]; then
    echo "  Importing database dump from backend..."
    mysql -u root -p"${MYSQL_ROOT_PASS}" rhhc_invoice < "$BACKEND_SRC/src/db/invoice_management_rhhc.sql"
    echo "  ✅ Database imported!"
else
    echo -e "  ${YELLOW}⚠️  No SQL dump found. You'll need to import it manually.${NC}"
fi

echo -e "${GREEN}[5/9] Setting up Backend...${NC}"
mkdir -p ${PROJECT_DIR}/backend
cp -r ${BACKEND_SRC}/* ${PROJECT_DIR}/backend/

# Create production .env
cat > ${PROJECT_DIR}/backend/.env <<EOF
PORT=5000
DB_HOST=localhost
DB_USER=rhhc_user
DB_PASSWORD=${MYSQL_APP_PASS}
DB_NAME=rhhc_invoice
JWT_SECRET=${JWT_SECRET}
REFRESH_SECRET=${REFRESH_SECRET}
JWT_EXPIRES_IN=7d
NODE_ENV=production
EOF

cd ${PROJECT_DIR}/backend
npm install --production --quiet 2>&1 | tail -3
mkdir -p src/uploads/temp
echo "  ✅ Backend ready!"

echo -e "${GREEN}[6/9] Setting up Frontend...${NC}"
mkdir -p ${PROJECT_DIR}/frontend
cp -r ${FRONTEND_SRC}/* ${PROJECT_DIR}/frontend/

# Create production .env
cat > ${PROJECT_DIR}/frontend/.env.production <<EOF
NEXT_PUBLIC_API_URL=https://${DOMAIN}/api
NEXT_PUBLIC_FIREBASE_API_KEY=dummy
NEXT_PUBLIC_FIREBASE_APP_ID=dummy
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy
NEXT_PUBLIC_FIREBASE_DATABASE_URL=dummy
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=dummy
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy
EOF

cd ${PROJECT_DIR}/frontend
PUPPETEER_SKIP_DOWNLOAD=true npm install --quiet 2>&1 | tail -3
npm run build 2>&1 | tail -5
echo "  ✅ Frontend ready!"

echo -e "${GREEN}[7/9] Creating system services...${NC}"
chown -R www-data:www-data ${PROJECT_DIR}

# Backend service
cat > /etc/systemd/system/rhhc-backend.service <<EOF
[Unit]
Description=RHHC Invoice Backend API
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=${PROJECT_DIR}/backend
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
EnvironmentFile=${PROJECT_DIR}/backend/.env
StandardOutput=append:/var/log/rhhc-backend.log
StandardError=append:/var/log/rhhc-backend-error.log

[Install]
WantedBy=multi-user.target
EOF

# Frontend service
cat > /etc/systemd/system/rhhc-frontend.service <<EOF
[Unit]
Description=RHHC Invoice Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${PROJECT_DIR}/frontend
ExecStart=/usr/bin/npx next start -p 3000 -H 0.0.0.0
Restart=always
RestartSec=5
Environment=NODE_ENV=production
StandardOutput=append:/var/log/rhhc-frontend.log
StandardError=append:/var/log/rhhc-frontend-error.log

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable rhhc-backend rhhc-frontend
systemctl start rhhc-backend rhhc-frontend
echo "  ✅ Services started!"

echo -e "${GREEN}[8/9] Setting up Nginx...${NC}"
apt-get install -y -qq nginx

cat > /etc/nginx/sites-available/rhhc-invoice <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    client_max_body_size 20M;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/rhhc-invoice /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
echo "  ✅ Nginx configured!"

echo -e "${GREEN}[9/9] Installing SSL Certificate...${NC}"
apt-get install -y -qq certbot python3-certbot-nginx
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} || {
    echo -e "${YELLOW}  ⚠️  SSL setup fail hua. Make sure domain DNS is pointed to this VPS IP.${NC}"
    echo -e "  Baad mein manually run karo: certbot --nginx -d ${DOMAIN}"
}

# ---------- Save credentials ----------
cat > ${PROJECT_DIR}/CREDENTIALS.txt <<EOF
==============================================
  RHHC Invoice - Server Credentials
==============================================

🌐 Website: https://${DOMAIN}

🔐 Login:
   Mobile:   7404084849
   Password: (database mein jo set hai)

🗄️  MySQL:
   Root Password:  ${MYSQL_ROOT_PASS}
   App User:       rhhc_user
   App Password:   ${MYSQL_APP_PASS}
   Database:       rhhc_invoice

🔑 JWT Secrets:
   JWT_SECRET:     ${JWT_SECRET}
   REFRESH_SECRET: ${REFRESH_SECRET}

📁 Paths:
   Backend:  ${PROJECT_DIR}/backend
   Frontend: ${PROJECT_DIR}/frontend
   Logs:     /var/log/rhhc-backend.log
             /var/log/rhhc-frontend.log

🔧 Commands:
   sudo systemctl restart rhhc-backend
   sudo systemctl restart rhhc-frontend
   sudo tail -f /var/log/rhhc-backend.log
   sudo tail -f /var/log/rhhc-frontend.log
==============================================
EOF

chmod 600 ${PROJECT_DIR}/CREDENTIALS.txt

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🎉 DEPLOYMENT COMPLETE!              ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  🌐 ${CYAN}https://${DOMAIN}${NC}"
echo ""
echo -e "  📋 Credentials saved: ${PROJECT_DIR}/CREDENTIALS.txt"
echo ""
echo -e "  ${YELLOW}Useful commands:${NC}"
echo "    sudo systemctl status rhhc-backend    # Backend status"
echo "    sudo systemctl status rhhc-frontend   # Frontend status"
echo "    sudo tail -f /var/log/rhhc-backend.log"
echo "    sudo tail -f /var/log/rhhc-frontend.log"
echo ""
