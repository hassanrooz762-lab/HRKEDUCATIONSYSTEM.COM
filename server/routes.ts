import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, queryAll, queryOne, executeRun, saveDbToDisk, seedDatabase } from './db.js';
import {
  AuthenticatedRequest,
  requireStaffAuth,
  checkLoginRateLimit,
  recordLoginAttempt,
  signStaffToken,
  logAudit,
} from './auth.js';

export const apiRouter = Router();

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================

// Public School Info
apiRouter.get('/public/info', async (_req, res) => {
  try {
    const db = await getDb();
    const studentCountRes = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM students');
    const resultCountRes = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM results');
    const noticeCountRes = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM notifications WHERE is_published = 1');

    res.json({
      success: true,
      data: {
        schoolName: 'HRK Education System',
        campus: 'Peshawar Cantt',
        location: 'Main Road, Near to Ras Shadi Hall, Peshawar Cantt, Pakistan',
        principal: 'Hassan Rooz',
        phones: ['0300-0598873', '0300-5442333'],
        email: 'info@hrkeducation.edu.pk',
        established: '2015',
        stats: {
          totalStudents: studentCountRes?.count || 0,
          totalResults: resultCountRes?.count || 0,
          activeAnnouncements: noticeCountRes?.count || 0,
        },
      },
    });
  } catch (err) {
    console.error('Error fetching public info:', err);
    res.status(500).json({ success: false, error: 'Failed to load school information' });
  }
});

// Search Public Result
// Required: Student Name, Father Name, Class, Roll Number
apiRouter.get('/public/results', async (req, res) => {
  try {
    const studentName = String(req.query.studentName || '').trim();
    const fatherName = String(req.query.fatherName || '').trim();
    const studentClass = String(req.query.class || '').trim();
    const rollNumber = String(req.query.rollNumber || '').trim();

    if (!studentName || !fatherName || !studentClass || !rollNumber) {
      res.status(400).json({
        success: false,
        error: 'Please provide Student Name, Father Name, Class, and Roll Number.',
      });
      return;
    }

    const db = await getDb();
    // Search with case-insensitive trim matching
    const sql = `
      SELECT * FROM results
      WHERE LOWER(TRIM(roll_number)) = LOWER(?)
        AND LOWER(TRIM(class)) = LOWER(?)
        AND LOWER(TRIM(student_name)) LIKE LOWER(?)
        AND LOWER(TRIM(father_name)) LIKE LOWER(?)
      ORDER BY id DESC LIMIT 1;
    `;
    const result = queryOne<Record<string, unknown>>(db, sql, [
      rollNumber,
      studentClass,
      `%${studentName}%`,
      `%${fatherName}%`,
    ]);

    if (!result) {
      res.status(404).json({
        success: false,
        error: 'No matching examination record found. Please verify Student Name, Father Name, Class, and Roll Number.',
      });
      return;
    }

    // Fetch up to 10 subject slots for this result
    const subjects = queryAll<Record<string, unknown>>(
      db,
      'SELECT slot_number, subject_name, attendance_marks, obtained_marks, total_marks FROM result_subjects WHERE result_id = ? ORDER BY slot_number ASC;',
      [result.id]
    );

    res.json({
      success: true,
      data: {
        ...result,
        subjects,
      },
    });
  } catch (err) {
    console.error('Error fetching public result:', err);
    res.status(500).json({ success: false, error: 'Failed to query student result' });
  }
});

// Search Public Fees
// Required: Student Name, Roll Number, Class
apiRouter.get('/public/fees', async (req, res) => {
  try {
    const studentName = String(req.query.studentName || '').trim();
    const rollNumber = String(req.query.rollNumber || '').trim();
    const studentClass = String(req.query.class || '').trim();

    if (!studentName || !rollNumber || !studentClass) {
      res.status(400).json({
        success: false,
        error: 'Please provide Student Name, Roll Number, and Class.',
      });
      return;
    }

    const db = await getDb();
    const sql = `
      SELECT * FROM fees
      WHERE LOWER(TRIM(roll_number)) = LOWER(?)
        AND LOWER(TRIM(class)) = LOWER(?)
        AND LOWER(TRIM(student_name)) LIKE LOWER(?)
      ORDER BY id ASC;
    `;
    const feeRecords = queryAll<Record<string, unknown>>(db, sql, [
      rollNumber,
      studentClass,
      `%${studentName}%`,
    ]);

    if (feeRecords.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No fee records found for this student. Please check credentials or contact the school accounts office.',
      });
      return;
    }

    // Compute fee aggregates
    let totalFee = 0;
    let totalBalance = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    for (const r of feeRecords) {
      const mf = Number(r.monthly_fee) || 0;
      const bal = Number(r.balance) || 0;
      totalFee += mf;
      totalBalance += bal;
      if (r.status === 'Paid') paidCount++;
      else unpaidCount++;
    }

    const totalPaid = totalFee - totalBalance;

    res.json({
      success: true,
      data: {
        student: {
          name: feeRecords[0].student_name,
          rollNumber: feeRecords[0].roll_number,
          class: feeRecords[0].class,
        },
        summary: {
          totalAssessed: totalFee,
          totalPaid: totalPaid > 0 ? totalPaid : 0,
          outstandingBalance: totalBalance,
          recordsCount: feeRecords.length,
          paidMonths: paidCount,
          unpaidMonths: unpaidCount,
        },
        records: feeRecords,
      },
    });
  } catch (err) {
    console.error('Error fetching public fees:', err);
    res.status(500).json({ success: false, error: 'Failed to query student fee history' });
  }
});

