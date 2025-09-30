"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { FacultyService } from "@/lib/services/faculty-service"
import { StudentService } from "@/lib/services/student-service"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, BookOpen, Users, Calendar, Clock, MapPin, Award, FileText, User, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Course, CourseSection, Enrollment, Assignment } from "@/lib/types/database"

interface CourseDetailsProps {
  courseId: string
  sectionId?: string
  userType: "student" | "faculty"
}

export function CourseDetails({ courseId, sectionId, userType }: CourseDetailsProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [section, setSection] = useState<CourseSection | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  const facultyService = new FacultyService()
  const studentService = new StudentService()
  const supabase = createClient()

  useEffect(() => {
    if (courseId) {
      loadCourseDetails()
    }
  }, [courseId, sectionId])

  const loadCourseDetails = async () => {
    try {
      setLoading(true)

      // Load course information
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(`
          *,
          department:departments(*)
        `)
        .eq("id", courseId)
        .single()
console.log(courseData,courseId)
      if (courseError) throw courseError
      setCourse(courseData)

      // Load section information if sectionId is provided
      if (sectionId) {
        const { data: sectionData, error: sectionError } = await supabase
          .from("course_sections")
          .select(`
            *,
            faculty:faculty(
              *,
              user:users(*)
            )
          `)
          .eq("id", sectionId)
          .single()

        if (sectionError) throw sectionError
        setSection(sectionData)

        // Load enrollments for this section (faculty only)
        if (userType === "faculty" && user) {
          const enrollmentsData = await facultyService.getCourseEnrollments(sectionId)
          setEnrollments(enrollmentsData)
        }

        // Load assignments for this section
        if (userType === "student" && user) {
          const assignmentsData = await studentService.getCourseAssignments(sectionId)
          setAssignments(assignmentsData)
        } else if (userType === "faculty" && user) {
          const assignmentsData = await facultyService.getCourseAssignments(sectionId)
          setAssignments(assignmentsData)
        }
      }
    } catch (error) {
      console.error("Error loading course details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading course details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Course not found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{course.course_code}</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Information */}
          <div className="lg:col-span-2 space-y-6">
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
                    <p className="text-lg font-semibold">{course.course_code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Credits</Label>
                    <p className="text-lg font-semibold">{course.credits}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="text-lg">{course.title}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                  <p>{course.department?.name} ({course.department?.code})</p>
                </div>

                {course.description && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="mt-1">{course.description}</p>
                  </div>
                )}

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Prerequisites</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {course.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="secondary">{prereq}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section Information */}
            {section && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Section Information
                  </CardTitle>
                  <CardDescription>Section {section.section_number} - {section.semester} {section.year}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Enrollment</Label>
                        <p>{section.current_enrollment}/{section.max_enrollment} students</p>
                      </div>
                    </div>

                    {section.faculty && (
                      <div className="flex items-center gap-2">
                        {/* <User className="w-4 h-4 text-muted-foreground" /> */}
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Instructor</Label>
                          <p>{section.faculty.user?.full_name}</p>
                        </div>
                      </div>
                    )}
       
                    {/* Assignments */}
                    {assignments.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Assignments ({assignments.length})
                          </CardTitle>
                          <CardDescription>
                            {userType === "student" ? "Your assignments for this course" : "Assignments for this course section"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {assignments.map((assignment) => (
                              <div key={assignment.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{assignment.title}</h4>
                                    {assignment.description && (
                                      <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline" className="mb-2">
                                      {assignment.total_points} points
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                      {assignment.type}
                                    </p>
                                  </div>
                                </div>
       
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-4">
                                    {assignment.due_date && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
       
                                  {userType === "student" && (
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-sm text-muted-foreground">Submitted</span>
                                    </div>
                                  )}
                                </div>
       
                                {userType === "faculty" && (
                                  <div className="mt-3 pt-3 border-t">
                                    <Button size="sm" variant="outline">
                                      View Submissions
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
       
                  </div>
                  {section.schedule && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        {/* <Clock className="w-4 h-4 text-muted-foreground" /> */}
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                          <p>{section.schedule.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* <MapPin className="w-4 h-4 text-muted-foreground" /> */}
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Room</Label>
                          <p>{section.schedule.room}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.schedule?.days && section.schedule.days.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Days</Label>
                      <div className="flex gap-2 mt-1">
                        {section.schedule.days.map((day, index) => (
                          <Badge key={index} variant="outline">{day.slice(0, 3)}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {userType === "student" && section && (
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Syllabus
                  </Button>
                )}

                {userType === "faculty" && section && (
                  <>
                    <Button className="w-full" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Students
                    </Button>
                    <Button className="w-full" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Gradebook
                    </Button>
                  </>
                )}
              </CardContent>
            </Card> */}

            {/* Enrollment List (Faculty Only) */}
            {userType === "faculty" && enrollments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Enrolled Students ({enrollments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{enrollment.student?.user?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.student?.student_id}</p>
                        </div>
                        <Badge variant={enrollment.status === "enrolled" ? "default" : "secondary"}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper component for labels
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`text-sm font-medium ${className}`}>{children}</div>
}