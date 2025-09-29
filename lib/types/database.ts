export type UserRole = "student" | "faculty" | "admin"
export type EnrollmentStatus = "enrolled" | "completed" | "dropped" | "pending"
export type GradeStatus = "pending" | "submitted" | "final"
export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  address?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  student_id: string
  program: string
  year_of_study: number
  gpa: number
  enrollment_date: string
  graduation_date?: string
  status: string
  created_at: string
  updated_at: string
  user?: User
}

export interface Faculty {
  id: string
  user_id: string
  employee_id: string
  department: string
  position: string
  hire_date: string
  office_location?: string
  office_hours?: string
  created_at: string
  updated_at: string
  user?: User
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  head_faculty_id?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  course_code: string
  title: string
  description?: string
  credits: number
  department_id: string
  prerequisites?: string[]
  created_at: string
  updated_at: string
  department?: Department
}

export interface CourseSection {
  id: string
  course_id: string
  section_number: string
  semester: string
  year: number
  faculty_id?: string
  max_enrollment: number
  current_enrollment: number
  schedule?: {
    days: string[]
    time: string
    room: string
  }
  created_at: string
  updated_at: string
  course?: Course
  faculty?: Faculty
}

export interface Enrollment {
  id: string
  student_id: string
  section_id: string
  status: EnrollmentStatus
  enrollment_date: string
  completion_date?: string
  final_grade?: string
  grade_points?: number
  created_at: string
  updated_at: string
  student?: Student
  section?: CourseSection
}

export interface Assignment {
  id: string
  section_id: string
  title: string
  description?: string
  type: string
  total_points: number
  due_date?: string
  created_at: string
  updated_at: string
  section?: CourseSection
}

export interface Grade {
  id: string
  student_id: string
  assignment_id: string
  points_earned?: number
  status: GradeStatus
  feedback?: string
  submitted_at?: string
  graded_at?: string
  created_at: string
  updated_at: string
  student?: Student
  assignment?: Assignment
}

export interface Attendance {
  id: string
  student_id: string
  section_id: string
  date: string
  status: AttendanceStatus
  notes?: string
  created_at: string
  updated_at: string
  student?: Student
  section?: CourseSection
}

export interface Announcement {
  id: string
  title: string
  content: string
  author_id: string
  target_audience: string
  target_id?: string
  priority: string
  expires_at?: string
  created_at: string
  updated_at: string
  author?: User
}