// Public Notifications
apiRouter.get('/public/notifications', async (req, res) => {
  try {
    const category = String(req.query.category || '').trim();
    const db = await getDb();

    let sql = 'SELECT * FROM notifications WHERE is_published = 1 ';
    const params: unknown[] = [];

    if (category && category !== 'All') {
      sql += 'AND LOWER(category) = LOWER(?) ';
      params.push(category);
    }
    sql += 'ORDER BY date DESC, id DESC LIMIT 50;';

    const notifications = queryAll<Record<string, unknown>>(db, sql, params);
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('Error fetching public notifications:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve notifications' });
  }
});

// Submit Online Admission Application
apiRouter.post('/public/admissions', async (req, res) => {
  try {
    const {
      student_name,
      father_name,
      father_cnic,
      gender,
      dob,
      applied_class,
      previous_school,
      previous_marks,
      phone,
      address,
    } = req.body || {};

    if (!student_name || !father_name || !applied_class || !phone || !address) {
      res.status(400).json({
        success: false,
        error: 'Please fill in all mandatory fields: Student Name, Father Name, Class, Phone, and Address.',
      });
      return;
    }

    const db = await getDb();
    const now = new Date().toISOString();
    // Unique application number e.g. HRK-2026-XXXX
    const appRandom = Math.floor(1000 + Math.random() * 9000);
    const applicationNo = `HRK-ADM-${new Date().getFullYear()}-${appRandom}`;

    const insertRes = executeRun(
      db,
      `INSERT INTO admissions (application_no, student_name, father_name, father_cnic, gender, dob, applied_class, previous_school, previous_marks, phone, address, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        applicationNo,
        String(student_name).trim(),
        String(father_name).trim(),
        father_cnic ? String(father_cnic).trim() : null,
        gender ? String(gender).trim() : 'Male',
        dob ? String(dob).trim() : null,
        String(applied_class).trim(),
        previous_school ? String(previous_school).trim() : null,
        previous_marks ? String(previous_marks).trim() : null,
        String(phone).trim(),
        String(address).trim(),
        now,
      ]
    );

    logAudit(
      db,
      'public-portal',
      'ADMISSION_SUBMITTED',
      'ADMISSION',
      insertRes.lastInsertRowid,
      `New admission application ${applicationNo} for ${student_name} (${applied_class})`
    );

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully!',
      applicationNo,
      data: {
        id: insertRes.lastInsertRowid,
        applicationNo,
        studentName: student_name,
        fatherName: father_name,
        appliedClass: applied_class,
        phone,
        submittedAt: now,
      },
    });
  } catch (err) {
    console.error('Error submitting admission:', err);
    res.status(500).json({ success: false, error: 'Failed to submit admission application' });
  }
});

// Check Admission Application Status
apiRouter.get('/public/admissions/status', async (req, res) => {
  try {
    const q = String(req.query.q || req.query.applicationNo || req.query.phone || '').trim();
    if (!q) {
      res.status(400).json({ success: false, error: 'Please provide Application Number or Phone Number.' });
      return;
    }

    const db = await getDb();
    const sql = `
      SELECT * FROM admissions
      WHERE LOWER(TRIM(application_no)) = LOWER(?) OR LOWER(TRIM(phone)) = LOWER(?)
      ORDER BY id DESC LIMIT 5;
    `;
    const applications = queryAll<Record<string, unknown>>(db, sql, [q, q]);

    if (applications.length === 0) {
      res.status(404).json({ success: false, error: 'No admission applications found with the provided details.' });
      return;
    }

    res.json({ success: true, data: applications });
  } catch (err) {
    console.error('Error checking admission status:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve admission record' });
  }
});

// ==========================================
// 2. STAFF AUTHENTICATION ENDPOINTS
// ==========================================

// Staff Login with code HRK777 or username/password
apiRouter.post('/staff/login', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const rateCheck = checkLoginRateLimit(ip);
  if (!rateCheck.allowed) {
    res.status(429).json({
      success: false,
      error: `Too many failed attempts. Security lock active. Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
    });
    return;
  }

  const { code, username, password } = req.body || {};
  const db = await getDb();

  const accessCode = (code || password || '').trim();
  const uname = (username || 'admin').trim();

  // 1. Check if user provided initial code HRK777 or 777 or env STAFF_SECRET_CODE
  const envSecretCode = process.env.STAFF_SECRET_CODE || 'HRK777';
  let authenticatedUser: { id: number; username: string; display_name: string; role: string } | null = null;

  if (accessCode === envSecretCode || accessCode === 'HRK777' || accessCode === '777') {
    // Quick secret-code match
    const adminUser = queryOne<{ id: number; username: string; display_name: string; role: string }>(
      db,
      'SELECT id, username, display_name, role FROM staff_users LIMIT 1;'
    );
    if (adminUser) {
      authenticatedUser = adminUser;
    } else {
      authenticatedUser = { id: 1, username: 'admin', display_name: 'Principal Hassan Rooz', role: 'admin' };
    }
  } else {
    // Check database staff_users table
    const userRow = queryOne<{ id: number; username: string; password_hash: string; display_name: string; role: string }>(
      db,
      'SELECT id, username, password_hash, display_name, role FROM staff_users WHERE LOWER(username) = LOWER(?);',
      [uname]
    );

    if (userRow && bcrypt.compareSync(accessCode, userRow.password_hash)) {
      authenticatedUser = {
        id: userRow.id,
        username: userRow.username,
        display_name: userRow.display_name,
        role: userRow.role,
      };
    }
  }

  if (!authenticatedUser) {
    recordLoginAttempt(ip, false);
    res.status(401).json({
      success: false,
      error: 'Invalid staff credentials or authorization code. Access denied.',
    });
    return;
  }

  recordLoginAttempt(ip, true);

  const payload = {
    userId: authenticatedUser.id,
    username: authenticatedUser.username,
    displayName: authenticatedUser.display_name,
    role: authenticatedUser.role,
  };

  const token = signStaffToken(payload);

  // Set secure HTTP-only cookie
  res.cookie('hrk_staff_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Update last login
  const now = new Date().toISOString();
  executeRun(db, 'UPDATE staff_users SET last_login = ? WHERE id = ?;', [now, authenticatedUser.id]);
  logAudit(db, authenticatedUser.username, 'LOGIN', 'STAFF_USER', authenticatedUser.id, 'Staff logged in successfully');

  res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user: payload,
  });
});

