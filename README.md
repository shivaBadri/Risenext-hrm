# Rise Next HRM Portal

Full-stack HR Management System built with Node.js + Express backend and vanilla HTML/CSS/JS frontend.

---

## 🗂️ Project Structure

```
risenext-hrm/
├── backend/
│   ├── server.js            ← Main Express server
│   ├── db.js                ← In-memory database (seed data)
│   ├── .env                 ← Environment variables
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js          ← JWT auth middleware
│   └── routes/
│       ├── auth.js          ← POST /api/auth/login
│       ├── employees.js     ← CRUD /api/employees
│       ├── attendance.js    ← /api/attendance
│       ├── leaves.js        ← /api/leaves
│       ├── payroll.js       ← /api/payroll
│       ├── announcements.js ← /api/announcements
│       ├── jobs.js          ← /api/jobs
│       └── dashboard.js     ← /api/dashboard/summary
└── frontend/
    └── index.html           ← Full SPA (served by Express)
```

---

## 🚀 Local Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Start server
```bash
npm start
# Or for auto-reload:
npm run dev
```

### 3. Open browser
```
http://localhost:5000
```

### Login credentials
```
Email:    admin@risenext.com
Password: admin@123
```

---

## 📬 Postman API Collection

### Base URL
```
http://localhost:5000/api
```

### Authentication
All routes (except /auth/login) require:
```
Header: Authorization: Bearer <token>
```

---

### AUTH

#### Login
```
POST /api/auth/login
Body: { "email": "admin@risenext.com", "password": "admin@123" }
```

#### Get current user
```
GET /api/auth/me
```

---

### EMPLOYEES

#### Get all employees
```
GET /api/employees
GET /api/employees?department=IT
GET /api/employees?status=Active
GET /api/employees?search=Badri
```

#### Get employee by ID
```
GET /api/employees/RN-1001
```

#### Add employee
```
POST /api/employees
Body: {
  "name": "New Employee",
  "email": "new@risenext.com",
  "role": "Tele Caller",
  "department": "AR",
  "salary": 12000,
  "phone": "+91-9999999999"
}
```

#### Update employee
```
PUT /api/employees/RN-1001
Body: { "salary": 28000, "status": "Probation" }
```

#### Delete employee
```
DELETE /api/employees/RN-1001
```

---

### ATTENDANCE

#### Get today's attendance
```
GET /api/attendance?date=2026-04-20
```

#### Get attendance by employee + month
```
GET /api/attendance?employeeId=RN-1001&month=4&year=2026
```

#### Manual mark attendance
```
POST /api/attendance
Body: {
  "employeeId": "RN-1001",
  "date": "2026-04-21",
  "checkIn": "09:10",
  "checkOut": "18:15",
  "status": "Present"
}
```

#### Check in
```
POST /api/attendance/checkin
Body: { "employeeId": "RN-1001" }
```

#### Check out
```
PUT /api/attendance/checkout/:attendanceRecordId
```

#### Summary
```
GET /api/attendance/summary/RN-1001?month=4&year=2026
```

---

### LEAVES

#### Get all leaves
```
GET /api/leaves
GET /api/leaves?status=Pending
GET /api/leaves?employeeId=RN-1005
```

#### Apply leave
```
POST /api/leaves
Body: {
  "employeeId": "RN-1001",
  "type": "Casual Leave",
  "fromDate": "2026-04-25",
  "toDate": "2026-04-25",
  "reason": "Personal work"
}
```

#### Approve leave
```
PUT /api/leaves/:id/approve
```

#### Reject leave
```
PUT /api/leaves/:id/reject
```

#### Cancel leave
```
DELETE /api/leaves/:id
```

---

### PAYROLL

#### Get payroll
```
GET /api/payroll?month=April&year=2026
GET /api/payroll?employeeId=RN-1001
```

#### Generate payroll for all employees
```
POST /api/payroll/generate
Body: { "month": "May", "year": 2026 }
```

#### Mark payslip as paid
```
PUT /api/payroll/:id/disburse
```

---

### ANNOUNCEMENTS

#### Get all announcements
```
GET /api/announcements
```

#### Post announcement
```
POST /api/announcements
Body: {
  "title": "Office closed on Friday",
  "body": "The office will remain closed on 25 Apr due to maintenance.",
  "category": "General"
}
```

#### Delete announcement
```
DELETE /api/announcements/:id
```

---

### JOBS

#### Get all jobs
```
GET /api/jobs
```

#### Post a job
```
POST /api/jobs
Body: {
  "title": "Data Analyst",
  "department": "AR",
  "location": "Hyderabad"
}
```

#### Update job
```
PUT /api/jobs/:id
Body: { "stage": "Interview", "applicants": 15 }
```

#### Delete job
```
DELETE /api/jobs/:id
```

---

### DASHBOARD

#### Summary
```
GET /api/dashboard/summary
```

---

## 🌐 Production Deployment (Render / Railway / Fly.io)

### Render (free tier)
1. Push this folder to a GitHub repo
2. Create new **Web Service** on render.com
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variable: `JWT_SECRET=your_secret_here`
7. The frontend is served automatically at the same URL

### Environment Variables for Production
```
PORT=5000
JWT_SECRET=<strong-random-string>
NODE_ENV=production
FRONTEND_URL=https://your-app.onrender.com
```

---

## 🔐 Default Login
```
Email:    admin@risenext.com
Password: admin@123
```
Change the password by updating bcrypt hash in db.js before deploying to production.

---

## 📌 Notes
- Data is in-memory and resets on server restart. Replace `db.js` with MongoDB/PostgreSQL for persistence.
- All API routes are JWT-protected except `/api/auth/login` and `/api/health`.
