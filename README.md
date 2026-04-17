# 👑 EduGuard AI — Full-Stack Academic Intelligence Platform

A royal gold & black themed full-stack web application for AI-powered student performance analysis and early warning system.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

---

### 1. Start the Backend

```bash
cd backend
npm install
node server.js
```

Backend runs at → **http://localhost:5000**

---

### 2. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → **http://localhost:3000**

---

## 🔐 Login Credentials

| Role    | Email                  | Password     |
|---------|------------------------|--------------|
| Admin   | admin@muj.edu          | admin123     |
| Teacher | teacher@muj.edu        | teacher123   |

---

## 📱 Features

### 📊 Dashboard
- Live stat cards: total students, high-risk count, avg attendance, avg GPA
- Donut chart: risk distribution (High / Medium / Low)
- Bar charts: attendance bands, GPA distribution
- At-risk student list with progress bars

### 🎓 Student Management
- View all 12 pre-loaded students
- Search by name or roll number
- Filter by risk level
- Add new students with slider-based form
- Edit existing records
- Delete students

### 🔮 ML Risk Prediction Engine
- Select any student → instant AI risk analysis
- Manual input mode: adjust 5 sliders and predict
- Risk score (0–100), risk level badge, predicted grade
- Factor-by-factor breakdown with progress bars
- Actionable recommendation text

### 📤 Data Upload
- Drag & drop CSV upload
- Live preview of file contents
- Parse and bulk-upload multiple students at once
- Instant prediction results on upload
- CSV format guide / sample loader

---

## 🏗 Architecture

```
eduguard/
├── backend/
│   ├── server.js          ← Express.js REST API
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx         ← Complete React app (all pages)
    │   └── main.jsx        ← Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

### Backend API Endpoints

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | /api/auth/login              | Login → returns JWT            |
| GET    | /api/auth/me                 | Get current user               |
| GET    | /api/students                | List all students + predictions|
| POST   | /api/students                | Add new student                |
| PUT    | /api/students/:id            | Update student                 |
| DELETE | /api/students/:id            | Delete student                 |
| GET    | /api/analytics/summary       | Dashboard summary stats        |
| GET    | /api/analytics/predict/:id   | Predict risk for student       |
| POST   | /api/upload                  | Bulk upload CSV rows           |

---

## 🤖 ML Prediction Algorithm

Weighted risk score (0–100):

| Factor        | Weight |
|---------------|--------|
| Attendance    | 30%    |
| Internal Exam | 25%    |
| Assignments   | 20%    |
| Study Hours   | 15%    |
| Previous GPA  | 10%    |

Risk Levels:
- **HIGH** (≥60): F/D predicted — immediate intervention
- **MEDIUM** (35–59): C/B predicted — monitor closely  
- **LOW** (<35): A/B+ predicted — on track

---

## 🎨 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React 18 + Vite     |
| Styling   | Pure CSS (in-JS)    |
| Backend   | Express.js          |
| Auth      | JWT + bcryptjs      |
| Charts    | Custom SVG/CSS      |

---

*EduGuard AI — CCE3270 PBL Project | Manipal University Jaipur | Jan–May 2026*
*By: Navroop Singh Walia (23FE10CCE00017)*
