"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { FacultyService } from "@/lib/services/faculty-service"
import { DocumentService } from "@/lib/services/document-service"
import { FileText, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle, Loader2, MessageSquare } from "lucide-react"
import type { DocumentUpload, DocumentStatus } from "@/lib/types/database"

export function FacultyUploads() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [uploads, setUploads] = useState<DocumentUpload[]>([])
  const [selectedUpload, setSelectedUpload] = useState<DocumentUpload | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const facultyService = new FacultyService()
  const documentService = new DocumentService()

  useEffect(() => {
    if (user) {
      loadFacultyUploads()
    }
  }, [user])

  const loadFacultyUploads = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get faculty profile
      const facultyProfile = await facultyService.getFacultyProfile(user.id)
      if (!facultyProfile) return

      // Load all uploads for courses taught by this faculty
      const uploadsData = await documentService.getFacultyUploads(facultyProfile.id)
      setUploads(uploadsData)
    } catch (error) {
      console.error("Error loading faculty uploads:", error)
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

  const updateDocumentStatus = async (documentId: string, status: DocumentStatus) => {
    try {
      setUpdatingStatus(documentId)

      const result = await documentService.updateDocumentStatus(
        documentId,
        status,
        reviewNotes.trim() || undefined,
        user?.id
      )

      if (result.success) {
        // Reload uploads to reflect the change
        await loadFacultyUploads()
        setSelectedUpload(null)
        setReviewNotes("")
      } else {
        alert(`Error updating status: ${result.error}`)
      }
    } catch (error) {
      console.error("Error updating document status:", error)
      alert("Failed to update document status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: {
        variant: "secondary" as const,
        label: "Pending Review",
        icon: Clock
      },
      approved: {
        variant: "default" as const,
        label: "Approved",
        icon: CheckCircle
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: XCircle
      },
      revision_required: {
        variant: "outline" as const,
        label: "Revision Required",
        icon: AlertCircle
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getUploadsByStatus = (status: DocumentStatus) => {
    return uploads.filter(upload => upload.status === status)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading uploads...</span>
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
            <h1 className="text-3xl font-bold">Student Uploads</h1>
            <p className="text-muted-foreground">Review and manage student document submissions</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{uploads.length}</div>
                  <div className="text-sm text-muted-foreground">Total Uploads</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{getUploadsByStatus("pending_review").length}</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{getUploadsByStatus("approved").length}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {getUploadsByStatus("rejected").length + getUploadsByStatus("revision_required").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Needs Action</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uploads Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              All Student Uploads
            </CardTitle>
            <CardDescription>
              Review and manage document submissions from your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No student uploads yet.</p>
                <p className="text-sm">Student uploads will appear here for review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploads.map((upload) => (
                      <TableRow key={upload.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{upload.student?.user?.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {upload.student?.student_id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{upload.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(upload.file_size)}
                            </p>
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
                        </TableCell>
                        <TableCell>
                          {new Date(upload.submitted_at).toLocaleDateString()}
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

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedUpload(upload)}
                                >
                                  <MessageSquare className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Review Document</DialogTitle>
                                  <DialogDescription>
                                    Update the status of "{upload.title}" by {upload.student?.user?.full_name}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Review Notes</label>
                                    <Textarea
                                      placeholder="Add feedback or comments..."
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => updateDocumentStatus(upload.id, "approved")}
                                      disabled={updatingStatus === upload.id}
                                      className="flex-1"
                                    >
                                      {updatingStatus === upload.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                      )}
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => updateDocumentStatus(upload.id, "revision_required")}
                                      disabled={updatingStatus === upload.id}
                                      variant="outline"
                                      className="flex-1"
                                    >
                                      <AlertCircle className="w-4 h-4 mr-2" />
                                      Request Revision
                                    </Button>
                                    <Button
                                      onClick={() => updateDocumentStatus(upload.id, "rejected")}
                                      disabled={updatingStatus === upload.id}
                                      variant="destructive"
                                      className="flex-1"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
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
      </div>
    </DashboardLayout>
  )
}