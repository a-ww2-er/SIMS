import { createClient } from "@/lib/supabase/client"
import type { DocumentUpload, DocumentVersion, DocumentStatus } from "@/lib/types/database"

export class DocumentService {
  private supabase = createClient()

  async uploadDocument(
    studentId: string,
    courseSectionId: string | null,
    assignmentId: string | null,
    documentData: {
      document_type: string
      title: string
      description?: string
      original_filename: string
      file_size: number
      mime_type: string
      cloudinary_public_id: string
      cloudinary_url: string
      cloudinary_secure_url: string
    }
  ): Promise<{ success: boolean; error?: string; data?: DocumentUpload }> {
    try {
      const { data, error } = await this.supabase
        .from("document_uploads")
        .insert({
          student_id: studentId,
          course_section_id: courseSectionId,
          assignment_id: assignmentId,
          ...documentData,
        })
        .select(`
          *,
          student:students(*, user:users(*)),
          course_section:course_sections(*, course:courses(*), faculty:faculty(*, user:users(*))),
          assignment:assignments(*)
        `)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      console.error("Error uploading document:", error)
      return { success: false, error: error.message }
    }
  }

  async getStudentUploads(studentId: string): Promise<DocumentUpload[]> {
    try {
      const { data, error } = await this.supabase
        .from("document_uploads")
        .select(`
          *,
          course_section:course_sections(*, course:courses(*), faculty:faculty(*, user:users(*))),
          assignment:assignments(*),
          reviewed_by_faculty:faculty(*, user:users(*))
        `)
        .eq("student_id", studentId)
        .order("submitted_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching student uploads:", error)
      return []
    }
  }

  async getFacultyUploads(facultyId: string): Promise<DocumentUpload[]> {
    try {
      // Faculty can now see all student uploads for review purposes
      const { data, error } = await this.supabase
        .from("document_uploads")
        .select(`
          *,
          student:students(*, user:users(*)),
          course_section:course_sections(*, course:courses(*)),
          assignment:assignments(*)
        `)
        .order("submitted_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching faculty uploads:", error)
      return []
    }
  }

  async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    reviewNotes?: string,
    facultyId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {
        status,
        faculty_review_notes: reviewNotes,
        reviewed_at: new Date().toISOString(),
      }

      if (facultyId) {
        updateData.reviewed_by = facultyId
      }

      const { error } = await this.supabase
        .from("document_uploads")
        .update(updateData)
        .eq("id", documentId)

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error("Error updating document status:", error)
      return { success: false, error: error.message }
    }
  }

  async createDocumentVersion(
    documentUploadId: string,
    versionData: {
      version_number: number
      change_description?: string
      original_filename: string
      file_size: number
      mime_type: string
      cloudinary_public_id: string
      cloudinary_url: string
      cloudinary_secure_url: string
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("document_versions")
        .insert({
          document_upload_id: documentUploadId,
          ...versionData,
        })

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error("Error creating document version:", error)
      return { success: false, error: error.message }
    }
  }

  async getDocumentVersions(documentUploadId: string): Promise<DocumentVersion[]> {
    try {
      const { data, error } = await this.supabase
        .from("document_versions")
        .select("*")
        .eq("document_upload_id", documentUploadId)
        .order("version_number", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching document versions:", error)
      return []
    }
  }

  async deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("document_uploads")
        .delete()
        .eq("id", documentId)

      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error("Error deleting document:", error)
      return { success: false, error: error.message }
    }
  }
}