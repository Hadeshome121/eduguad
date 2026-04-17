const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'eduguard_royal_secret_2026';

// ─── IN-MEMORY DATA STORE ─────────────────────────────────────────────────────
let users = [
  { id: 1, name: 'Dr. Siddhanta Kumar Singh', email: 'admin@muj.edu', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { id: 2, name: 'Prof. Ananya Sharma', email: 'teacher@muj.edu', password: bcrypt.hashSync('teacher123', 10), role: 'teacher' },
];

let students = [
  { id: 1, name: 'Navroop Singh Walia',   rollNo: '23FE10CCE00017', attendance: 88, assignments: 92, internalExam: 78, studyHours: 6.5, prevGPA: 8.2, branch: 'CCE', semester: 6 },
  { id: 2, name: 'Priya Mehta',           rollNo: '23FE10CCE00018', attendance: 45, assignments: 50, internalExam: 42, studyHours: 2.0, prevGPA: 5.1, branch: 'CCE', semester: 6 },
  { id: 3, name: 'Arjun Patel',           rollNo: '23FE10CCE00019', attendance: 92, assignments: 88, internalExam: 85, studyHours: 7.0, prevGPA: 8.9, branch: 'CCE', semester: 6 },
  { id: 4, name: 'Sneha Reddy',           rollNo: '23FE10CCE00020', attendance: 60, assignments: 65, internalExam: 58, studyHours: 3.5, prevGPA: 6.4, branch: 'CCE', semester: 6 },
  { id: 5, name: 'Rahul Gupta',           rollNo: '23FE10CCE00021', attendance: 35, assignments: 40, internalExam: 30, studyHours: 1.5, prevGPA: 4.2, branch: 'CCE', semester: 6 },
  { id: 6, name: 'Kavya Nair',            rollNo: '23FE10CCE00022', attendance: 95, assignments: 96, internalExam: 91, studyHours: 8.5, prevGPA: 9.4, branch: 'CCE', semester: 6 },
  { id: 7, name: 'Rohan Verma',           rollNo: '23FE10CCE00023', attendance: 72, assignments: 75, internalExam: 68, studyHours: 5.0, prevGPA: 7.1, branch: 'CCE', semester: 6 },
  { id: 8, name: 'Ishaan Chopra',         rollNo: '23FE10CCE00024', attendance: 55, assignments: 48, internalExam: 52, studyHours: 2.8, prevGPA: 5.8, branch: 'CCE', semester: 6 },
  { id: 9, name: 'Ananya Das',            rollNo: '23FE10CCE00025', attendance: 80, assignments: 83, internalExam: 76, studyHours: 5.8, prevGPA: 7.8, branch: 'CCE', semester: 6 },
  { id: 10, name: 'Vikram Singh',         rollNo: '23FE10CCE00026', attendance: 40, assignments: 35, internalExam: 38, studyHours: 1.8, prevGPA: 4.5, branch: 'CCE', semester: 6 },
  { id: 11, name: 'Deepika Joshi',        rollNo: '23FE10CCE00027', attendance: 87, assignments: 90, internalExam: 82, studyHours: 6.2, prevGPA: 8.5, branch: 'CCE', semester: 6 },
  { id: 12, name: 'Siddharth Kumar',      rollNo: '23FE10CCE00028', attendance: 68, assignments: 70, internalExam: 65, studyHours: 4.5, prevGPA: 6.9, branch: 'CCE', semester: 6 },
];

// ─── ML PREDICTION ENGINE ────────────────────────────────────────────────────
function predictRisk(student) {
  const { attendance, assignments, internalExam, studyHours, prevGPA } = student;

  // Weighted risk score (0-100, higher = more at risk)
  const attScore    = (100 - attendance) * 0.30;
  const assignScore = (100 - assignments) * 0.20;
  const examScore   = (100 - internalExam) * 0.25;
  const studyScore  = Math.max(0, (8 - studyHours) / 8 * 100) * 0.15;
  const gpaScore    = Math.max(0, (10 - prevGPA) / 10 * 100) * 0.10;

  const riskScore = attScore + assignScore + examScore + studyScore + gpaScore;
  const clamped   = Math.min(100, Math.max(0, riskScore));

  let riskLevel, predictedGrade, recommendation;
  if (clamped >= 60) {
    riskLevel = 'HIGH';
    predictedGrade = 'F/D';
    recommendation = 'Immediate intervention required. Schedule counselling and extra tutoring.';
  } else if (clamped >= 35) {
    riskLevel = 'MEDIUM';
    predictedGrade = 'C/B';
    recommendation = 'Monitor closely. Encourage study group participation.';
  } else {
    riskLevel = 'LOW';
    predictedGrade = 'A/B+';
    recommendation = 'On track. Continue current performance.';
  }

  return { riskScore: Math.round(clamped), riskLevel, predictedGrade, recommendation };
}

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// ─── STUDENT ROUTES ───────────────────────────────────────────────────────────
app.get('/api/students', authMiddleware, (req, res) => {
  const enriched = students.map(s => ({ ...s, ...predictRisk(s) }));
  res.json(enriched);
});

app.get('/api/students/:id', authMiddleware, (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json({ ...student, ...predictRisk(student) });
});

app.post('/api/students', authMiddleware, (req, res) => {
  const newStudent = { id: students.length + 1, ...req.body };
  students.push(newStudent);
  res.status(201).json({ ...newStudent, ...predictRisk(newStudent) });
});

app.put('/api/students/:id', authMiddleware, (req, res) => {
  const idx = students.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  students[idx] = { ...students[idx], ...req.body };
  res.json({ ...students[idx], ...predictRisk(students[idx]) });
});

app.delete('/api/students/:id', authMiddleware, (req, res) => {
  const idx = students.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  students.splice(idx, 1);
  res.json({ success: true });
});

// ─── ANALYTICS ROUTES ────────────────────────────────────────────────────────
app.get('/api/analytics/summary', authMiddleware, (req, res) => {
  const enriched = students.map(s => ({ ...s, ...predictRisk(s) }));
  const high   = enriched.filter(s => s.riskLevel === 'HIGH').length;
  const medium = enriched.filter(s => s.riskLevel === 'MEDIUM').length;
  const low    = enriched.filter(s => s.riskLevel === 'LOW').length;
  const avgAttendance   = Math.round(enriched.reduce((a, s) => a + s.attendance, 0) / enriched.length);
  const avgGPA          = (enriched.reduce((a, s) => a + s.prevGPA, 0) / enriched.length).toFixed(2);
  const avgRisk         = Math.round(enriched.reduce((a, s) => a + s.riskScore, 0) / enriched.length);

  res.json({
    totalStudents: students.length,
    highRisk: high,
    mediumRisk: medium,
    lowRisk: low,
    avgAttendance,
    avgGPA,
    avgRisk,
    riskDistribution: [
      { label: 'Low Risk', value: low, color: '#D4AF37' },
      { label: 'Medium Risk', value: medium, color: '#8B6914' },
      { label: 'High Risk', value: high, color: '#C0392B' },
    ],
    attendanceBands: [
      { band: '0-50%',  count: enriched.filter(s => s.attendance < 50).length },
      { band: '50-70%', count: enriched.filter(s => s.attendance >= 50 && s.attendance < 70).length },
      { band: '70-85%', count: enriched.filter(s => s.attendance >= 70 && s.attendance < 85).length },
      { band: '85-100%',count: enriched.filter(s => s.attendance >= 85).length },
    ],
    gpaDistribution: [
      { band: '<5.0',   count: enriched.filter(s => s.prevGPA < 5).length },
      { band: '5-7',    count: enriched.filter(s => s.prevGPA >= 5 && s.prevGPA < 7).length },
      { band: '7-8.5',  count: enriched.filter(s => s.prevGPA >= 7 && s.prevGPA < 8.5).length },
      { band: '8.5-10', count: enriched.filter(s => s.prevGPA >= 8.5).length },
    ],
  });
});

app.get('/api/analytics/predict/:id', authMiddleware, (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: 'Not found' });
  res.json({ ...student, ...predictRisk(student) });
});

// Upload CSV (simulated)
app.post('/api/upload', authMiddleware, (req, res) => {
  const { rows } = req.body;
  if (!rows || !Array.isArray(rows)) return res.status(400).json({ error: 'Invalid data' });
  const added = [];
  rows.forEach(row => {
    const s = { id: students.length + 1, ...row };
    students.push(s);
    added.push({ ...s, ...predictRisk(s) });
  });
  res.json({ success: true, added: added.length, students: added });
});

app.listen(5000, () => console.log('EduGuard API running on http://localhost:5000'));
