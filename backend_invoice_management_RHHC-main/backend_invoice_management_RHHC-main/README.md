# 🚀 Speedy Node.js Boilerplate

A modular and scalable Node.js backend boilerplate built with Express and MySQL — designed to jumpstart your future fullstack projects quickly.

---

## 🏗️ Features

- 🧱 Clean and modular folder structure
- 🔐 JWT authentication
- 🧾 Joi request validation with custom middleware
- 🧠 MySQL (via `mysql2`) without ORM
- 🎯 Built-in User, Role CRUD (with account/branch mapping)
- 🧰 Reusable `serverResponse` utility for consistent API responses
- 🔄 Transaction-safe operations
- 📦 Ready to extend with  `menu`, `account`, `branch`, etc.

---

## 📁 Folder Structure

```
src/
│
├── config/          # Database connection & configs
├── controllers/     # Route handlers
├── db/              # Database SQL file
├── routes/          # Express routers
├── services/        # Business logic (DB calls, validations)
├── middlewares/     # JWT auth, request validation, etc.
├── validators/      # Joi validation schemas
├── utils/           # Helper functions, response format, etc.
├── app.js           # Express setup
└── server.js        # Entry point
```

---

## ⚙️ Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd speedy-nodejs-boilerplate
npm install
```

### 2. Configure `.env`

```ini
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=speedy_boilerplate
JWT_SECRET=your_secret_key
```

### 3. Setup MySQL Database

Import the SQL schema located at:

```bash
./src/db/speedy_boilerplate_node.sql
```

Make sure MySQL is running.

---

## 🧪 API Endpoints

### 🔐 Auth
```
POST /api/auth/login
```

### 👤 User
```
GET    /api/users?page=1&limit=10
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

All User APIs require `Authorization: Bearer <token>` header.

---

## 🧰 Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": { ... }
}
```

Errors use:

```json
{
  "success": false,
  "message": "Mobile number already exists"
}
```

---

## 📑 Validation

- Joi schemas in `/validators`
- Middleware: `verifyRequest(validateFn)` or `validateBody(schema)`

---

## ✅ Available Middleware

- `auth.js` → JWT verification
- `validate.js` → Request schema validation
- `serverResponse.js` → Unified API responses

---

## 📦 Utilities

- `generateTokenJWT(payload)`
- `currentTimestamp()`
- `generate4DigitCode()` – for MPINs
- `capitalize(str)` – title casing

---

## 📌 Project Scripts

```bash
npm start     # Run production
npm run dev   # Run using nodemon
```

---

## 📚 Postman Collection

Import from:
```
/postman/SpeedyBoilerplate.postman_collection.json
```

Use `{{jwt_token}}` for protected requests.

---

## 🔐 Auth Flow

1. Login using `/auth/login` with mobile + mpin
2. Get JWT token
3. Use token in headers for all protected APIs

---

## 📢 Contributing

Pull requests, suggestions and improvements are welcome! This project is meant to be **cloned and extended**.

---

## 📄 License

MIT © 2025 — Speedy Boilerplate
