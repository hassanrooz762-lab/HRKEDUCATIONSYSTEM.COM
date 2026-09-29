import initSqlJs, { type Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'hrk_school.sqlite');

let dbInstance: Database | null = null;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function saveDbToDisk(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(new Uint8Array(fileBuffer));
      console.log('Loaded existing SQLite database from disk:', DB_PATH);
    } catch (e) {
      console.error('Failed reading existing DB file, creating fresh:', e);
      dbInstance = new SQL.Database();
    }
  } else {
    console.log('Creating fresh SQLite database at:', DB_PATH);
    dbInstance = new SQL.Database();
  }

  initSchema(dbInstance);
  saveDbToDisk();
  return dbInstance;
}

function initSchema(db: Database): void {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  // Staff users table
  db.run(`
    CREATE TABLE IF NOT EXISTS staff_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff',
      created_at TEXT NOT NULL,
      last_login TEXT
    );
  `);

  // Students table
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roll_number TEXT NOT NULL,
      name TEXT NOT NULL,
      father_name TEXT NOT NULL,
      class TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      admission_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(roll_number, class)
    );
  `);

  // Results table
  db.run(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      roll_number TEXT NOT NULL,
      student_name TEXT NOT NULL,
      father_name TEXT NOT NULL,
      class TEXT NOT NULL,
      exam_title TEXT DEFAULT 'Annual Examination',
      exam_session TEXT DEFAULT '2025-2026',
      total_obtained REAL NOT NULL,
      total_marks REAL NOT NULL,
      overall_percentage REAL NOT NULL,
      paper_percentage REAL,
      position TEXT,
      remarks TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    );
  `);

  // Result subjects table (up to 10 configurable subjects)
  db.run(`
    CREATE TABLE IF NOT EXISTS result_subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      result_id INTEGER NOT NULL REFERENCES results(id) ON DELETE CASCADE,
      slot_number INTEGER NOT NULL,
      subject_name TEXT NOT NULL,
      attendance_marks REAL DEFAULT 0,
      obtained_marks REAL NOT NULL,
      total_marks REAL NOT NULL
    );
  `);

  // Fees table
  db.run(`
    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      roll_number TEXT NOT NULL,
      student_name TEXT NOT NULL,
      class TEXT NOT NULL,
      month TEXT NOT NULL,
      monthly_fee REAL NOT NULL,
      status TEXT NOT NULL, -- 'Paid', 'Unpaid', 'Partially Paid'
      balance REAL NOT NULL DEFAULT 0,
      received_by TEXT,
      payment_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL, -- 'General', 'Exam', 'Holiday', 'Fee', 'Meeting', 'Important'
      is_published INTEGER NOT NULL DEFAULT 1,
      author TEXT DEFAULT 'Administration',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Audit logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      staff_username TEXT NOT NULL,
      action_type TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT NOT NULL
    );
  `);

  // Admissions table for online admission applications
  db.run(`
    CREATE TABLE IF NOT EXISTS admissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_no TEXT UNIQUE NOT NULL,
      student_name TEXT NOT NULL,
      father_name TEXT NOT NULL,
      father_cnic TEXT,
      gender TEXT DEFAULT 'Male',
      dob TEXT,
      applied_class TEXT NOT NULL,
      previous_school TEXT,
      previous_marks TEXT,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Interview Scheduled', 'Rejected'
      submitted_at TEXT NOT NULL,
      notes TEXT
    );
  `);

  // Check if staff user exists
  const checkStaff = db.exec("SELECT COUNT(*) as count FROM staff_users;");
  const count = checkStaff.length > 0 && checkStaff[0].values.length > 0 ? (checkStaff[0].values[0][0] as number) : 0;

  if (count === 0) {
    seedDatabase(db);
  } else {
    // Ensure admin user password hash supports '777'
    const defaultSalt = bcrypt.genSaltSync(10);
    const passwordHash777 = bcrypt.hashSync('777', defaultSalt);
    db.run("UPDATE staff_users SET password_hash = ? WHERE username = 'admin';", [passwordHash777]);
  }
}

