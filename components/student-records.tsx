"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { StudentService } from "@/lib/services/student-service"
import { DocumentService } from "@/lib/services/document-service"
import { FileText, Download, Eye, Calendar, BookOpen, Award, Loader2 } from "lucide-react"
import type { DocumentUpload, Grade } from "@/lib/types/database"

export function StudentRecords() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [uploads, setUploads] = useState<DocumentUpload[]>([])
  const [grades, setGrades] = useState<Grade[]>([])

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
      setLoading(true)

      // Get student profile
      const studentProfile = await studentService.getStudentProfile(user.id)
      if (!studentProfile) return

      // Load uploads and grades in parallel
      const [uploadsData, gradesData] = await Promise.all([
        documentService.getStudentUploads(studentProfile.id),
        studentService.getStudentGrades(studentProfile.id)
      ])

      setUploads(uploadsData)
      setGrades(gradesData)
    } catch (error) {
      console.error("Error loading student records:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = (cloudinaryUrl: string, filename: string) => {
    // Create a temporary link to download the file
    const link = document.createElement('a')
    link.href = cloudinaryUrl
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadGradesAsTxt = () => {
    if (grades.length === 0) return

    const gradeText = grades.map(grade => {
      const assignment = grade.assignment
      const course = assignment?.section?.course
      const points = grade.points_earned || 0
      const total = assignment?.total_points || 100

      return `${course?.course_code} - ${assignment?.title}: ${points}/${total} points`
    }).join('\n')

    const blob = new Blob([gradeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'grades.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { variant: "secondary" as const, label: "Pending Review" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      revision_required: { variant: "outline" as const, label: "Revision Required" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading records...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Records</h1>
            <p className="text-muted-foreground">View your document uploads and academic grades</p>
          </div>
          {grades.length > 0 && (
            <Button onClick={downloadGradesAsTxt} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Grades (TXT)
            </Button>
          )}
        </div>

        <Tabs defaultValue="uploads" className="space-y-6">
          <TabsList>
            <TabsTrigger value="uploads" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document Uploads ({uploads.length})
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Grades ({grades.length})
            </TabsTrigger>
          </TabsList>

          {/* Document Uploads Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Uploads
                </CardTitle>
                <CardDescription>
                  Track the status of your submitted documents and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet.</p>
                    <p className="text-sm">Upload your first document to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploads.map((upload) => (
                          <TableRow key={upload.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{upload.title}</p>
                                {upload.description && (
                                  <p className="text-sm text-muted-foreground">{upload.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {upload.course_section ? (
                                <div>
                                  <p className="font-medium">
                                    {upload.course_section.course?.course_code}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Section {upload.course_section.section_number}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-medium text-muted-foreground">General Document</p>
                                  <p className="text-sm text-muted-foreground">Not course-specific</p>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {upload.document_type.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(upload.status)}
                              {upload.faculty_review_notes && (
                                <p className="text-xs text-muted-foreground mt-1 max-w-32 truncate">
                                  {upload.faculty_review_notes}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="w-3 h-3" />
                                {new Date(upload.submitted_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatFileSize(upload.file_size)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadFile(upload.cloudinary_secure_url, upload.original_filename)}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                                {/* <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Academic Grades
                </CardTitle>
                <CardDescription>
                  Your grades for completed assignments and assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {grades.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No grades available yet.</p>
                    <p className="text-sm">Grades will appear here once assignments are graded.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Graded Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grades.map((grade) => {
                          const assignment = grade.assignment
                          const course = assignment?.section?.course
                          const score = grade.points_earned || 0
                          const total = assignment?.total_points || 100
                          const percentage = total > 0 ? (score / total) * 100 : 0

                          return (
                            <TableRow key={grade.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{assignment?.title}</p>
                                  {assignment?.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {assignment.description}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{course?.course_code}</p>
                                  <p className="text-sm text-muted-foreground">{course?.title}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {score}/{total}
                                  <div className="text-sm text-muted-foreground">
                                    ({percentage.toFixed(1)}%)
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={percentage >= 90 ? "default" : percentage >= 80 ? "secondary" : "outline"}>
                                  {percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={grade.status === "final" ? "default" : "secondary"}>
                                  {grade.status === "final" ? "Final" : grade.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {grade.graded_at ? (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(grade.graded_at).toLocaleDateString()}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Not graded</span>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}