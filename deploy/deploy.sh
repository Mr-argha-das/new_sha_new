#!/bin/bash

# ============================================================
# RHHC Invoice Management - VPS Deployment Script
# ============================================================
# Usage: sudo bash deploy.sh
# 
# Prerequisites:
#   - Ubuntu/Debian VPS with root access
#   - Domain name pointed to your VPS IP (optional)
# ============================================================

set -e

echo "========================================="
echo " RHHC Invoice - VPS Deployment"
echo "========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_DIR="/var/www/rhhc-invoice"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DOMAIN="your-domain.com"  # Change this to your domain

# Ask for domain
read -p "Enter your domain name (or IP address): " DOMAIN
read -p "Enter MySQL root password: " -s MYSQL_ROOT_PASS
echo ""
read -p "Enter MySQL database password for rhhc user: " -s MYSQL_PASS
echo ""

echo -e "${GREEN}[1/8] Installing system dependencies...${NC}"
apt-get update
apt-get install -y curl git nginx mysql-server certbot python3-certbot-nginx

# Install Node.js 22
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

echo -e "${GREEN}[2/8] Setting up project directory...${NC}"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Copy project files (assuming you've uploaded them to /tmp)
if [ -d "/tmp/rhhc-deploy" ]; then
    cp -r /tmp/rhhc-deploy/backend_invoice_management_RHHC-main/backend_invoice_management_RHHC-main/* $BACKEND_DIR/ 2>/dev/null || true
    cp -r /tmp/rhhc-deploy/frontend_invoice_management_RHHC-main/frontend_invoice_management_RHHC-main/* $FRONTEND_DIR/ 2>/dev/null || true
else
    echo -e "${YELLOW}Please upload your project files to /tmp/rhhc-deploy/ first${NC}"
    echo "Structure should be:"
    echo "  /tmp/rhhc-deploy/backend_invoice_management_RHHC-main/backend_invoice_management_RHHC-main/"
    echo "  /tmp/rhhc-deploy/frontend_invoice_management_RHHC-main/frontend_invoice_management_RHHC-main/"
    exit 1
fi

mkdir -p $BACKEND_DIR $FRONTEND_DIR

echo -e "${GREEN}[3/8] Setting up MySQL database...${NC}"
mysql -u root -p"$MYSQL_ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS rhhc_invoice CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'rhhc_user'@'localhost' IDENTIFIED BY '$MYSQL_PASS';
GRANT ALL PRIVILEGES ON rhhc_invoice.* TO 'rhhc_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Import SQL dump if available
if [ -f "$PROJECT_DIR/rhhc_invoice.sql" ]; then
    mysql -u rhhc_user -p"$MYSQL_PASS" rhhc_invoice < "$PROJECT_DIR/rhhc_invoice.sql"
    echo "Database imported successfully!"
fi

echo -e "${GREEN}[4/8] Setting up Backend...${NC}"
cd $BACKEND_DIR

# Create .env file
cat > .env <<EOF
PORT=5000
DB_HOST=localhost
DB_USER=rhhc_user
DB_PASSWORD=$MYSQL_PASS
DB_NAME=rhhc_invoice
JWT_SECRET=$(openssl rand -hex 32)
REFRESH_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d
NODE_ENV=production
EOF

npm install --production

# Create uploads directory
mkdir -p src/uploads/temp
chown -R www-data:www-data $BACKEND_DIR

echo -e "${GREEN}[5/8] Setting up Frontend...${NC}"
cd $FRONTEND_DIR

# Create .env.production
cat > .env.production <<EOF
NEXT_PUBLIC_API_URL=http://$DOMAIN/api
NEXT_PUBLIC_FIREBASE_API_KEY=dummy
NEXT_PUBLIC_FIREBASE_APP_ID=dummy
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy
NEXT_PUBLIC_FIREBASE_DATABASE_URL=dummy
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=dummy
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy
EOF

PUPPETEER_SKIP_DOWNLOAD=true npm install
npm run build

echo -e "${GREEN}[6/8] Setting up systemd services...${NC}"

# Backend service
cat > /etc/systemd/system/rhhc-backend.service <<EOF
[Unit]
Description=RHHC Invoice Backend API
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=$BACKEND_DIR/.env

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
WorkingDirectory=$FRONTEND_DIR
ExecStart=/usr/bin/npx next start -p 3000
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable rhhc-backend rhhc-frontend
systemctl start rhhc-backend rhhc-frontend

echo -e "${GREEN}[7/8] Setting up Nginx...${NC}"
cat > /etc/nginx/sites-available/rhhc-invoice <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
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
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Host \$host;
        client_max_body_size 20M;
    }
}
EOF

ln -sf /etc/nginx/sites-available/rhhc-invoice /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo -e "${GREEN}[8/8] Setting up SSL (Let's Encrypt)...${NC}"
read -p "Do you have a domain name pointing to this server? (y/n): " HAS_DOMAIN
if [ "$HAS_DOMAIN" = "y" ]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    echo "SSL certificate installed!"
else
    echo "Skipping SSL setup. You can run 'certbot --nginx -d your-domain.com' later."
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN} Deployment Complete! 🎉${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Frontend: http://$DOMAIN"
echo "Backend:  http://$DOMAIN/api"
echo ""
echo "Login credentials:"
echo "  Mobile: 7404084849"
echo "  Password: (check your database)"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status rhhc-backend"
echo "  sudo systemctl status rhhc-frontend"
echo "  sudo journalctl -u rhhc-backend -f"
echo "  sudo journalctl -u rhhc-frontend -f"
echo ""