// Staff Check Session
apiRouter.get('/staff/me', requireStaffAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.staffUser,
  });
});

// Staff Logout
apiRouter.post('/staff/logout', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  const db = await getDb();
  if (req.staffUser) {
    logAudit(db, req.staffUser.username, 'LOGOUT', 'STAFF_USER', req.staffUser.userId, 'Staff logged out');
  }

  res.clearCookie('hrk_staff_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// 3. STAFF PROTECTED ENDPOINTS
// ==========================================

// Staff Dashboard Metrics
apiRouter.get('/staff/dashboard', requireStaffAuth, async (_req, res) => {
  try {
    const db = await getDb();
    const students = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM students')?.count || 0;
    const results = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM results')?.count || 0;
    const feeRecords = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM fees')?.count || 0;
    const unpaidFeeCount = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM fees WHERE status != 'Paid'")?.count || 0;
    const unpaidFeeTotal = queryOne<{ total: number }>(db, "SELECT COALESCE(SUM(balance), 0) as total FROM fees WHERE status != 'Paid'")?.total || 0;
    const notificationsCount = queryOne<{ count: number }>(db, 'SELECT COUNT(*) as count FROM notifications')?.count || 0;

    const recentAudit = queryAll<Record<string, unknown>>(
      db,
      'SELECT * FROM audit_logs ORDER BY id DESC LIMIT 10;'
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents: students,
          totalResults: results,
          totalFeeRecords: feeRecords,
          unpaidCount: unpaidFeeCount,
          totalOutstandingBalance: unpaidFeeTotal,
          totalNotifications: notificationsCount,
        },
        recentAudit,
      },
    });
  } catch (err) {
    console.error('Staff dashboard error:', err);
    res.status(500).json({ success: false, error: 'Failed to load staff dashboard' });
  }
});

// ------------------------------------------
// STUDENT MANAGEMENT
// ------------------------------------------

// List Students
apiRouter.get('/staff/students', requireStaffAuth, async (req, res) => {
  try {
    const db = await getDb();
    const q = String(req.query.q || '').trim();
    const classFilter = String(req.query.class || '').trim();

    let sql = 'SELECT * FROM students WHERE 1=1 ';
    const params: unknown[] = [];

    if (q) {
      sql += 'AND (LOWER(name) LIKE LOWER(?) OR LOWER(father_name) LIKE LOWER(?) OR LOWER(roll_number) LIKE LOWER(?)) ';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (classFilter && classFilter !== 'All') {
      sql += 'AND LOWER(class) = LOWER(?) ';
      params.push(classFilter);
    }

    sql += 'ORDER BY class ASC, CAST(roll_number AS INTEGER) ASC, id ASC;';
    const students = queryAll<Record<string, unknown>>(db, sql, params);

    res.json({ success: true, data: students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve students' });
  }
});

// Get Student by ID
apiRouter.get('/staff/students/:id', requireStaffAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const student = queryOne<Record<string, unknown>>(db, 'SELECT * FROM students WHERE id = ?;', [id]);

    if (!student) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    const results = queryAll<Record<string, unknown>>(db, 'SELECT * FROM results WHERE roll_number = ? AND class = ?;', [
      student.roll_number,
      student.class,
    ]);

    const fees = queryAll<Record<string, unknown>>(db, 'SELECT * FROM fees WHERE roll_number = ? AND class = ? ORDER BY id ASC;', [
      student.roll_number,
      student.class,
    ]);

    res.json({ success: true, data: { student, results, fees } });
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ success: false, error: 'Failed to get student details' });
  }
});

// Create Student
apiRouter.post('/staff/students', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roll_number, name, father_name, class: studentClass, phone, address } = req.body || {};

    if (!roll_number || !name || !father_name || !studentClass) {
      res.status(400).json({ success: false, error: 'Roll number, student name, father name, and class are required.' });
      return;
    }

    const db = await getDb();
    // Check unique roll_number + class
    const existing = queryOne(db, 'SELECT id FROM students WHERE roll_number = ? AND class = ?;', [
      String(roll_number).trim(),
      String(studentClass).trim(),
    ]);

    if (existing) {
      res.status(400).json({
        success: false,
        error: `A student with Roll No. ${roll_number} already exists in Class ${studentClass}.`,
      });
      return;
    }

    const now = new Date().toISOString();
    const result = executeRun(
      db,
      `INSERT INTO students (roll_number, name, father_name, class, phone, address, admission_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        String(roll_number).trim(),
        String(name).trim(),
        String(father_name).trim(),
        String(studentClass).trim(),
        phone ? String(phone).trim() : null,
        address ? String(address).trim() : null,
        now.split('T')[0],
        now,
        now,
      ]
    );

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'STUDENT_CREATED',
      'STUDENT',
      result.lastInsertRowid,
      `Enrolled student ${name} (Roll: ${roll_number}, Class: ${studentClass})`
    );

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: { id: result.lastInsertRowid },
    });
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ success: false, error: 'Failed to create student record' });
  }
});

// Update Student
apiRouter.put('/staff/students/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { roll_number, name, father_name, class: studentClass, phone, address } = req.body || {};

    if (!roll_number || !name || !father_name || !studentClass) {
      res.status(400).json({ success: false, error: 'Roll number, student name, father name, and class are required.' });
      return;
    }

    const db = await getDb();
    const existing = queryOne<{ id: number }>(db, 'SELECT id FROM students WHERE id = ?;', [id]);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Student record not found' });
      return;
    }

    // Check conflict
    const conflict = queryOne<{ id: number }>(
      db,
      'SELECT id FROM students WHERE roll_number = ? AND class = ? AND id != ?;',
      [String(roll_number).trim(), String(studentClass).trim(), id]
    );
    if (conflict) {
      res.status(400).json({
        success: false,
        error: `Another student with Roll No. ${roll_number} already exists in Class ${studentClass}.`,
      });
      return;
    }

    const now = new Date().toISOString();
    executeRun(
      db,
      `UPDATE students
       SET roll_number = ?, name = ?, father_name = ?, class = ?, phone = ?, address = ?, updated_at = ?
       WHERE id = ?;`,
      [
        String(roll_number).trim(),
        String(name).trim(),
        String(father_name).trim(),
        String(studentClass).trim(),
        phone ? String(phone).trim() : null,
        address ? String(address).trim() : null,
        now,
        id,
      ]
    );

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'STUDENT_UPDATED',
      'STUDENT',
      id,
      `Updated student #${id}: ${name} (Roll: ${roll_number}, Class: ${studentClass})`
    );

    res.json({ success: true, message: 'Student record updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ success: false, error: 'Failed to update student record' });
  }
});

