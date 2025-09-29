"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { FacultyService } from "@/lib/services/faculty-service"
import { BookOpen, Users, GraduationCap, Save, MessageSquare, Loader2 } from "lucide-react"
import type { CourseSection, Enrollment, Assignment, Grade } from "@/lib/types/database"

export function FacultyGradebook() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<CourseSection[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseSection | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Enrollment | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [gradeValue, setGradeValue] = useState("")
  const [feedback, setFeedback] = useState("")
  const [savingGrade, setSavingGrade] = useState(false)

  const facultyService = new FacultyService()

  useEffect(() => {
    if (user) {
      loadFacultyCourses()
    }
  }, [user])

  useEffect(() => {
    if (selectedCourse) {
      loadCourseData(selectedCourse.id)
    }
  }, [selectedCourse])

  const loadFacultyCourses = async () => {
    if (!user) return

    try {
      setLoading(true)
      const facultyProfile = await facultyService.getFacultyProfile(user.id)
      if (!facultyProfile) return

      const coursesData = await facultyService.getFacultyCourses(facultyProfile.id)
      setCourses(coursesData)
    } catch (error) {
      console.error("Error loading faculty courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCourseData = async (courseId: string) => {
    try {
      const [enrollmentsData, assignmentsData, gradesData] = await Promise.all([
        facultyService.getCourseEnrollments(courseId),
        facultyService.getCourseAssignments(courseId),
        facultyService.getGradesForCourse(courseId)
      ])

      setEnrollments(enrollmentsData)
      setAssignments(assignmentsData)
      setGrades(gradesData)
    } catch (error) {
      console.error("Error loading course data:", error)
    }
  }

  const submitGrade = async () => {
    if (!selectedStudent || !selectedAssignment || !gradeValue.trim()) return

    try {
      setSavingGrade(true)

      // Find or create grade record
      const existingGrade = grades.find(
        g => g.student_id === selectedStudent.student_id && g.assignment_id === selectedAssignment.id
      )

      if (existingGrade) {
        // Update existing grade
        await facultyService.updateGrade(existingGrade.id, {
          points_earned: parseFloat(gradeValue),
          feedback: feedback.trim() || undefined,
          status: 'submitted',
          graded_at: new Date().toISOString()
        })
      } else {
        // Create new grade
        await facultyService.createGrade({
          student_id: selectedStudent.student_id,
          assignment_id: selectedAssignment.id,
          points_earned: parseFloat(gradeValue),
          feedback: feedback.trim() || undefined,
          status: 'submitted'
        })
      }

      // Reload course data
      if (selectedCourse) {
        await loadCourseData(selectedCourse.id)
      }

      // Reset form
      setGradeValue("")
      setFeedback("")
      setSelectedStudent(null)
      setSelectedAssignment(null)
    } catch (error) {
      console.error("Error submitting grade:", error)
      alert("Failed to submit grade")
    } finally {
      setSavingGrade(false)
    }
  }

  const getGradeForStudent = (studentId: string, assignmentId: string) => {
    return grades.find(g => g.student_id === studentId && g.assignment_id === assignmentId)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading gradebook...</span>
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
            <h1 className="text-3xl font-bold">Gradebook</h1>
            <p className="text-muted-foreground">Manage student grades and assignments</p>
          </div>
        </div>

        {/* Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Select Course
            </CardTitle>
            <CardDescription>
              Choose a course to view and manage student grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCourse?.id || ""}
              onValueChange={(value) => {
                const course = courses.find(c => c.id === value)
                setSelectedCourse(course || null)
              }}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.course?.course_code} - {course.course?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Gradebook Table */}
        {selectedCourse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {selectedCourse.course?.course_code} - {selectedCourse.course?.title}
              </CardTitle>
              <CardDescription>
                {enrollments.length} enrolled students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No students enrolled in this course yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Student ID</TableHead>
                        {assignments.map((assignment) => (
                          <TableHead key={assignment.id} className="text-center">
                            {assignment.title}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              ({assignment.total_points} pts)
                            </span>
                          </TableHead>
                        ))}
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{enrollment.student?.user?.full_name}</p>
                              <p className="text-sm text-muted-foreground">{enrollment.student?.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{enrollment.student?.student_id}</TableCell>
                          {assignments.map((assignment) => {
                            const grade = getGradeForStudent(enrollment.student_id, assignment.id)
                            return (
                              <TableCell key={assignment.id} className="text-center">
                                {grade ? (
                                  <div>
                                    <Badge variant={grade.status === 'submitted' ? 'default' : 'secondary'}>
                                      {grade.points_earned}/{assignment.total_points}
                                    </Badge>
                                    {grade.feedback && (
                                      <p className="text-xs text-muted-foreground mt-1 max-w-24 truncate">
                                        {grade.feedback}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            )
                          })}
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedStudent(enrollment)}
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  Grade
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Grade Student</DialogTitle>
                                  <DialogDescription>
                                    Assign grades for {enrollment.student?.user?.full_name}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="assignment">Assignment</Label>
                                    <Select
                                      value={selectedAssignment?.id || ""}
                                      onValueChange={(value) => {
                                        const assignment = assignments.find(a => a.id === value)
                                        setSelectedAssignment(assignment || null)
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select assignment..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {assignments.map((assignment) => (
                                          <SelectItem key={assignment.id} value={assignment.id}>
                                            {assignment.title} ({assignment.total_points} pts)
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="grade">Points Earned</Label>
                                    <Input
                                      id="grade"
                                      type="number"
                                      placeholder="Enter points..."
                                      value={gradeValue}
                                      onChange={(e) => setGradeValue(e.target.value)}
                                      max={selectedAssignment?.total_points || 100}
                                    />
                                    {selectedAssignment && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Max: {selectedAssignment.total_points} points
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <Label htmlFor="feedback">Feedback (Optional)</Label>
                                    <Textarea
                                      id="feedback"
                                      placeholder="Add feedback..."
                                      value={feedback}
                                      onChange={(e) => setFeedback(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <Button
                                    onClick={submitGrade}
                                    disabled={savingGrade || !gradeValue || !selectedAssignment}
                                    className="w-full"
                                  >
                                    {savingGrade ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Submit Grade
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
