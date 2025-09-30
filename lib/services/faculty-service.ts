import { createClient } from "@/lib/supabase/client"
import type { Faculty, CourseSection, Enrollment, Assignment, Grade, Announcement } from "@/lib/types/database"

export class FacultyService {
  private supabase = createClient()

  async getFacultyProfile(userId: string): Promise<Faculty | null> {
    const { data, error } = await this.supabase
      .from("faculty")
      .select(`
        *,
        user:users(*)
      `)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching faculty profile:", error)
      return null
    }

    return data
  }

  async getFacultyCourses(facultyId: string): Promise<CourseSection[]> {
    const { data, error } = await this.supabase
      .from("course_sections")
      .select(`
        *,
        course:courses(*),
        enrollments:enrollments(count)
      `)
      .eq("faculty_id", facultyId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching faculty courses:", error)
      return []
    }

    return data || []
  }

  async getCourseEnrollments(sectionId: string): Promise<Enrollment[]> {
    const { data, error } = await this.supabase
      .from("enrollments")
      .select(`
        *,
        student:students(
          *,
          user:users(*)
        )
      `)
      .eq("section_id", sectionId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching course enrollments:", error)
      return []
    }

    return data || []
  }

  async getCourseAssignments(sectionId: string): Promise<Assignment[]> {
    const { data, error } = await this.supabase
      .from("assignments")
      .select("*")
      .eq("section_id", sectionId)
      .order("due_date", { ascending: true })

    if (error) {
      console.error("Error fetching course assignments:", error)
      return []
    }

    return data || []
  }

  async getPendingGrades(facultyId: string): Promise<Grade[]> {
    // Get all sections taught by this faculty
    const { data: sections } = await this.supabase
      .from("course_sections")
      .select("id")
      .eq("faculty_id", facultyId)

    if (!sections || sections.length === 0) return []

    const sectionIds = sections.map(s => s.id)

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
        ),
        student:students(
          *,
          user:users(*)
        )
      `)
      .in("assignment.section_id", sectionIds)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching pending grades:", error)
      return []
    }

    return data || []
  }

  async createAssignment(sectionId: string, assignment: {
    title: string
    description?: string
    type: string
    total_points: number
    due_date?: string
  }): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from("assignments").insert({
      section_id: sectionId,
      ...assignment,
    })

    if (error) {
      console.error("Error creating assignment:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async updateAssignment(assignmentId: string, updates: Partial<Assignment>): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("assignments")
      .update(updates)
      .eq("id", assignmentId)

    if (error) {
      console.error("Error updating assignment:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async submitGrade(gradeId: string, pointsEarned: number, feedback?: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("grades")
      .update({
        points_earned: pointsEarned,
        feedback,
        status: "submitted",
        graded_at: new Date().toISOString(),
      })
      .eq("id", gradeId)

    if (error) {
      console.error("Error submitting grade:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async createAnnouncement(announcement: {
    title: string
    content: string
    target_audience: string
    target_id?: string
    priority?: string
    expires_at?: string
  }, authorId: string): Promise<{ success: boolean; error?: string; data?: Announcement }> {
    const { data, error } = await this.supabase.from("announcements").insert({
      ...announcement,
      author_id: authorId,
    }).select().single()

    if (error) {
      console.error("Error creating announcement:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  }

  async updateProfile(facultyId: string, updates: Partial<Faculty>): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from("faculty").update(updates).eq("id", facultyId)

    if (error) {
      console.error("Error updating faculty profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async createGrade(grade: {
    student_id: string
    assignment_id: string
    points_earned?: number
    feedback?: string
    status: string
  }): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from("grades").insert({
      ...grade,
      graded_at: new Date().toISOString()
    })

    if (error) {
      console.error("Error creating grade:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async updateGrade(gradeId: string, updates: Partial<{
    points_earned: number
    feedback: string
    status: string
    graded_at: string
  }>): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from("grades").update(updates).eq("id", gradeId)

    if (error) {
      console.error("Error updating grade:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async getGradesForCourse(courseId: string): Promise<Grade[]> {
    const { data, error } = await this.supabase
      .from("grades")
      .select(`
        *,
        student:students(
          *,
          user:users(*)
        ),
        assignment:assignments(*)
      `)
      .eq("assignment.section_id", courseId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching course grades:", error)
      return []
    }

    return data || []
  }

  async deleteAssignment(assignmentId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("assignments")
      .delete()
      .eq("id", assignmentId)

    if (error) {
      console.error("Error deleting assignment:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async getFacultyAnnouncements(facultyId: string): Promise<Announcement[]> {
    const { data, error } = await this.supabase
      .from("announcements")
      .select("*")
      .eq("author_id", facultyId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching faculty announcements:", error)
      return []
    }

    return data || []
  }

  async deleteAnnouncement(announcementId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from("announcements")
      .delete()
      .eq("id", announcementId)

    if (error) {
      console.error("Error deleting announcement:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async getAllCourses(): Promise<CourseSection[]> {
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

    if (error) {
      console.error("Error fetching all courses:", error)
      return []
    }

    return data || []
  }

  async getTotalStudentCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")

    if (error) {
      console.error("Error fetching total student count:", error)
      return 0
    }

    return count || 0
  }
}