// Delete Student
apiRouter.delete('/staff/students/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const student = queryOne<{ id: number; name: string; roll_number: string; class: string }>(
      db,
      'SELECT id, name, roll_number, class FROM students WHERE id = ?;',
      [id]
    );

    if (!student) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    executeRun(db, 'DELETE FROM students WHERE id = ?;', [id]);
    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'STUDENT_DELETED',
      'STUDENT',
      id,
      `Deleted student #${id}: ${student.name} (${student.roll_number}, Class ${student.class})`
    );

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ success: false, error: 'Failed to delete student record' });
  }
});

// ------------------------------------------
// RESULT MANAGEMENT
// ------------------------------------------

// List All Results
apiRouter.get('/staff/results', requireStaffAuth, async (req, res) => {
  try {
    const db = await getDb();
    const q = String(req.query.q || '').trim();
    const classFilter = String(req.query.class || '').trim();

    let sql = 'SELECT * FROM results WHERE 1=1 ';
    const params: unknown[] = [];

    if (q) {
      sql += 'AND (LOWER(student_name) LIKE LOWER(?) OR LOWER(father_name) LIKE LOWER(?) OR LOWER(roll_number) LIKE LOWER(?)) ';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (classFilter && classFilter !== 'All') {
      sql += 'AND LOWER(class) = LOWER(?) ';
      params.push(classFilter);
    }

    sql += 'ORDER BY id DESC;';
    const results = queryAll<Record<string, unknown>>(db, sql, params);

    // Fetch subjects for each result
    const resultsWithSubjects = results.map((r) => {
      const subjects = queryAll(
        db,
        'SELECT slot_number, subject_name, attendance_marks, obtained_marks, total_marks FROM result_subjects WHERE result_id = ? ORDER BY slot_number ASC;',
        [r.id]
      );
      return { ...r, subjects };
    });

    res.json({ success: true, data: resultsWithSubjects });
  } catch (err) {
    console.error('Error fetching staff results:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve results' });
  }
});

// Get Single Result
apiRouter.get('/staff/results/:id', requireStaffAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const result = queryOne<Record<string, unknown>>(db, 'SELECT * FROM results WHERE id = ?;', [id]);

    if (!result) {
      res.status(404).json({ success: false, error: 'Result record not found' });
      return;
    }

    const subjects = queryAll(
      db,
      'SELECT slot_number, subject_name, attendance_marks, obtained_marks, total_marks FROM result_subjects WHERE result_id = ? ORDER BY slot_number ASC;',
      [id]
    );

    res.json({ success: true, data: { ...result, subjects } });
  } catch (err) {
    console.error('Error fetching result:', err);
    res.status(500).json({ success: false, error: 'Failed to get result details' });
  }
});

// Helper for validating and computing results
interface SubjectInput {
  slot_number?: number;
  subject_name: string;
  attendance_marks?: number;
  obtained_marks: number;
  total_marks: number;
}

function processSubjectRows(subjectsInput: unknown[]): {
  validSubjects: { slot_number: number; subject_name: string; attendance_marks: number; obtained_marks: number; total_marks: number }[];
  totalObtained: number;
  totalMarks: number;
  percentage: number;
} {
  if (!Array.isArray(subjectsInput)) {
    throw new Error('Subjects list must be an array.');
  }

  const validSubjects: { slot_number: number; subject_name: string; attendance_marks: number; obtained_marks: number; total_marks: number }[] = [];
  let totalObtained = 0;
  let totalMarks = 0;

  for (let i = 0; i < subjectsInput.length; i++) {
    const sub = subjectsInput[i] as SubjectInput;
    if (!sub) continue;

    const name = String(sub.subject_name || '').trim();
    // Allow empty slots
    if (!name) continue;

    const slotNumber = Number(sub.slot_number) || i + 1;
    const att = Math.max(0, Number(sub.attendance_marks) || 0);
    const obt = Number(sub.obtained_marks) || 0;
    const tot = Number(sub.total_marks) || 0;

    if (tot <= 0) {
      throw new Error(`Subject "${name}": Total Marks must be greater than 0.`);
    }
    if (obt < 0) {
      throw new Error(`Subject "${name}": Obtained Marks cannot be negative.`);
    }
    if (obt > tot) {
      throw new Error(`Subject "${name}": Obtained Marks (${obt}) cannot exceed Total Marks (${tot}).`);
    }

    totalObtained += obt;
    totalMarks += tot;

    validSubjects.push({
      slot_number: slotNumber,
      subject_name: name,
      attendance_marks: att,
      obtained_marks: obt,
      total_marks: tot,
    });
  }

  if (validSubjects.length === 0) {
    throw new Error('Please enter at least one subject with valid marks.');
  }

  if (validSubjects.length > 10) {
    throw new Error('Maximum 10 subject slots allowed.');
  }

  const percentage = totalMarks > 0 ? parseFloat(((totalObtained / totalMarks) * 100).toFixed(2)) : 0;

  return { validSubjects, totalObtained, totalMarks, percentage };
}

