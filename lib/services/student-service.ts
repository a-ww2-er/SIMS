import { createClient } from "@/lib/supabase/client"
import type { Student, Enrollment, Grade, Attendance, Announcement, Assignment } from "@/lib/types/database"

export class StudentService {
  private supabase = createClient()

  async getStudentProfile(userId: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from("students")
      .select(`
        *,
        user:users(*)
      `)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching student profile:", error)
      return null
    }

    return data
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const { data, error } = await this.supabase
      .from("enrollments")
      .select(`
        *,
        section:course_sections(
          *,
          course:courses(*),
          faculty:faculty(
            *,
            user:users(*)
          )
        )
      `)
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching enrollments:", error)
      return []
    }

    return data || []
  }

  async getStudentGrades(studentId: string): Promise<Grade[]> {
    const { data, error } = await this.supabase
      .from("grades")
      .select(`
        *,
        assignment:assignments(
          *,
          section:course_sections(
            *,
            course:courses(*)
          )
        )
      `)
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching grades:", error)
      return []
    }

    return data || []
  }

  async getStudentAttendance(studentId: string): Promise<Attendance[]> {
    const { data, error } = await this.supabase
      .from("attendance")
      .select(`
        *,
        section:course_sections(
          *,
          course:courses(*)
        )
      `)
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching attendance:", error)
      return []
    }

    return data || []
  }

  async getStudentAnnouncements(studentId: string): Promise<Announcement[]> {
    // Get enrolled course sections for specific announcements
    const { data: enrollments } = await this.supabase
      .from("enrollments")
      .select("section_id")
      .eq("student_id", studentId)

    const sectionIds = enrollments?.map((e) => e.section_id) || []

    const { data, error } = await this.supabase
      .from("announcements")
      .select(`
        *,
        author:users(*)
      `)
      .or(
        `target_audience.eq.all,target_audience.eq.students,and(target_audience.eq.specific_course,target_id.in.(${sectionIds.join(",")}))`,
      )
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching announcements:", error)
      return []
    }

    return data || []
  }

  async enrollInCourse(studentId: string, sectionId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from("enrollments").insert({
      student_id: studentId,
      section_id: sectionId,
      status: "enrolled",
    })

    if (error) {
      console.error("Error enrolling in course:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async dropCourse(enrollmentId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from("enrollments").update({ status: "dropped" }).eq("id", enrollmentId)

    if (error) {
      console.error("Error dropping course:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async updateProfile(studentId: string, updates: Partial<Student>): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from("students").update(updates).eq("id", studentId)

    if (error) {
      console.error("Error updating student profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async getAvailableCourses(): Promise<any[]> {
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
      .lt("current_enrollment", this.supabase.rpc("max_enrollment"))
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching available courses:", error)
      return []
    }

    return data || []
  }

  async getCourseAssignments(courseSectionId: string): Promise<Assignment[]> {
    const { data, error } = await this.supabase
      .from("assignments")
      .select("*")
      .eq("section_id", courseSectionId)
      .order("due_date", { ascending: true })

    if (error) {
      console.error("Error fetching course assignments:", error)
      return []
    }

    return data || []
  }
}
