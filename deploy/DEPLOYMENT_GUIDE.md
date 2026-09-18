# RHHC Invoice Management - VPS Deployment Guide

## 🖥️ VPS Deployment (Step by Step)

### Requirements
- Ubuntu 22.04 / Debian 12 VPS (min 1GB RAM)
- Domain name (optional but recommended for SSL)
- SSH access to VPS

---

### Option 1: Docker Deployment (Recommended - Easiest)

#### Step 1: VPS pe Docker install karo
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Docker install
curl -fsSL https://get.docker.com | sh
sudo apt install docker-compose-plugin -y
```

#### Step 2: Project files upload karo
```bash
# Local machine se:
scp -r . root@your-vps-ip:/root/rhhc-invoice

# Ya git clone karo:
cd /root
git clone <your-repo-url> rhhc-invoice
cd rhhc-invoice
```

#### Step 3: Docker Compose se start karo
```bash
docker compose up -d
```

Bas! Ab `http://your-vps-ip` pe site live hai.

#### Useful Docker Commands:
```bash
docker compose logs -f          # Logs dekho
docker compose restart          # Restart karo
docker compose down             # Stop karo
docker compose up -d --build    # Rebuild karo
```

---

### Option 2: Manual VPS Deployment (Without Docker)

#### Step 1: Server Setup
```bash
ssh root@your-vps-ip

# System update
apt update && apt upgrade -y

# Node.js 22 install
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# MySQL install
apt install -y mysql-server
mysql_secure_installation

# Nginx install
apt install -y nginx
```

#### Step 2: Project Upload
```bash
mkdir -p /var/www/rhhc-invoice
# Local se files upload karo:
scp -r . root@your-vps-ip:/var/www/rhhc-invoice/
```

#### Step 3: MySQL Database Setup
```bash
mysql -u root -p

# MySQL shell mein:
CREATE DATABASE rhhc_invoice CHARACTER SET utf8mb4;
CREATE USER 'rhhc_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL ON rhhc_invoice.* TO 'rhhc_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# SQL dump import
mysql -u rhhc_user -p rhhc_invoice < rhhc_invoice.sql
```

#### Step 4: Backend Setup
```bash
cd /var/www/rhhc-invoice/backend_invoice_management_RHHC-main/backend_invoice_management_RHHC-main

# .env file banao
cat > .env << 'EOF'
PORT=5000
DB_HOST=localhost
DB_USER=rhhc_user
DB_PASSWORD=strong_password_here
DB_NAME=rhhc_invoice
JWT_SECRET=change-this-to-random-string
REFRESH_SECRET=change-this-to-random-string
JWT_EXPIRES_IN=7d
NODE_ENV=production
EOF

# Dependencies install
npm install --production

# Test karo
node src/server.js
# "Server is running on port 5000" dikhna chahiye
# Ctrl+C se band karo
```

#### Step 5: Frontend Setup
```bash
cd /var/www/rhhc-invoice/frontend_invoice_management_RHHC-main/frontend_invoice_management_RHHC-main

# .env.production banao
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=http://your-domain.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=dummy
NEXT_PUBLIC_FIREBASE_APP_ID=dummy
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy
NEXT_PUBLIC_FIREBASE_DATABASE_URL=dummy
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=dummy
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy
EOF

# Install & Build
PUPPETEER_SKIP_DOWNLOAD=true npm install
npm run build
```

#### Step 6: Systemd Services (Auto-start on reboot)
```bash
# Backend service
cat > /etc/systemd/system/rhhc-backend.service << 'EOF'
[Unit]
Description=RHHC Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/rhhc-invoice/backend_invoice_management_RHHC-main/backend_invoice_management_RHHC-main
ExecStart=/usr/bin/node src/server.js
Restart=always
EnvironmentFile=/var/www/rhhc-invoice/backend_invoice_management_RHHC-main/backend_invoice_management_RHHC-main/.env

[Install]
WantedBy=multi-user.target
EOF

# Frontend service
cat > /etc/systemd/system/rhhc-frontend.service << 'EOF'
[Unit]
Description=RHHC Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/rhhc-invoice/frontend_invoice_management_RHHC-main/frontend_invoice_management_RHHC-main
ExecStart=/usr/bin/npx next start -p 3000
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable & Start
systemctl daemon-reload
systemctl enable --now rhhc-backend rhhc-frontend
chown -R www-data:www-data /var/www/rhhc-invoice
```

#### Step 7: Nginx Configuration
```bash
cat > /etc/nginx/sites-available/rhhc << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 20M;
    }
}
EOF

ln -s /etc/nginx/sites-available/rhhc /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

#### Step 8: SSL (HTTPS) Setup
```bash
# Domain point kiya hai toh:
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🔐 Login Credentials (After Deployment)
- **Mobile:** `7404084849`
- **Password:** (MySQL database mein jo bhi set hai)

Password reset karne ke liye:
```bash
# Node.js script se naya password hash generate karo
node -e "const b=require('bcrypt'); console.log(b.hashSync('newpassword', 10))"

# MySQL mein update karo
mysql -u rhhc_user -p rhhc_invoice
UPDATE users SET password = 'generated_hash_here' WHERE mobile = '7404084849';
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend start nahi ho raha | `journalctl -u rhhc-backend -f` se logs dekho |
| Frontend blank page | `npm run build` successful tha check karo |
| Database connection error | MySQL credentials check karo `.env` mein |
| 502 Bad Gateway | Backend service running hai check karo |
| CORS error | `app.js` mein `origin` array mein apna domain add karo |

---

## 📝 Important Notes

1. **Security:** `.env` files mein strong passwords use karo
2. **Backup:** Regular MySQL backups lo: `mysqldump -u rhhc_user -p rhhc_invoice > backup.sql`
3. **Updates:** Code update ke baad `systemctl restart rhhc-backend rhhc-frontend`
4. **Logs:** `journalctl -u rhhc-backend -f` for real-time logs
