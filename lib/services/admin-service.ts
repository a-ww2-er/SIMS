import { createClient } from "@/lib/supabase/client"
import type { User, CourseSection, Faculty, Student } from "@/lib/types/database"

export class AdminService {
  private supabase = createClient()

  async getSystemStats() {
    try {
      // Get counts in parallel
      const [studentsResult, facultyResult, coursesResult] = await Promise.all([
        this.supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "student"),
        this.supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "faculty"),
        this.supabase.from("course_sections").select("*", { count: "exact", head: true })
      ])

      return {
        totalStudents: studentsResult.count || 0,
        totalFaculty: facultyResult.count || 0,
        totalCourses: coursesResult.count || 0,
        activeSemesters: 2, // This could be calculated from course_sections
        pendingApplications: 0, // This would need an applications table
        systemUptime: 99.8, // This would come from system monitoring
      }
    } catch (error) {
      console.error("Error fetching system stats:", error)
      return {
        totalStudents: 0,
        totalFaculty: 0,
        totalCourses: 0,
        activeSemesters: 0,
        pendingApplications: 0,
        systemUptime: 0,
      }
    }
  }

  async getDepartmentStats() {
    try {
      // This is a simplified version - in a real system you'd have a departments table
      // For now, we'll return mock data that could be calculated from actual data
      const { data: courses } = await this.supabase
        .from("course_sections")
        .select(`
          course:courses(department_id),
          enrollments(count)
        `)

      // Group by department (simplified)
      const departmentMap = new Map()

      // Mock department data - in real implementation this would be calculated
      return [
        { name: "Computer Science", students: 456, faculty: 24, courses: 48, growth: 12 },
        { name: "Engineering", students: 623, faculty: 31, courses: 67, growth: 8 },
        { name: "Business", students: 789, faculty: 28, courses: 52, growth: 15 },
        { name: "Mathematics", students: 234, faculty: 18, courses: 34, growth: 5 },
        { name: "Liberal Arts", students: 745, faculty: 55, courses: 141, growth: -2 },
      ]
    } catch (error) {
      console.error("Error fetching department stats:", error)
      return []
    }
  }

  async getRecentAlerts() {
    // This would typically fetch from a system_alerts table
    // For now, return mock data
    return [
      { type: "warning", message: "Server maintenance scheduled for Oct 20", time: "2 hours ago" },
      { type: "info", message: "New faculty orientation completed", time: "4 hours ago" },
      { type: "error", message: "Grade submission deadline approaching", time: "6 hours ago" },
      { type: "success", message: "Semester enrollment targets met", time: "1 day ago" },
    ]
  }

  async getUpcomingEvents() {
    // This would typically fetch from an events table
    // For now, return mock data
    return [
      { title: "Faculty Senate Meeting", date: "Oct 15", type: "meeting" },
      { title: "Student Registration Opens", date: "Oct 18", type: "registration" },
      { title: "Semester Grade Reports Due", date: "Oct 22", type: "deadline" },
      { title: "Board of Trustees Meeting", date: "Oct 25", type: "meeting" },
    ]
  }

  async getFinancialOverview() {
    // This would typically fetch from financial tables
    // For now, return mock data
    return {
      tuitionRevenue: 12500000,
      operatingExpenses: 8900000,
      scholarshipFunds: 1200000,
      budgetUtilization: 78,
    }
  }

  async getEnrollmentTrends() {
    // This would typically calculate from enrollment history
    // For now, return mock data
    return [
      { semester: "Fall 2023", students: 2654 },
      { semester: "Spring 2024", students: 2701 },
      { semester: "Fall 2024", students: 2847 },
    ]
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching all users:", error)
      return []
    }
  }

  async getAllCourses(): Promise<CourseSection[]> {
    try {
      const { data, error } = await this.supabase
        .from("course_sections")
        .select(`
          *,
          course:courses(*),
          faculty:faculty(
            *,
            user:users(*)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching all courses:", error)
      return []
    }
  }
}