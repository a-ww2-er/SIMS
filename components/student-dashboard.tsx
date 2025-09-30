"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentService } from "@/lib/services/student-service"
import { useAuth } from "@/lib/auth/auth-context"
import type { Student, Enrollment, Grade, Announcement } from "@/lib/types/database"

export function StudentDashboard() {
  const { user, userProfile } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [recentGrades, setRecentGrades] = useState<Grade[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const studentService = new StudentService()

  useEffect(() => {
    if (user && userProfile?.role === "student") {
      loadStudentData()
    }
  }, [user, userProfile])

  const loadStudentData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load student profile
      const studentProfile = await studentService.getStudentProfile(user.id)
      setStudent(studentProfile)

      if (studentProfile) {
        // Load enrollments, grades, and announcements
        const [enrollmentsData, gradesData, announcementsData] = await Promise.all([
          studentService.getStudentEnrollments(studentProfile.id),
          studentService.getStudentGrades(studentProfile.id),
          studentService.getStudentAnnouncements(studentProfile.id),
        ])

        setEnrollments(enrollmentsData)
        setRecentGrades(gradesData.slice(0, 3)) // Show only recent 3 grades
        setAnnouncements(announcementsData.slice(0, 4)) // Show only 4 announcements
      }
    } catch (error) {
      console.error("Error loading student data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Student profile not found. Please contact administration.</p>
        </div>
      </DashboardLayout>
    )
  }

  const totalCredits = enrollments
    .filter((e) => e.status === "completed")
    .reduce((sum, e) => sum + (e.section?.course?.credits || 0), 0)

  const degreeProgress = Math.round((totalCredits / 120) * 100) // Assuming 120 credits for degree

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {student.user?.full_name}!</h1>
              <p className="text-primary-foreground/90">
                {student.program} • Year {student.year_of_study} • ID: {student.student_id}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{student.gpa.toFixed(2)}</div>
              <div className="text-sm text-primary-foreground/80">Current GPA</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {enrollments.filter((e) => e.status === "enrolled").length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Current Courses</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{totalCredits}</div>
                <div className="text-sm text-muted-foreground font-medium">Credits Completed</div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{degreeProgress}%</div>
                <div className="text-sm text-muted-foreground font-medium">Degree Progress</div>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{announcements.length}</div>
                <div className="text-sm text-muted-foreground font-medium">New Announcements</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Current Courses
              </CardTitle>
              <CardDescription>Your enrolled courses this semester</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollments
                .filter((e) => e.status === "enrolled")
                .map((enrollment) => (
                  <div key={enrollment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{enrollment.section?.course?.course_code}</h4>
                        <p className="text-sm text-muted-foreground">{enrollment.section?.course?.title}</p>
                        <p className="text-xs text-muted-foreground">{enrollment.section?.faculty?.user?.full_name}</p>
                      </div>
                      <Badge variant={enrollment.final_grade?.startsWith("A") ? "default" : "secondary"}>
                        {enrollment.final_grade || "In Progress"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Credits</span>
                        <span>{enrollment.section?.course?.credits}</span>
                      </div>
                    </div>
                  </div>
                ))}
              {enrollments.filter((e) => e.status === "enrolled").length === 0 && (
                <p className="text-muted-foreground text-center py-4">No current enrollments</p>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Announcements
              </CardTitle>
              <CardDescription>Important updates and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full mt-2 ${
                      announcement.priority === "urgent"
                        ? "bg-destructive"
                        : announcement.priority === "high"
                          ? "bg-primary"
                          : "bg-secondary"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {announcement.priority}
                  </Badge>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No recent announcements</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Grades
            </CardTitle>
            <CardDescription>Your latest assignment and exam results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{grade.assignment?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {grade.assignment?.section?.course?.course_code} - {grade.assignment?.section?.course?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {grade.points_earned ? `${grade.points_earned}/${grade.assignment?.total_points}` : "Pending"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {grade.graded_at ? new Date(grade.graded_at).toLocaleDateString() : "Not graded"}
                    </p>
                  </div>
                </div>
              ))}
              {recentGrades.length === 0 && <p className="text-muted-foreground text-center py-4">No recent grades</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
