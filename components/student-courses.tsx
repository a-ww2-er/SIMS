"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BookOpen, Calendar, Clock, Users, Search, Filter, Download, Star, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { StudentService } from "@/lib/services/student-service"
import type { Enrollment, CourseSection } from "@/lib/types/database"
import Link from "next/link"

export function StudentCourses() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([])
  const [availableCourses, setAvailableCourses] = useState<CourseSection[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  const studentService = new StudentService()

  useEffect(() => {
    if (user) {
      loadStudentData()
    }
  }, [user])

  const loadStudentData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get student profile first
      const studentProfile = await studentService.getStudentProfile(user.id)
      if (!studentProfile) {
        console.error("Student profile not found")
        return
      }

      // Load enrolled courses and available courses in parallel
      const [enrollments, available] = await Promise.all([
        studentService.getStudentEnrollments(studentProfile.id),
        studentService.getAvailableCourses()
      ])

      setEnrolledCourses(enrollments)
      setAvailableCourses(available)
    } catch (error) {
      console.error("Error loading student data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (sectionId: string) => {
    if (!user) return

    try {
      setEnrolling(sectionId)

      const studentProfile = await studentService.getStudentProfile(user.id)
      if (!studentProfile) {
        console.error("Student profile not found")
        return
      }

      const result = await studentService.enrollInCourse(studentProfile.id, sectionId)

      if (result.success) {
        // Reload data to reflect the enrollment
        await loadStudentData()
      } else {
        console.error("Failed to enroll:", result.error)
        // You could show a toast notification here
      }
    } catch (error) {
      console.error("Error enrolling in course:", error)
    } finally {
      setEnrolling(null)
    }
  }

  const filteredEnrolledCourses = enrolledCourses.filter(
    (enrollment) => {
      const course = enrollment.section?.course
      const faculty = enrollment.section?.faculty
      const courseName = course?.title || ""
      const courseCode = course?.course_code || ""
      const instructorName = faculty?.user?.full_name || ""

      return courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
             instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    }
  )

  const filteredAvailableCourses = availableCourses.filter(
    (section) => {
      const course = section.course
      const faculty = section.faculty
      const courseName = course?.title || ""
      const courseCode = course?.course_code || ""
      const instructorName = faculty?.user?.full_name || ""

      return courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
             instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    }
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your enrolled courses and explore new ones</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Course Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                  <div className="text-sm text-muted-foreground">Enrolled Courses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {enrolledCourses.reduce((sum, enrollment) => {
                      const credits = enrollment.section?.course?.credits || 0
                      return sum + credits
                    }, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {enrolledCourses.length > 0 ? Math.round(75) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {enrolledCourses.length * 2} {/* Placeholder for pending tasks */}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Enrolled Courses
            </CardTitle>
            <CardDescription>Your current semester courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading courses...</span>
              </div>
            ) : filteredEnrolledCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No enrolled courses found.
              </div>
            ) : (
              filteredEnrolledCourses.map((enrollment) => {
                const course = enrollment.section?.course
                const faculty = enrollment.section?.faculty
                const section = enrollment.section

                if (!course || !section) return null

                return (
                  <Link key={enrollment.id} href={`/student/course/${course.id}?sectionId=${section.id}`}>
                    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{course.course_code}</h3>
                            <Badge variant={enrollment.final_grade?.startsWith("A") ? "default" : "secondary"}>
                              {enrollment.final_grade || "In Progress"}
                            </Badge>
                          </div>
                          <h4 className="text-lg font-medium text-muted-foreground mb-1">{course.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{course.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>
                                <span className="font-medium">Instructor:</span> {faculty?.user?.full_name || "TBD"}
                              </p>
                              <p>
                                <span className="font-medium">Schedule:</span> {section.schedule ? `${section.schedule.days.join(', ')} ${section.schedule.time}` : "TBD"}
                              </p>
                              <p>
                                <span className="font-medium">Room:</span> {section.schedule?.room || "TBD"}
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">Credits:</span> {course.credits}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span> {enrollment.status}
                              </p>
                              <p>
                                <span className="font-medium">Enrolled:</span> {new Date(enrollment.enrollment_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-primary mb-1">75%</div>
                          <div className="text-sm text-muted-foreground mb-3">Progress</div>
                          <Progress value={75} className="w-24 h-2" />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Course Materials
                        </Button>
                        <Button size="sm" variant="outline">
                          Assignments
                        </Button>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Available Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Available Courses
            </CardTitle>
            <CardDescription>Courses you can enroll in for next semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading available courses...</span>
              </div>
            ) : filteredAvailableCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No available courses found.
              </div>
            ) : (
              filteredAvailableCourses.map((section) => {
                const course = section.course
                const faculty = section.faculty

                if (!course) return null

                const isEnrolling = enrolling === section.id
                const enrollmentPercentage = (section.current_enrollment / section.max_enrollment) * 100

                return (
                  <div key={section.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link href={`/student/course/${course.id}?sectionId=${section.id}`}>
                          <div className="cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold hover:text-primary transition-colors">{course.course_code}</h3>
                              <Badge variant="outline">{course.credits} Credits</Badge>
                            </div>
                            <h4 className="text-lg font-medium text-muted-foreground mb-1 hover:text-primary transition-colors">{course.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{course.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p>
                                  <span className="font-medium">Instructor:</span> {faculty?.user?.full_name || "TBD"}
                                </p>
                                <p>
                                  <span className="font-medium">Schedule:</span> {section.schedule ? `${section.schedule.days.join(', ')} ${section.schedule.time}` : "TBD"}
                                </p>
                                <p>
                                  <span className="font-medium">Room:</span> {section.schedule?.room || "TBD"}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Capacity:</span> {section.current_enrollment}/{section.max_enrollment}
                                </p>
                                <p>
                                  <span className="font-medium">Prerequisites:</span> {course.prerequisites?.join(", ") || "None"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="text-right ml-6">
                        <div className="mb-3">
                          <Progress value={enrollmentPercentage} className="w-24 h-2" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {section.max_enrollment - section.current_enrollment} spots left
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEnroll(section.id)}
                        disabled={isEnrolling || section.current_enrollment >= section.max_enrollment}
                      >
                        {isEnrolling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enrolling...
                          </>
                        ) : section.current_enrollment >= section.max_enrollment ? (
                          "Full"
                        ) : (
                          "Enroll Now"
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        View Syllabus
                      </Button>
                      <Button size="sm" variant="outline">
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
