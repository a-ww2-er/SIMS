"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { StudentService } from "@/lib/services/student-service"
import { DocumentService } from "@/lib/services/document-service"
import { cloudinaryService } from "@/lib/utils/cloudinary"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import type { CourseSection, Assignment } from "@/lib/types/database"

interface UploadFormData {
  course_section_id: string
  assignment_id: string
  document_type: string
  title: string
  description: string
  file: File | null
}

export function StudentUpload() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<CourseSection[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState<UploadFormData>({
    course_section_id: "none",
    assignment_id: "none",
    document_type: "assignment",
    title: "",
    description: "",
    file: null,
  })

  const studentService = new StudentService()
  const documentService = new DocumentService()

  useEffect(() => {
    if (user) {
      loadStudentData()
    }
  }, [user])

  const loadStudentData = async () => {
    if (!user) return

    try {
      // Get student profile
      const studentProfile = await studentService.getStudentProfile(user.id)
      if (!studentProfile) return

      // Get enrolled courses
      const enrollments = await studentService.getStudentEnrollments(studentProfile.id)
      const enrolledSections = enrollments
        .filter(e => e.status === 'enrolled')
        .map(e => e.section!)
        .filter(Boolean)

      setCourses(enrolledSections)
    } catch (error) {
      console.error("Error loading student data:", error)
    }
  }

  const loadAssignments = async (courseSectionId: string) => {
    try {
      const assignmentsData = await studentService.getCourseAssignments(courseSectionId)
      setAssignments(assignmentsData)
    } catch (error) {
      console.error("Error loading assignments:", error)
      setAssignments([])
    }
  }

  const handleInputChange = (field: keyof UploadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Load assignments when course is selected
    if (field === 'course_section_id' && value && value !== "none") {
      loadAssignments(value)
      // Reset assignment selection
      setFormData(prev => ({ ...prev, assignment_id: "none" }))
    } else if (field === 'course_section_id' && value === "none") {
      // Clear assignments when no course is selected
      setAssignments([])
      setFormData(prev => ({ ...prev, assignment_id: "none" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB")
        return
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/zip',
        'application/x-zip-compressed'
      ]

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("File type not supported. Please upload PDF, DOC, DOCX, TXT, images, or ZIP files.")
        return
      }

      setFormData(prev => ({ ...prev, file }))
      setErrorMessage("")
    }
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }))
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !formData.file) {
      setErrorMessage("Please select a file to upload")
      return
    }

    // Course selection is now optional

    try {
      setLoading(true)
      setUploadStatus('uploading')
      setUploadProgress(0)
      setErrorMessage("")

      // Get student profile
      const studentProfile = await studentService.getStudentProfile(user.id)
      if (!studentProfile) {
        throw new Error("Student profile not found")
      }

      // Upload to Cloudinary
      setUploadProgress(25)
      const cloudinaryResult = await cloudinaryService.uploadFile(formData.file, {
        folder: `student-documents/${studentProfile.student_id}`,
        resource_type: 'auto'
      })

      setUploadProgress(75)

      // Save to database
      const documentData = {
        document_type: formData.document_type,
        title: formData.title,
        description: formData.description,
        original_filename: formData.file.name,
        file_size: formData.file.size,
        mime_type: formData.file.type,
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_url: cloudinaryResult.url,
        cloudinary_secure_url: cloudinaryResult.secure_url,
      }

      const result = await documentService.uploadDocument(
        studentProfile.id,
        formData.course_section_id === "none" ? null : formData.course_section_id,
        formData.assignment_id === "none" ? null : formData.assignment_id,
        documentData
      )

      if (!result.success) {
        throw new Error(result.error || "Upload failed")
      }

      setUploadProgress(100)
      setUploadStatus('success')

      // Reset form
      setFormData({
        course_section_id: "none",
        assignment_id: "none",
        document_type: "assignment",
        title: "",
        description: "",
        file: null,
      })

      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error: any) {
      console.error("Upload error:", error)
      setUploadStatus('error')
      setErrorMessage(error.message || "Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const documentTypes = [
    { value: "assignment", label: "Assignment" },
    { value: "project", label: "Project" },
    { value: "exam", label: "Exam" },
    { value: "lab_report", label: "Lab Report" },
    { value: "presentation", label: "Presentation" },
    { value: "bio_data", label: "Bio Data/CV" },
    { value: "certificate", label: "Certificate" },
    { value: "transcript", label: "Transcript" },
    { value: "recommendation", label: "Recommendation Letter" },
    { value: "other", label: "Other" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Upload Documents</h1>
            <p className="text-muted-foreground">Submit assignments, projects, and other documents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Document Upload
              </CardTitle>
              <CardDescription>Fill in the details and select your file. Course selection is optional for general documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Course Selection */}
                <div>
                  <Label htmlFor="course">Course (Optional)</Label>
                  <Select
                    value={formData.course_section_id || "none"}
                    onValueChange={(value) => handleInputChange("course_section_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific course</SelectItem>
                      {courses.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.course?.course_code} - {section.course?.title} (Section {section.section_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignment Selection */}
                <div>
                  <Label htmlFor="assignment">Assignment (Optional)</Label>
                  <Select
                    value={formData.assignment_id || "none"}
                    onValueChange={(value) => handleInputChange("assignment_id", value)}
                    disabled={formData.course_section_id === "none" || !formData.course_section_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an assignment (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific assignment</SelectItem>
                      {assignments.map((assignment) => (
                        <SelectItem key={assignment.id} value={assignment.id}>
                          {assignment.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Type */}
                <div>
                  <Label htmlFor="document_type">Document Type</Label>
                  <Select
                    value={formData.document_type}
                    onValueChange={(value) => handleInputChange("document_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Document Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Final Project Report"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the document..."
                    rows={3}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label htmlFor="file-upload">File *</Label>
                  <div className="mt-1">
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip"
                    />
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                      {formData.file ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-8 h-8 text-primary" />
                            <span className="font-medium">{formData.file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                          <div>
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">
                              PDF, DOC, DOCX, TXT, Images, ZIP (max 10MB)
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Select File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                  </div>
                )}

                {/* Upload Progress */}
                {uploadStatus === 'uploading' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Success Message */}
                {uploadStatus === 'success' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Document uploaded successfully!
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !formData.file }
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Upload Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
              <CardDescription>Important information about document uploads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Supported Formats</h4>
                    <p className="text-sm text-muted-foreground">
                      PDF, Word documents (.doc, .docx), text files, images, and ZIP archives
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">File Size Limit</h4>
                    <p className="text-sm text-muted-foreground">
                      Maximum file size is 10MB per document
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Review Process</h4>
                    <p className="text-sm text-muted-foreground">
                      Documents are reviewed by faculty. You'll receive notifications about status changes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Version Control</h4>
                    <p className="text-sm text-muted-foreground">
                      You can upload revised versions if requested by faculty
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground">
                  Contact your course instructor or the IT support team if you encounter any issues with uploads.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}