export function seedDatabase(db: Database): void {
  console.log('Seeding initial HRK Education System database records...');
  const now = new Date().toISOString();

  // 1. Initial Staff user: code 777 (as requested by user)
  // Allow login with code "777" or "HRK777"
  const defaultSalt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('777', defaultSalt);

  db.run(
    `INSERT INTO staff_users (username, password_hash, display_name, role, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    ['admin', passwordHash, 'Principal Hassan Rooz', 'admin', now]
  );

  // 2. Demo Students
  const demoStudents = [
    { roll_number: '101', name: 'Muhammad Ali', father_name: 'Tariq Mahmood', class: '10th', phone: '0312-3456789', address: 'Peshawar Cantt' },
    { roll_number: '102', name: 'Ayesha Khan', father_name: 'Rahim Ullah Khan', class: '10th', phone: '0333-9876543', address: 'Saddar, Peshawar' },
    { roll_number: '103', name: 'Hamza Rooz', father_name: 'Hassan Rooz', class: '10th', phone: '0300-5442333', address: 'Main Road Peshawar Cantt' },
    { roll_number: '201', name: 'Fatima Noor', father_name: 'Noor Mohammad', class: '9th', phone: '0345-1122334', address: 'Gulbahar, Peshawar' },
    { roll_number: '202', name: 'Bilal Ahmad', father_name: 'Zubair Ahmad', class: '9th', phone: '0301-7788990', address: 'Hayatabad, Peshawar' },
    { roll_number: '301', name: 'Zainab Bibi', father_name: 'Kamran Shah', class: '8th', phone: '0321-4455667', address: 'Warsak Road, Peshawar' },
  ];

  for (const s of demoStudents) {
    db.run(
      `INSERT INTO students (roll_number, name, father_name, class, phone, address, admission_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.roll_number, s.name, s.father_name, s.class, s.phone, s.address, '2024-04-01', now, now]
    );
  }

  // 3. Demo Results with up to 10 configurable subjects
  // Student 101 - Muhammad Ali
  const s1Subjects = [
    { name: 'English Compulsory', att: 18, obt: 88, tot: 100 },
    { name: 'Urdu', att: 20, obt: 85, tot: 100 },
    { name: 'Mathematics', att: 19, obt: 94, tot: 100 },
    { name: 'Physics (Theory + Practical)', att: 19, obt: 91, tot: 100 },
    { name: 'Chemistry', att: 18, obt: 87, tot: 100 },
    { name: 'Biology / Computer Science', att: 20, obt: 93, tot: 100 },
    { name: 'Islamiyat Compulsory', att: 20, obt: 47, tot: 50 },
    { name: 'Pakistan Studies', att: 19, obt: 46, tot: 50 },
    { name: 'Tarjuma-tul-Quran', att: 20, obt: 48, tot: 50 },
  ];
  let s1Obt = s1Subjects.reduce((acc, cur) => acc + cur.obt, 0);
  let s1Tot = s1Subjects.reduce((acc, cur) => acc + cur.tot, 0);
  let s1Pct = parseFloat(((s1Obt / s1Tot) * 100).toFixed(2));

  db.run(
    `INSERT INTO results (student_id, roll_number, student_name, father_name, class, exam_title, exam_session, total_obtained, total_marks, overall_percentage, paper_percentage, position, remarks, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [1, '101', 'Muhammad Ali', 'Tariq Mahmood', '10th', 'Annual Examination', '2025-2026', s1Obt, s1Tot, s1Pct, 89.5, '1st Position', 'Outstanding academic performance. Keep up the high standards!', now, now, 'admin']
  );

  const r1Res = db.exec("SELECT last_insert_rowid() as id;");
  const r1Id = r1Res[0].values[0][0] as number;

  s1Subjects.forEach((sub, idx) => {
    db.run(
      `INSERT INTO result_subjects (result_id, slot_number, subject_name, attendance_marks, obtained_marks, total_marks)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [r1Id, idx + 1, sub.name, sub.att, sub.obt, sub.tot]
    );
  });

  // Student 102 - Ayesha Khan
  const s2Subjects = [
    { name: 'English Compulsory', att: 19, obt: 84, tot: 100 },
    { name: 'Urdu', att: 20, obt: 88, tot: 100 },
    { name: 'Mathematics', att: 18, obt: 90, tot: 100 },
    { name: 'Physics', att: 19, obt: 86, tot: 100 },
    { name: 'Chemistry', att: 19, obt: 89, tot: 100 },
    { name: 'Biology', att: 20, obt: 91, tot: 100 },
    { name: 'Islamiyat', att: 20, obt: 45, tot: 50 },
    { name: 'Pakistan Studies', att: 19, obt: 44, tot: 50 },
    { name: 'Tarjuma-tul-Quran', att: 20, obt: 47, tot: 50 },
  ];
  let s2Obt = s2Subjects.reduce((acc, cur) => acc + cur.obt, 0);
  let s2Tot = s2Subjects.reduce((acc, cur) => acc + cur.tot, 0);
  let s2Pct = parseFloat(((s2Obt / s2Tot) * 100).toFixed(2));

  db.run(
    `INSERT INTO results (student_id, roll_number, student_name, father_name, class, exam_title, exam_session, total_obtained, total_marks, overall_percentage, paper_percentage, position, remarks, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [2, '102', 'Ayesha Khan', 'Rahim Ullah Khan', '10th', 'Annual Examination', '2025-2026', s2Obt, s2Tot, s2Pct, 87.2, '2nd Position', 'Excellent dedication and discipline across all subjects.', now, now, 'admin']
  );

  const r2Res = db.exec("SELECT last_insert_rowid() as id;");
  const r2Id = r2Res[0].values[0][0] as number;

  s2Subjects.forEach((sub, idx) => {
    db.run(
      `INSERT INTO result_subjects (result_id, slot_number, subject_name, attendance_marks, obtained_marks, total_marks)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [r2Id, idx + 1, sub.name, sub.att, sub.obt, sub.tot]
    );
  });

  // Student 201 - Fatima Noor (9th)
  const s4Subjects = [
    { name: 'English', att: 18, obt: 82, tot: 100 },
    { name: 'Urdu', att: 19, obt: 79, tot: 100 },
    { name: 'General Science', att: 20, obt: 88, tot: 100 },
    { name: 'General Mathematics', att: 17, obt: 85, tot: 100 },
    { name: 'Islamiyat', att: 20, obt: 46, tot: 50 },
    { name: 'Pakistan Studies', att: 19, obt: 45, tot: 50 },
    { name: 'Computer Basics', att: 20, obt: 90, tot: 100 },
  ];
  let s4Obt = s4Subjects.reduce((acc, cur) => acc + cur.obt, 0);
  let s4Tot = s4Subjects.reduce((acc, cur) => acc + cur.tot, 0);
  let s4Pct = parseFloat(((s4Obt / s4Tot) * 100).toFixed(2));

  db.run(
    `INSERT INTO results (student_id, roll_number, student_name, father_name, class, exam_title, exam_session, total_obtained, total_marks, overall_percentage, paper_percentage, position, remarks, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [4, '201', 'Fatima Noor', 'Noor Mohammad', '9th', 'Mid-Term Examination', '2025-2026', s4Obt, s4Tot, s4Pct, 85.0, '1st Position', 'Very Good academic standing and regular attendance.', now, now, 'admin']
  );

  const r4Res = db.exec("SELECT last_insert_rowid() as id;");
  const r4Id = r4Res[0].values[0][0] as number;

  s4Subjects.forEach((sub, idx) => {
    db.run(
      `INSERT INTO result_subjects (result_id, slot_number, subject_name, attendance_marks, obtained_marks, total_marks)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [r4Id, idx + 1, sub.name, sub.att, sub.obt, sub.tot]
    );
  });

  // 4. Demo Monthly Fees (Each month is a separate record, as required!)
  const feeRecords = [
    // Muhammad Ali (Roll 101, 10th)
    { student_id: 1, roll: '101', name: 'Muhammad Ali', class: '10th', month: 'January 2026', fee: 5000, status: 'Paid', balance: 0, received_by: 'Staff M. Farooq', date: '2026-01-05', notes: 'Paid in full via Cash' },
    { student_id: 1, roll: '101', name: 'Muhammad Ali', class: '10th', month: 'February 2026', fee: 5000, status: 'Paid', balance: 0, received_by: 'Staff M. Farooq', date: '2026-02-04', notes: 'Paid in full' },
    { student_id: 1, roll: '101', name: 'Muhammad Ali', class: '10th', month: 'March 2026', fee: 5000, status: 'Unpaid', balance: 5000, received_by: '—', date: null, notes: 'Due on 10th March' },

    // Ayesha Khan (Roll 102, 10th)
    { student_id: 2, roll: '102', name: 'Ayesha Khan', class: '10th', month: 'January 2026', fee: 5000, status: 'Paid', balance: 0, received_by: 'Accountant Tariq', date: '2026-01-08', notes: 'Bank Deposit slip #8821' },
    { student_id: 2, roll: '102', name: 'Ayesha Khan', class: '10th', month: 'February 2026', fee: 5000, status: 'Partially Paid', balance: 2000, received_by: 'Accountant Tariq', date: '2026-02-12', notes: 'Paid Rs. 3000, balance 2000' },
    { student_id: 2, roll: '102', name: 'Ayesha Khan', class: '10th', month: 'March 2026', fee: 5000, status: 'Unpaid', balance: 5000, received_by: '—', date: null, notes: 'Due on 10th March' },

    // Hamza Rooz (Roll 103, 10th)
    { student_id: 3, roll: '103', name: 'Hamza Rooz', class: '10th', month: 'January 2026', fee: 5000, status: 'Paid', balance: 0, received_by: 'Accounts Office', date: '2026-01-02', notes: 'Staff concession applied' },
    { student_id: 3, roll: '103', name: 'Hamza Rooz', class: '10th', month: 'February 2026', fee: 5000, status: 'Paid', balance: 0, received_by: 'Accounts Office', date: '2026-02-03', notes: 'Cleared' },
    { student_id: 3, roll: '103', name: 'Hamza Rooz', class: '10th', month: 'March 2026', fee: 5000, status: 'Paid', balance: 0, received_by: 'Accounts Office', date: '2026-03-01', notes: 'Cleared' },

    // Fatima Noor (Roll 201, 9th)
    { student_id: 4, roll: '201', name: 'Fatima Noor', class: '9th', month: 'January 2026', fee: 4500, status: 'Paid', balance: 0, received_by: 'Staff M. Farooq', date: '2026-01-09', notes: 'Paid' },
    { student_id: 4, roll: '201', name: 'Fatima Noor', class: '9th', month: 'February 2026', fee: 4500, status: 'Unpaid', balance: 4500, received_by: '—', date: null, notes: 'Reminder sent' },
    { student_id: 4, roll: '201', name: 'Fatima Noor', class: '9th', month: 'March 2026', fee: 4500, status: 'Unpaid', balance: 4500, received_by: '—', date: null, notes: 'Upcoming' },
  ];

  for (const f of feeRecords) {
    db.run(
      `INSERT INTO fees (student_id, roll_number, student_name, class, month, monthly_fee, status, balance, received_by, payment_date, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [f.student_id, f.roll, f.name, f.class, f.month, f.fee, f.status, f.balance, f.received_by, f.date, f.notes, now, now]
    );
  }

  // 5. Demo Notifications
  const demoNotifications = [
    {
      title: 'Annual Board Examination Schedule 2025-2026',
      message: 'The BISE Peshawar annual examination date sheet has been officially received. Classes 9th and 10th students are advised to collect their roll number slips and revision kits from the administrative office.',
      date: '2026-03-15',
      category: 'Exam',
      is_published: 1,
    },
    {
      title: 'Spring Break & National Holiday Notice',
      message: 'HRK Education System will remain closed for the upcoming Pakistan Day observance and spring break from March 23rd to March 26th. Regular academic classes will resume promptly on Friday, March 27th.',
      date: '2026-03-20',
      category: 'Holiday',
      is_published: 1,
    },
    {
      title: 'Parent-Teacher Meeting (PTM) for Term Assessment',
      message: 'All parents and guardians are cordially invited to the Parent-Teacher Meeting on Saturday from 9:00 AM to 1:00 PM at the Main Campus near Ras Shadi Hall, Peshawar Cantt. Results and student progress will be reviewed individually with subject educators.',
      date: '2026-03-10',
      category: 'Meeting',
      is_published: 1,
    },
    {
      title: 'Monthly Tuition Fee Reminder for March 2026',
      message: 'Respected parents are kindly requested to clear pending monthly dues before the 10th of each calendar month. Fee vouchers can be deposited at the Accounts counter or through authorized bank branches.',
      date: '2026-03-01',
      category: 'Fee',
      is_published: 1,
    },
    {
      title: 'Science and Robotics Exhibition Announcement',
      message: 'Students from Senior Wing are encouraged to register their scientific projects and innovative models with the Science Department head before March 18th. Attractive awards and scholarship shields will be conferred by Principal Hassan Rooz.',
      date: '2026-02-25',
      category: 'General',
      is_published: 1,
    }
  ];

  for (const n of demoNotifications) {
    db.run(
      `INSERT INTO notifications (title, message, date, category, is_published, author, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [n.title, n.message, n.date, n.category, n.is_published, 'Administration', now, now]
    );
  }

  // 6. Initial Audit Log
  db.run(
    `INSERT INTO audit_logs (timestamp, staff_username, action_type, entity_type, entity_id, details)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [now, 'system', 'SYSTEM_INITIALIZED', 'SYSTEM', '1', 'Initial school management database seeded with default credentials and sample classes.']
  );
}

// Helper query wrappers for sql.js
export function queryAll<T = Record<string, unknown>>(db: Database, sql: string, params: unknown[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params as (number | string | Uint8Array | null)[]);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return rows;
}

export function queryOne<T = Record<string, unknown>>(db: Database, sql: string, params: unknown[] = []): T | null {
  const rows = queryAll<T>(db, sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export function executeRun(db: Database, sql: string, params: unknown[] = []): { lastInsertRowid: number; changes: number } {
  db.run(sql, params as (number | string | Uint8Array | null)[]);
  saveDbToDisk();

  const idRes = db.exec("SELECT last_insert_rowid() as id, changes() as chg;");
  const lastInsertRowid = idRes.length > 0 && idRes[0].values.length > 0 ? (idRes[0].values[0][0] as number) : 0;
  const changes = idRes.length > 0 && idRes[0].values.length > 0 ? (idRes[0].values[0][1] as number) : 0;
  return { lastInsertRowid, changes };
}
