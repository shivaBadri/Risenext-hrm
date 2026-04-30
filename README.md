# Rise Next HRM

A Human Resource Management system with Employee Login.

---

## Project Structure

```
RiseNext-HRM/
├── Backend/     → Node.js + Express + MongoDB API
└── Frontend/    → React + Vite app
```

---

## Deploying on Render

### Backend (Web Service)
1. Create a **Web Service** on Render
2. Root Directory: `Backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any random secret string
   - `ADMIN_KEY` = a secret key for bulk password reset (default: `risenext_admin_2024`)
   - `PORT` = 5000 (Render sets this automatically)

### Frontend (Static Site)
1. Create a **Static Site** on Render
2. Root Directory: `Frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = your Backend Render URL (e.g. `https://hrm-backend.onrender.com`)

---

## Employee Login

- Default password for all employees: **Employee@123**
- Employees log in with their **email** and password
- Token is valid for 8 hours
- **Old employee records** (with no hashed password) are automatically fixed on first login

---

## Forgot Password

Employees can reset their password from the login page by clicking **"Forgot Password?"**. This resets their password back to the default: **Employee@123**.

---

## Fix Existing Employee Passwords (Admin Utility)

If you have old employee records in the database that were added without a hashed password, call this endpoint once to reset all of them:

```
POST /api/auth/reset-all-passwords
Body: { "adminKey": "risenext_admin_2024" }
```

Change `risenext_admin_2024` to your own `ADMIN_KEY` env variable value.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Employee login |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/forgot-password | Reset password to default |
| POST | /api/auth/reset-all-passwords | Admin: reset ALL employee passwords |
| GET | /api/employees | List all employees |
| POST | /api/employees | Add employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |
