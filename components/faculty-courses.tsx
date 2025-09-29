"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, Calendar, FileText, Search, Plus, Settings, Download, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { FacultyService } from "@/lib/services/faculty-service"
import type { CourseSection } from "@/lib/types/database"
import Link from "next/link"

export function FacultyCourses() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [myCourses, setMyCourses] = useState<CourseSection[]>([])
  const [pendingGrades, setPendingGrades] = useState(0)
  const [loading, setLoading] = useState(true)

  const facultyService = new FacultyService()

  useEffect(() => {
    if (user) {
      loadFacultyData()
    }
  }, [user])

  const loadFacultyData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get faculty profile first
      const facultyProfile = await facultyService.getFacultyProfile(user.id)
      if (!facultyProfile) {
        console.error("Faculty profile not found")
        return
      }

      // Load courses and pending grades in parallel
      const [courses, grades] = await Promise.all([
        facultyService.getFacultyCourses(facultyProfile.id),
        facultyService.getPendingGrades(facultyProfile.id)
      ])

      setMyCourses(courses)
      setPendingGrades(grades.length)
    } catch (error) {
      console.error("Error loading faculty data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Remove course requests section as per requirement - faculty cannot create courses themselves

  const filteredCourses = myCourses.filter(
    (section) => {
      const course = section.course
      const courseName = course?.title || ""
      const courseCode = course?.course_code || ""

      return courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    }
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your assigned courses and course materials</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
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
                  <div className="text-2xl font-bold">{myCourses.length}</div>
                  <div className="text-sm text-muted-foreground">Active Courses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {myCourses.reduce((sum, section) => sum + section.current_enrollment, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <FileText className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingGrades}</div>
                  <div className="text-sm text-muted-foreground">Pending Grades</div>
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
                  <div className="text-2xl font-bold">
                    {myCourses.length * 3} {/* Placeholder for assignments */}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Assignments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Current Courses
            </CardTitle>
            <CardDescription>Courses you're teaching this semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading courses...</span>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No courses assigned to you.
              </div>
            ) : (
              filteredCourses.map((section) => {
                const course = section.course

                if (!course) return null

                return (
                  <Link key={section.id} href={`/faculty/course/${section.id}`}>
                    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold hover:text-primary transition-colors">{course.course_code}</h3>
                            <Badge variant="default">Active</Badge>
                            {pendingGrades > 0 && (
                              <Badge variant="destructive">{pendingGrades} pending grades</Badge>
                            )}
                          </div>
                          <h4 className="text-lg font-medium text-muted-foreground mb-1 hover:text-primary transition-colors">{course.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{course.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>
                                <span className="font-medium">Schedule:</span> {section.schedule ? `${section.schedule.days.join(', ')} ${section.schedule.time}` : "TBD"}
                              </p>
                              <p>
                                <span className="font-medium">Room:</span> {section.schedule?.room || "TBD"}
                              </p>
                              <p>
                                <span className="font-medium">Semester:</span> {section.semester} {section.year}
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">Enrollment:</span> {section.current_enrollment}/{section.max_enrollment}
                              </p>
                              <p>
                                <span className="font-medium">Section:</span> {section.section_number}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-primary mb-1">{section.current_enrollment}</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm">Manage Course</Button>
                        <Button size="sm" variant="outline">
                          <Users className="w-4 h-4 mr-2" />
                          {section.current_enrollment} Students
                        </Button>
                        {/* <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Gradebook
                        </Button> */}
                        {/* <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button> */}
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}
