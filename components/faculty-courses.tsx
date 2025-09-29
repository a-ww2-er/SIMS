"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, Calendar, FileText, Search, Plus, Settings, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export function FacultyCourses() {
  const [searchTerm, setSearchTerm] = useState("")

  const myCourses = [
    {
      code: "CS301",
      name: "Data Structures and Algorithms",
      semester: "Fall 2024",
      students: 45,
      capacity: 50,
      schedule: "MWF 10:00-11:00 AM",
      room: "CS Building 201",
      pendingGrades: 12,
      assignments: 8,
      nextClass: "Today 10:00 AM",
      status: "active",
      description: "Advanced study of data structures including trees, graphs, and hash tables.",
    },
    {
      code: "CS401",
      name: "Advanced Algorithms",
      semester: "Fall 2024",
      students: 32,
      capacity: 35,
      schedule: "TTh 2:00-3:30 PM",
      room: "CS Building 105",
      pendingGrades: 8,
      assignments: 6,
      nextClass: "Tomorrow 2:00 PM",
      status: "active",
      description: "Advanced algorithmic techniques including dynamic programming and graph algorithms.",
    },
    {
      code: "CS501",
      name: "Machine Learning",
      semester: "Fall 2024",
      students: 28,
      capacity: 30,
      schedule: "MWF 1:00-2:00 PM",
      room: "CS Building 301",
      pendingGrades: 15,
      assignments: 10,
      nextClass: "Today 1:00 PM",
      status: "active",
      description: "Introduction to machine learning algorithms and their applications.",
    },
  ]

  const courseRequests = [
    {
      code: "CS502",
      name: "Deep Learning",
      semester: "Spring 2025",
      requestedStudents: 25,
      status: "pending",
      priority: "high",
    },
    {
      code: "CS503",
      name: "Computer Vision",
      semester: "Spring 2025",
      requestedStudents: 20,
      status: "approved",
      priority: "medium",
    },
  ]

  const filteredCourses = myCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout userType="faculty" userName="Dr. Joshua Timileyn">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your teaching assignments and course materials</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Request New Course
            </Button>
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
                    {myCourses.reduce((sum, course) => sum + course.students, 0)}
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
                  <div className="text-2xl font-bold">
                    {myCourses.reduce((sum, course) => sum + course.pendingGrades, 0)}
                  </div>
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
                    {myCourses.reduce((sum, course) => sum + course.assignments, 0)}
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
            {filteredCourses.map((course) => (
              <div key={course.code} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{course.code}</h3>
                      <Badge variant="default">{course.status}</Badge>
                      {course.pendingGrades > 0 && (
                        <Badge variant="destructive">{course.pendingGrades} pending grades</Badge>
                      )}
                    </div>
                    <h4 className="text-lg font-medium text-muted-foreground mb-1">{course.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <span className="font-medium">Schedule:</span> {course.schedule}
                        </p>
                        <p>
                          <span className="font-medium">Room:</span> {course.room}
                        </p>
                        <p>
                          <span className="font-medium">Next Class:</span> {course.nextClass}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Enrollment:</span> {course.students}/{course.capacity}
                        </p>
                        <p>
                          <span className="font-medium">Assignments:</span> {course.assignments}
                        </p>
                        <p>
                          <span className="font-medium">Semester:</span> {course.semester}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-primary mb-1">{course.students}</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">Manage Course</Button>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    View Students
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Gradebook
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Course Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Course Requests
            </CardTitle>
            <CardDescription>Your requests for upcoming semesters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseRequests.map((request) => (
              <div key={request.code} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{request.code}</h4>
                      <Badge variant={request.status === "approved" ? "default" : "secondary"}>{request.status}</Badge>
                      <Badge variant={request.priority === "high" ? "destructive" : "outline"}>
                        {request.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.semester} • {request.requestedStudents} expected students
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit Request
                    </Button>
                    {request.status === "approved" && <Button size="sm">Setup Course</Button>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
