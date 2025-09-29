"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { FacultyService } from "@/lib/services/faculty-service"
import { BookOpen, Users, Plus, Calendar, FileText, Edit, Trash2, Loader2, Save } from "lucide-react"
import type { CourseSection, Enrollment, Assignment } from "@/lib/types/database"

interface FacultyCourseDetailProps {
  sectionId: string
}

export function FacultyCourseDetail({ sectionId }: FacultyCourseDetailProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<CourseSection | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [showCreateAssignment, setShowCreateAssignment] = useState(false)
  const [creatingAssignment, setCreatingAssignment] = useState(false)

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    type: "homework",
    total_points: 100,
    due_date: "",
  })

  const facultyService = new FacultyService()

  useEffect(() => {
    if (user && sectionId) {
      loadCourseData()
    }
  }, [user, sectionId])

  const loadCourseData = async () => {
    try {
      setLoading(true)

      // First check if faculty has access to this course
      const facultyProfile = await facultyService.getFacultyProfile(user!.id)
      if (!facultyProfile) {
        console.error("Faculty profile not found")
        return
      }

      // Get all faculty courses
      const allCourses = await facultyService.getFacultyCourses(facultyProfile.id)

      // Find the specific course
      const courseData = allCourses.find(c => c.id === sectionId) || null

      if (!courseData) {
        console.error("Course not found or faculty doesn't have access")
        return
      }

      // Load enrollments and assignments in parallel
      const [enrollmentsData, assignmentsData] = await Promise.all([
        facultyService.getCourseEnrollments(sectionId),
        facultyService.getCourseAssignments(sectionId)
      ])

      setCourse(courseData)
      setEnrollments(enrollmentsData)
      setAssignments(assignmentsData)
    } catch (error) {
      console.error("Error loading course data:", error)
    } finally {
      setLoading(false)
    }
  }

  const createAssignment = async () => {
    if (!assignmentForm.title.trim()) return

    try {
      setCreatingAssignment(true)

      const result = await facultyService.createAssignment(sectionId, {
        title: assignmentForm.title,
        description: assignmentForm.description || undefined,
        type: assignmentForm.type,
        total_points: assignmentForm.total_points,
        due_date: assignmentForm.due_date || undefined,
      })

      if (result.success) {
        // Reload assignments
        const assignmentsData = await facultyService.getCourseAssignments(sectionId)
        setAssignments(assignmentsData)

        // Reset form
        setAssignmentForm({
          title: "",
          description: "",
          type: "homework",
          total_points: 100,
          due_date: "",
        })
        setShowCreateAssignment(false)
      } else {
        alert("Failed to create assignment: " + result.error)
      }
    } catch (error) {
      console.error("Error creating assignment:", error)
      alert("Failed to create assignment")
    } finally {
      setCreatingAssignment(false)
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return

    try {
      const result = await facultyService.deleteAssignment(assignmentId)

      if (result.success) {
        // Reload assignments
        const assignmentsData = await facultyService.getCourseAssignments(sectionId)
        setAssignments(assignmentsData)
      } else {
        alert("Failed to delete assignment: " + result.error)
      }
    } catch (error) {
      console.error("Error deleting assignment:", error)
      alert("Failed to delete assignment")
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading course details...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold">Course Not Found</h1>
          <p className="text-muted-foreground">
            The requested course could not be found or you don't have access to it.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure you're logged in as a faculty member and have courses assigned to you.
          </p>
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
            <h1 className="text-3xl font-bold">{course.course?.course_code} - {course.course?.title}</h1>
            <p className="text-muted-foreground">Manage course content and assignments</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showCreateAssignment} onOpenChange={setShowCreateAssignment}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Assignment</DialogTitle>
                  <DialogDescription>
                    Add a new assignment for this course
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Assignment Title *</Label>
                    <Input
                      id="title"
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Homework 1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Assignment Type</Label>
                    <select
                      id="type"
                      value={assignmentForm.type}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="homework">Homework</option>
                      <option value="quiz">Quiz</option>
                      <option value="exam">Exam</option>
                      <option value="project">Project</option>
                      <option value="lab">Lab</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="points">Total Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={assignmentForm.total_points}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, total_points: parseInt(e.target.value) || 100 }))}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="due_date">Due Date (Optional)</Label>
                    <Input
                      id="due_date"
                      type="datetime-local"
                      value={assignmentForm.due_date}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Assignment instructions..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={createAssignment}
                    disabled={creatingAssignment || !assignmentForm.title.trim()}
                    className="w-full"
                  >
                    {creatingAssignment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Assignment
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Course Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Course Code</Label>
                            <p className="text-lg font-semibold">{course.course?.course_code}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Credits</Label>
                            <p className="text-lg font-semibold">{course.course?.credits}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                          <p className="text-lg">{course.course?.title}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                          <p>{course.course?.department?.name} ({course.course?.department?.code})</p>
                        </div>

                        {course.course?.description && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                            <p className="mt-1">{course.course.description}</p>
                          </div>
                        )}

                        {course.course?.prerequisites && course.course.prerequisites.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Prerequisites</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {course.course.prerequisites.map((prereq, index) => (
                                <Badge key={index} variant="secondary">{prereq}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
        
                    {/* Section Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Section Information
                        </CardTitle>
                        <CardDescription>Section {course.section_number} - {course.semester} {course.year}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Enrollment</Label>
                              <p>{course.current_enrollment}/{course.max_enrollment} students</p>
                            </div>
                          </div>

                          {course.faculty && (
                            <div className="flex items-center gap-2">
                              {/* <User className="w-4 h-4 text-muted-foreground" /> */}
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Instructor</Label>
                                <p>{course.faculty.user?.full_name}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {course.schedule && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              {/* <Clock className="w-4 h-4 text-muted-foreground" /> */}
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                                <p>{course.schedule.time}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* <MapPin className="w-4 h-4 text-muted-foreground" /> */}
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Room</Label>
                                <p>{course.schedule.room}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {course.schedule?.days && course.schedule.days.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Days</Label>
                            <div className="flex gap-2 mt-1">
                              {course.schedule.days.map((day, index) => (
                                <Badge key={index} variant="outline">{day.slice(0, 3)}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{enrollments.length}</div>
                  <div className="text-sm text-muted-foreground">Enrolled Students</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{assignments.length}</div>
                  <div className="text-sm text-muted-foreground">Assignments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{course.semester} {course.year}</div>
                  <div className="text-sm text-muted-foreground">Semester</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Course Assignments
            </CardTitle>
            <CardDescription>
              Manage assignments and track student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No assignments created yet.</p>
                <p className="text-sm">Click "Create Assignment" to add your first assignment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            {assignment.description && (
                              <p className="text-sm text-muted-foreground">{assignment.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {assignment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{assignment.total_points}</TableCell>
                        <TableCell>
                          {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteAssignment(assignment.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
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

        {/* Enrolled Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Enrolled Students
            </CardTitle>
            <CardDescription>
              Students currently enrolled in this course section
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No students enrolled yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.student?.student_id}</TableCell>
                        <TableCell>{enrollment.student?.user?.full_name}</TableCell>
                        <TableCell>{enrollment.student?.user?.email}</TableCell>
                        <TableCell>{new Date(enrollment.enrollment_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={enrollment.status === 'enrolled' ? 'default' : 'secondary'}>
                            {enrollment.status}
                          </Badge>
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