// Create Result
apiRouter.post('/staff/results', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      student_name,
      father_name,
      class: studentClass,
      roll_number,
      exam_title,
      exam_session,
      paper_percentage,
      position,
      remarks,
      subjects,
    } = req.body || {};

    if (!student_name || !father_name || !studentClass || !roll_number) {
      res.status(400).json({
        success: false,
        error: 'Student Name, Father Name, Class, and Roll Number are required.',
      });
      return;
    }

    const { validSubjects, totalObtained, totalMarks, percentage } = processSubjectRows(subjects);
    const db = await getDb();

    // Check optional link to student table
    const student = queryOne<{ id: number }>(db, 'SELECT id FROM students WHERE roll_number = ? AND class = ?;', [
      String(roll_number).trim(),
      String(studentClass).trim(),
    ]);

    const now = new Date().toISOString();
    const paperPct = paper_percentage !== undefined && paper_percentage !== '' ? Number(paper_percentage) : null;

    const resInsert = executeRun(
      db,
      `INSERT INTO results (student_id, roll_number, student_name, father_name, class, exam_title, exam_session, total_obtained, total_marks, overall_percentage, paper_percentage, position, remarks, created_at, updated_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        student ? student.id : null,
        String(roll_number).trim(),
        String(student_name).trim(),
        String(father_name).trim(),
        String(studentClass).trim(),
        exam_title ? String(exam_title).trim() : 'Annual Examination',
        exam_session ? String(exam_session).trim() : '2025-2026',
        totalObtained,
        totalMarks,
        percentage,
        paperPct,
        position ? String(position).trim() : null,
        remarks ? String(remarks).trim() : null,
        now,
        now,
        req.staffUser?.username || 'staff',
      ]
    );

    const resultId = resInsert.lastInsertRowid;

    for (const sub of validSubjects) {
      executeRun(
        db,
        `INSERT INTO result_subjects (result_id, slot_number, subject_name, attendance_marks, obtained_marks, total_marks)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [resultId, sub.slot_number, sub.subject_name, sub.attendance_marks, sub.obtained_marks, sub.total_marks]
      );
    }

    saveDbToDisk();

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'RESULT_CREATED',
      'RESULT',
      resultId,
      `Created transcript for ${student_name} (${roll_number}, Class ${studentClass}) with ${validSubjects.length} subjects. Total: ${totalObtained}/${totalMarks} (${percentage}%)`
    );

    res.status(201).json({
      success: true,
      message: 'Student examination result successfully created and stored permanently.',
      data: { id: resultId, totalObtained, totalMarks, percentage },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating result:', error);
    res.status(400).json({ success: false, error: error.message || 'Failed to create result' });
  }
});

// Update Result
apiRouter.put('/staff/results/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const existing = queryOne<{ id: number }>(db, 'SELECT id FROM results WHERE id = ?;', [id]);

    if (!existing) {
      res.status(404).json({ success: false, error: 'Result record not found' });
      return;
    }

    const {
      student_name,
      father_name,
      class: studentClass,
      roll_number,
      exam_title,
      exam_session,
      paper_percentage,
      position,
      remarks,
      subjects,
    } = req.body || {};

    if (!student_name || !father_name || !studentClass || !roll_number) {
      res.status(400).json({
        success: false,
        error: 'Student Name, Father Name, Class, and Roll Number are required.',
      });
      return;
    }

    const { validSubjects, totalObtained, totalMarks, percentage } = processSubjectRows(subjects);

    const student = queryOne<{ id: number }>(db, 'SELECT id FROM students WHERE roll_number = ? AND class = ?;', [
      String(roll_number).trim(),
      String(studentClass).trim(),
    ]);

    const now = new Date().toISOString();
    const paperPct = paper_percentage !== undefined && paper_percentage !== '' ? Number(paper_percentage) : null;

    executeRun(
      db,
      `UPDATE results
       SET student_id = ?, roll_number = ?, student_name = ?, father_name = ?, class = ?, exam_title = ?, exam_session = ?,
           total_obtained = ?, total_marks = ?, overall_percentage = ?, paper_percentage = ?, position = ?, remarks = ?, updated_at = ?
       WHERE id = ?;`,
      [
        student ? student.id : null,
        String(roll_number).trim(),
        String(student_name).trim(),
        String(father_name).trim(),
        String(studentClass).trim(),
        exam_title ? String(exam_title).trim() : 'Annual Examination',
        exam_session ? String(exam_session).trim() : '2025-2026',
        totalObtained,
        totalMarks,
        percentage,
        paperPct,
        position ? String(position).trim() : null,
        remarks ? String(remarks).trim() : null,
        now,
        id,
      ]
    );

    // Replace subject slots
    executeRun(db, 'DELETE FROM result_subjects WHERE result_id = ?;', [id]);

    for (const sub of validSubjects) {
      executeRun(
        db,
        `INSERT INTO result_subjects (result_id, slot_number, subject_name, attendance_marks, obtained_marks, total_marks)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [id, sub.slot_number, sub.subject_name, sub.attendance_marks, sub.obtained_marks, sub.total_marks]
      );
    }

    saveDbToDisk();

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'RESULT_UPDATED',
      'RESULT',
      id,
      `Updated transcript #${id} for ${student_name} (${roll_number}, Class ${studentClass}). New Total: ${totalObtained}/${totalMarks} (${percentage}%)`
    );

    res.json({
      success: true,
      message: 'Student examination result updated successfully.',
      data: { id, totalObtained, totalMarks, percentage },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error updating result:', error);
    res.status(400).json({ success: false, error: error.message || 'Failed to update result' });
  }
});

// Delete Result
apiRouter.delete('/staff/results/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const existing = queryOne<{ id: number; student_name: string; roll_number: string; class: string }>(
      db,
      'SELECT id, student_name, roll_number, class FROM results WHERE id = ?;',
      [id]
    );

    if (!existing) {
      res.status(404).json({ success: false, error: 'Result not found' });
      return;
    }

    executeRun(db, 'DELETE FROM result_subjects WHERE result_id = ?;', [id]);
    executeRun(db, 'DELETE FROM results WHERE id = ?;', [id]);
    saveDbToDisk();

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'RESULT_DELETED',
      'RESULT',
      id,
      `Deleted transcript #${id} of ${existing.student_name} (Roll: ${existing.roll_number}, Class: ${existing.class})`
    );

    res.json({ success: true, message: 'Result record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting result:', err);
    res.status(500).json({ success: false, error: 'Failed to delete result record' });
  }
});

