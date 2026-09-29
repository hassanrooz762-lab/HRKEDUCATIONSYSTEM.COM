export interface SubjectRow {
  slot_number?: number;
  subject_name: string;
  attendance_marks: number | string;
  obtained_marks: number | string;
  total_marks: number | string;
}

export interface StudentResult {
  id?: number;
  student_id?: number | null;
  roll_number: string;
  student_name: string;
  father_name: string;
  class: string;
  exam_title?: string;
  exam_session?: string;
  total_obtained: number;
  total_marks: number;
  overall_percentage: number;
  paper_percentage?: number | null;
  position?: string | null;
  remarks?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  subjects: SubjectRow[];
}

export interface FeeRecord {
  id: number;
  student_id?: number | null;
  roll_number: string;
  student_name: string;
  class: string;
  month: string;
  monthly_fee: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
  balance: number;
  received_by?: string | null;
  payment_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  category: 'General' | 'Exam' | 'Holiday' | 'Fee' | 'Meeting' | 'Important';
  is_published: number | boolean;
  author?: string;
  created_at?: string;
}

export interface StudentRecord {
  id: number;
  roll_number: string;
  name: string;
  father_name: string;
  class: string;
  phone?: string | null;
  address?: string | null;
  admission_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StaffUser {
  userId: number;
  username: string;
  displayName: string;
  role: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  staff_username: string;
  action_type: string;
  entity_type: string;
  entity_id?: string | null;
  details: string;
}

export interface SchoolInfo {
  schoolName: string;
  campus: string;
  location: string;
  principal: string;
  phones: string[];
  email: string;
  established: string;
  stats: {
    totalStudents: number;
    totalResults: number;
    activeAnnouncements: number;
  };
}

export interface AdmissionApplication {
  id: number;
  application_no: string;
  student_name: string;
  father_name: string;
  father_cnic?: string | null;
  gender: 'Male' | 'Female';
  dob?: string | null;
  applied_class: string;
  previous_school?: string | null;
  previous_marks?: string | null;
  phone: string;
  address: string;
  status: 'Pending' | 'Approved' | 'Interview Scheduled' | 'Rejected';
  submitted_at: string;
  notes?: string | null;
}
