# 🚀 VPS Pe Live Kaise Karein (Step by Step)

## Zaroori Cheezein:
- ✅ Ubuntu VPS (already hai)
- ✅ Domain name (already hai)
- ✅ Domain ka DNS VPS IP pe point kiya hua hona chahiye

---

## Step 1: Apne Computer Se Project VPS Pe Upload Karo

```bash
# Apne computer pe terminal kholo aur run karo:
# (your-vps-ip ki jagah apna VPS IP daalo)

scp -r . root@your-vps-ip:/root/rhhc-invoice
```

Ya agar Git use karte ho:
```bash
# VPS pe SSH karo
ssh root@your-vps-ip

# VPS pe project clone karo
cd /root
git clone <your-repo-url> rhhc-invoice
```

---

## Step 2: VPS Pe SSH Karo

```bash
ssh root@your-vps-ip
```

---

## Step 3: Deploy Script Run Karo (Bas Ek Command!)

```bash
cd /root/rhhc-invoice
sudo bash deploy/setup-vps.sh
```

Script aapse 2 cheezein poochega:
1. **Domain name** → apna domain daalo (e.g. `rhhcinvoice.com`)
2. **Email** → SSL certificate ke liye

**Bas! 5-10 minute mein sab automatic ho jayega:**
- ✅ MySQL install + database import
- ✅ Node.js install + backend setup
- ✅ Frontend build + setup
- ✅ Nginx reverse proxy
- ✅ SSL certificate (HTTPS)
- ✅ Auto-start services

---

## Step 4: Website Kholo! 🎉

Browser mein jao: **https://yourdomain.com**

### Login:
- **Mobile:** `7404084849`
- **Password:** (database mein jo bhi hai)

---

## 📋 Important Commands (Baad Mein Kaam Aayenge)

```bash
# Status check karo
sudo systemctl status rhhc-backend
sudo systemctl status rhhc-frontend

# Restart karo (code update ke baad)
sudo systemctl restart rhhc-backend
sudo systemctl restart rhhc-frontend

# Logs dekho (error debug ke liye)
sudo tail -f /var/log/rhhc-backend.log
sudo tail -f /var/log/rhhc-frontend.log

# Credentials dekho
cat /var/www/rhhc-invoice/CREDENTIALS.txt
```

---

## ⚠️ Agar Koi Problem Aaye

| Problem | Solution |
|---------|----------|
| Website nahi khul rahi | `sudo systemctl status nginx` check karo |
| "502 Bad Gateway" | `sudo systemctl restart rhhc-backend rhhc-frontend` |
| SSL error | Domain DNS sahi point hai check karo, phir: `sudo certbot --nginx -d yourdomain.com` |
| Login nahi ho raha | MySQL password check karo: `cat /var/www/rhhc-invoice/CREDENTIALS.txt` |

---

## 🔄 Code Update Kaise Karein (Future Mein)

```bash
# 1. Naya code VPS pe daalo
scp -r ./backend_invoice_management_RHHC-main/backend_invoice_management_RHHC-main/* root@your-vps-ip:/var/www/rhhc-invoice/backend/

# 2. VPS pe SSH karo
ssh root@your-vps-ip

# 3. Backend dependencies install (agar package.json change hua)
cd /var/www/rhhc-invoice/backend && npm install --production

# 4. Frontend rebuild (agar frontend change hua)
cd /var/www/rhhc-invoice/frontend && npm run build

# 5. Restart karo
sudo systemctl restart rhhc-backend rhhc-frontend
```

---

## 🗄️ Database Backup

```bash
# Backup lo
mysqldump -u rhhc_user -p rhhc_invoice > backup_$(date +%Y%m%d).sql

# Restore karo
mysql -u rhhc_user -p rhhc_invoice < backup_20260919.sql
```