// ------------------------------------------
// FEE MANAGEMENT
// ------------------------------------------

// List Staff Fees
apiRouter.get('/staff/fees', requireStaffAuth, async (req, res) => {
  try {
    const db = await getDb();
    const q = String(req.query.q || '').trim();
    const status = String(req.query.status || '').trim();
    const classFilter = String(req.query.class || '').trim();
    const monthFilter = String(req.query.month || '').trim();

    let sql = 'SELECT * FROM fees WHERE 1=1 ';
    const params: unknown[] = [];

    if (q) {
      sql += 'AND (LOWER(student_name) LIKE LOWER(?) OR LOWER(roll_number) LIKE LOWER(?)) ';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (status && status !== 'All') {
      sql += 'AND LOWER(status) = LOWER(?) ';
      params.push(status);
    }

    if (classFilter && classFilter !== 'All') {
      sql += 'AND LOWER(class) = LOWER(?) ';
      params.push(classFilter);
    }

    if (monthFilter && monthFilter !== 'All') {
      sql += 'AND LOWER(month) LIKE LOWER(?) ';
      params.push(`%${monthFilter}%`);
    }

    sql += 'ORDER BY id DESC;';
    const fees = queryAll<Record<string, unknown>>(db, sql, params);

    res.json({ success: true, data: fees });
  } catch (err) {
    console.error('Error listing staff fees:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve fee records' });
  }
});

// Create Fee Record
apiRouter.post('/staff/fees', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { student_name, roll_number, class: studentClass, month, monthly_fee, status, balance, received_by, payment_date, notes } = req.body || {};

    if (!student_name || !roll_number || !studentClass || !month) {
      res.status(400).json({
        success: false,
        error: 'Student Name, Roll Number, Class, and Month are required fields.',
      });
      return;
    }

    const feeAmount = Number(monthly_fee);
    const balanceAmount = Number(balance);

    if (isNaN(feeAmount) || feeAmount < 0) {
      res.status(400).json({ success: false, error: 'Monthly fee must be a valid positive amount.' });
      return;
    }

    if (isNaN(balanceAmount) || balanceAmount < 0) {
      res.status(400).json({ success: false, error: 'Balance / Outstanding amount cannot be negative.' });
      return;
    }

    const feeStatus = ['Paid', 'Unpaid', 'Partially Paid'].includes(status) ? status : 'Unpaid';
    const db = await getDb();

    // Check link to student
    const student = queryOne<{ id: number }>(db, 'SELECT id FROM students WHERE roll_number = ? AND class = ?;', [
      String(roll_number).trim(),
      String(studentClass).trim(),
    ]);

    const now = new Date().toISOString();
    const insertRes = executeRun(
      db,
      `INSERT INTO fees (student_id, roll_number, student_name, class, month, monthly_fee, status, balance, received_by, payment_date, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        student ? student.id : null,
        String(roll_number).trim(),
        String(student_name).trim(),
        String(studentClass).trim(),
        String(month).trim(),
        feeAmount,
        feeStatus,
        balanceAmount,
        received_by ? String(received_by).trim() : null,
        payment_date ? String(payment_date).trim() : null,
        notes ? String(notes).trim() : null,
        now,
        now,
      ]
    );

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'FEE_CREATED',
      'FEE',
      insertRes.lastInsertRowid,
      `Created fee record for ${student_name} (${month}): Rs. ${feeAmount} (Status: ${feeStatus}, Balance: Rs. ${balanceAmount})`
    );

    res.status(201).json({
      success: true,
      message: 'Monthly fee record created successfully',
      data: { id: insertRes.lastInsertRowid },
    });
  } catch (err) {
    console.error('Error creating fee record:', err);
    res.status(500).json({ success: false, error: 'Failed to create fee record' });
  }
});

// Update Fee Record
apiRouter.put('/staff/fees/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const existing = queryOne<{ id: number }>(db, 'SELECT id FROM fees WHERE id = ?;', [id]);

    if (!existing) {
      res.status(404).json({ success: false, error: 'Fee record not found' });
      return;
    }

    const { student_name, roll_number, class: studentClass, month, monthly_fee, status, balance, received_by, payment_date, notes } = req.body || {};

    if (!student_name || !roll_number || !studentClass || !month) {
      res.status(400).json({
        success: false,
        error: 'Student Name, Roll Number, Class, and Month are required.',
      });
      return;
    }

    const feeAmount = Number(monthly_fee);
    const balanceAmount = Number(balance);

    if (isNaN(feeAmount) || feeAmount < 0) {
      res.status(400).json({ success: false, error: 'Monthly fee must be a valid positive amount.' });
      return;
    }

    if (isNaN(balanceAmount) || balanceAmount < 0) {
      res.status(400).json({ success: false, error: 'Balance / Outstanding cannot be negative.' });
      return;
    }

    const feeStatus = ['Paid', 'Unpaid', 'Partially Paid'].includes(status) ? status : 'Unpaid';
    const now = new Date().toISOString();

    executeRun(
      db,
      `UPDATE fees
       SET student_name = ?, roll_number = ?, class = ?, month = ?, monthly_fee = ?, status = ?, balance = ?, received_by = ?, payment_date = ?, notes = ?, updated_at = ?
       WHERE id = ?;`,
      [
        String(student_name).trim(),
        String(roll_number).trim(),
        String(studentClass).trim(),
        String(month).trim(),
        feeAmount,
        feeStatus,
        balanceAmount,
        received_by ? String(received_by).trim() : null,
        payment_date ? String(payment_date).trim() : null,
        notes ? String(notes).trim() : null,
        now,
        id,
      ]
    );

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'FEE_UPDATED',
      'FEE',
      id,
      `Updated fee record #${id} for ${student_name} (${month}): Rs. ${feeAmount}, Status: ${feeStatus}`
    );

    res.json({ success: true, message: 'Fee record updated successfully' });
  } catch (err) {
    console.error('Error updating fee:', err);
    res.status(500).json({ success: false, error: 'Failed to update fee record' });
  }
});

// Delete Fee Record
apiRouter.delete('/staff/fees/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const existing = queryOne<{ id: number; student_name: string; month: string }>(
      db,
      'SELECT id, student_name, month FROM fees WHERE id = ?;',
      [id]
    );

    if (!existing) {
      res.status(404).json({ success: false, error: 'Fee record not found' });
      return;
    }

    executeRun(db, 'DELETE FROM fees WHERE id = ?;', [id]);

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'FEE_DELETED',
      'FEE',
      id,
      `Deleted fee record #${id} for ${existing.student_name} (${existing.month})`
    );

    res.json({ success: true, message: 'Fee record deleted successfully' });
  } catch (err) {
    console.error('Error deleting fee record:', err);
    res.status(500).json({ success: false, error: 'Failed to delete fee record' });
  }
});

// ------------------------------------------
// NOTIFICATION MANAGEMENT
// ------------------------------------------

// List All Notifications (Staff)
apiRouter.get('/staff/notifications', requireStaffAuth, async (_req, res) => {
  try {
    const db = await getDb();
    const notifications = queryAll<Record<string, unknown>>(
      db,
      'SELECT * FROM notifications ORDER BY date DESC, id DESC;'
    );
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('Error listing notifications:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve notifications' });
  }
});

// Create Notification
apiRouter.post('/staff/notifications', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, message, date, category, is_published } = req.body || {};

    if (!title || !message || !date) {
      res.status(400).json({ success: false, error: 'Title, message, and date are required.' });
      return;
    }

    const validCategories = ['General', 'Exam', 'Holiday', 'Fee', 'Meeting', 'Important'];
    const cat = validCategories.includes(category) ? category : 'General';
    const isPub = is_published === false || is_published === 0 ? 0 : 1;

    const db = await getDb();
    const now = new Date().toISOString();

    const insertRes = executeRun(
      db,
      `INSERT INTO notifications (title, message, date, category, is_published, author, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        String(title).trim(),
        String(message).trim(),
        String(date).trim(),
        cat,
        isPub,
        req.staffUser?.displayName || 'Administration',
        now,
        now,
      ]
    );

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'NOTIFICATION_CREATED',
      'NOTIFICATION',
      insertRes.lastInsertRowid,
      `Published notice: "${title}" (Category: ${cat})`
    );

    res.status(201).json({
      success: true,
      message: 'Notification published successfully',
      data: { id: insertRes.lastInsertRowid },
    });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ success: false, error: 'Failed to create notification' });
  }
});

// Update Notification
apiRouter.put('/staff/notifications/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const existing = queryOne<{ id: number }>(db, 'SELECT id FROM notifications WHERE id = ?;', [id]);

    if (!existing) {
      res.status(404).json({ success: false, error: 'Notification not found' });
      return;
    }

    const { title, message, date, category, is_published } = req.body || {};

    if (!title || !message || !date) {
      res.status(400).json({ success: false, error: 'Title, message, and date are required.' });
      return;
    }

    const validCategories = ['General', 'Exam', 'Holiday', 'Fee', 'Meeting', 'Important'];
    const cat = validCategories.includes(category) ? category : 'General';
    const isPub = is_published === false || is_published === 0 ? 0 : 1;
    const now = new Date().toISOString();

    executeRun(
      db,
      `UPDATE notifications
       SET title = ?, message = ?, date = ?, category = ?, is_published = ?, updated_at = ?
       WHERE id = ?;`,
      [String(title).trim(), String(message).trim(), String(date).trim(), cat, isPub, now, id]
    );

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'NOTIFICATION_UPDATED',
      'NOTIFICATION',
      id,
      `Updated notice #${id}: "${title}"`
    );

    res.json({ success: true, message: 'Notification updated successfully' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ success: false, error: 'Failed to update notification' });
  }
});

// Delete Notification
apiRouter.delete('/staff/notifications/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();
    const existing = queryOne<{ id: number; title: string }>(db, 'SELECT id, title FROM notifications WHERE id = ?;', [id]);

    if (!existing) {
      res.status(404).json({ success: false, error: 'Notification not found' });
      return;
    }

    executeRun(db, 'DELETE FROM notifications WHERE id = ?;', [id]);

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'NOTIFICATION_DELETED',
      'NOTIFICATION',
      id,
      `Deleted notice #${id}: "${existing.title}"`
    );

    res.json({ success: true, message: 'Notification removed successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ success: false, error: 'Failed to delete notification' });
  }
});

// ------------------------------------------
// AUDIT LOGS & SETTINGS
// ------------------------------------------

// Audit Logs
apiRouter.get('/staff/audit-logs', requireStaffAuth, async (_req, res) => {
  try {
    const db = await getDb();
    const logs = queryAll<Record<string, unknown>>(
      db,
      'SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100;'
    );
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve audit logs' });
  }
});

// Reset Demo Data
apiRouter.post('/staff/reset-demo', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    // Clear existing data
    executeRun(db, 'DELETE FROM result_subjects;');
    executeRun(db, 'DELETE FROM results;');
    executeRun(db, 'DELETE FROM fees;');
    executeRun(db, 'DELETE FROM notifications;');
    executeRun(db, 'DELETE FROM students;');
    executeRun(db, 'DELETE FROM staff_users;');

    // Re-seed
    seedDatabase(db);
    saveDbToDisk();

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'DEMO_DATA_RESET',
      'DATABASE',
      null,
      'Reset school database to standard initial demo records.'
    );

    res.json({
      success: true,
      message: 'Demo dataset successfully restored with default sample classes, examination results, fee records, and announcements.',
    });
  } catch (err) {
    console.error('Error resetting demo data:', err);
    res.status(500).json({ success: false, error: 'Failed to reset demo data' });
  }
});

// Change Staff Password / Access Code
apiRouter.post('/staff/change-password', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'New password/code must be at least 6 characters long.' });
      return;
    }

    const db = await getDb();
    const staffId = req.staffUser?.userId;
    const userRow = queryOne<{ id: number; password_hash: string }>(
      db,
      'SELECT id, password_hash FROM staff_users WHERE id = ?;',
      [staffId]
    );

    if (!userRow) {
      res.status(404).json({ success: false, error: 'Staff account not found' });
      return;
    }

    // Verify current
    const envSecretCode = process.env.STAFF_SECRET_CODE || 'HRK777';
    const isCurrentValid =
      currentPassword === envSecretCode ||
      currentPassword === '777' ||
      currentPassword === 'HRK777' ||
      bcrypt.compareSync(currentPassword, userRow.password_hash);

    if (!isCurrentValid) {
      res.status(400).json({ success: false, error: 'Current password/access code is incorrect.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);
    executeRun(db, 'UPDATE staff_users SET password_hash = ? WHERE id = ?;', [newHash, staffId]);

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'PASSWORD_CHANGED',
      'STAFF_USER',
      staffId ?? null,
      'Staff updated their access credential'
    );

    res.json({ success: true, message: 'Password/code successfully updated. Use new credentials on next sign-in.' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ success: false, error: 'Failed to update credentials' });
  }
});

// ------------------------------------------
// ADMISSION MANAGEMENT (STAFF)
// ------------------------------------------

// List Admissions
apiRouter.get('/staff/admissions', requireStaffAuth, async (req, res) => {
  try {
    const db = await getDb();
    const q = String(req.query.q || '').trim();
    const status = String(req.query.status || '').trim();
    const classFilter = String(req.query.class || '').trim();

    let sql = 'SELECT * FROM admissions WHERE 1=1 ';
    const params: unknown[] = [];

    if (q) {
      sql += 'AND (LOWER(student_name) LIKE LOWER(?) OR LOWER(father_name) LIKE LOWER(?) OR LOWER(application_no) LIKE LOWER(?) OR LOWER(phone) LIKE LOWER(?)) ';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (status && status !== 'All') {
      sql += 'AND LOWER(status) = LOWER(?) ';
      params.push(status);
    }

    if (classFilter && classFilter !== 'All') {
      sql += 'AND LOWER(applied_class) = LOWER(?) ';
      params.push(classFilter);
    }

    sql += 'ORDER BY id DESC;';
    const admissions = queryAll<Record<string, unknown>>(db, sql, params);
    res.json({ success: true, data: admissions });
  } catch (err) {
    console.error('Error listing admissions:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve admission applications' });
  }
});

// Update Admission Status
apiRouter.put('/staff/admissions/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body || {};
    const db = await getDb();

    const existing = queryOne<{ id: number; student_name: string; application_no: string }>(
      db,
      'SELECT id, student_name, application_no FROM admissions WHERE id = ?;',
      [id]
    );

    if (!existing) {
      res.status(404).json({ success: false, error: 'Admission application not found' });
      return;
    }

    executeRun(
      db,
      'UPDATE admissions SET status = ?, notes = ? WHERE id = ?;',
      [status || 'Pending', notes || null, id]
    );

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'ADMISSION_UPDATED',
      'ADMISSION',
      id,
      `Updated application ${existing.application_no} status to "${status}"`
    );

    res.json({ success: true, message: 'Admission status updated successfully' });
  } catch (err) {
    console.error('Error updating admission:', err);
    res.status(500).json({ success: false, error: 'Failed to update admission status' });
  }
});

// Delete Admission Application
apiRouter.delete('/staff/admissions/:id', requireStaffAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const db = await getDb();

    const existing = queryOne<{ id: number; student_name: string; application_no: string }>(
      db,
      'SELECT id, student_name, application_no FROM admissions WHERE id = ?;',
      [id]
    );

    if (!existing) {
      res.status(404).json({ success: false, error: 'Admission application not found' });
      return;
    }

    executeRun(db, 'DELETE FROM admissions WHERE id = ?;', [id]);

    logAudit(
      db,
      req.staffUser?.username || 'staff',
      'ADMISSION_DELETED',
      'ADMISSION',
      id,
      `Deleted application ${existing.application_no} (${existing.student_name})`
    );

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Error deleting admission:', err);
    res.status(500).json({ success: false, error: 'Failed to delete application' });
  }
});
