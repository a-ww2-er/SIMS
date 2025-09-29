"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { BookOpen, Calendar, Clock, Users, Search, Filter, Download, Star } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export function StudentCourses() {
  const [searchTerm, setSearchTerm] = useState("")

  const enrolledCourses = [
    {
      code: "CS301",
      name: "Data Structures and Algorithms",
      instructor: "Dr. Sarah Smith",
      credits: 3,
      schedule: "MWF 10:00-11:00 AM",
      room: "CS Building 201",
      progress: 85,
      grade: "A-",
      assignments: 12,
      completedAssignments: 10,
      nextDeadline: "Assignment 4 - Oct 18",
      description: "Advanced study of data structures including trees, graphs, and hash tables.",
    },
    {
      code: "CS302",
      name: "Database Systems",
      instructor: "Prof. Michael Johnson",
      credits: 4,
      schedule: "TTh 2:00-3:30 PM",
      room: "CS Building 105",
      progress: 78,
      grade: "B+",
      assignments: 8,
      completedAssignments: 6,
      nextDeadline: "Midterm Exam - Oct 22",
      description: "Comprehensive introduction to database design, SQL, and database management systems.",
    },
    {
      code: "CS303",
      name: "Software Engineering",
      instructor: "Dr. Emily Brown",
      credits: 3,
      schedule: "MWF 1:00-2:00 PM",
      room: "CS Building 301",
      progress: 92,
      grade: "A",
      assignments: 6,
      completedAssignments: 6,
      nextDeadline: "Final Project - Nov 15",
      description: "Software development lifecycle, project management, and team collaboration.",
    },
    {
      code: "MATH201",
      name: "Statistics for Computer Science",
      instructor: "Prof. David Davis",
      credits: 3,
      schedule: "TTh 11:00-12:30 PM",
      room: "Math Building 150",
      progress: 70,
      grade: "B",
      assignments: 10,
      completedAssignments: 7,
      nextDeadline: "Quiz 3 - Oct 20",
      description: "Statistical methods and probability theory with applications to computer science.",
    },
  ]

  const availableCourses = [
    {
      code: "CS401",
      name: "Advanced Algorithms",
      instructor: "Dr. Lisa Chen",
      credits: 3,
      schedule: "MWF 9:00-10:00 AM",
      room: "CS Building 202",
      capacity: 30,
      enrolled: 25,
      prerequisites: ["CS301"],
      description: "Advanced algorithmic techniques including dynamic programming and graph algorithms.",
    },
    {
      code: "CS405",
      name: "Machine Learning",
      instructor: "Prof. Robert Wilson",
      credits: 4,
      schedule: "TTh 3:30-5:00 PM",
      room: "CS Building 401",
      capacity: 25,
      enrolled: 20,
      prerequisites: ["CS301", "MATH201"],
      description: "Introduction to machine learning algorithms and their applications.",
    },
  ]

  const filteredEnrolledCourses = enrolledCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout userType="student" userName="Issac ewa">
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
                    {enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}
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
                    {Math.round(
                      enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length,
                    )}
                    %
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
                    {enrolledCourses.reduce(
                      (sum, course) => sum + (course.assignments - course.completedAssignments),
                      0,
                    )}
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
            {filteredEnrolledCourses.map((course) => (
              <div key={course.code} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{course.code}</h3>
                      <Badge variant={course.grade.startsWith("A") ? "default" : "secondary"}>{course.grade}</Badge>
                    </div>
                    <h4 className="text-lg font-medium text-muted-foreground mb-1">{course.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <span className="font-medium">Instructor:</span> {course.instructor}
                        </p>
                        <p>
                          <span className="font-medium">Schedule:</span> {course.schedule}
                        </p>
                        <p>
                          <span className="font-medium">Room:</span> {course.room}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Credits:</span> {course.credits}
                        </p>
                        <p>
                          <span className="font-medium">Assignments:</span> {course.completedAssignments}/
                          {course.assignments}
                        </p>
                        <p>
                          <span className="font-medium">Next Deadline:</span> {course.nextDeadline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-primary mb-1">{course.progress}%</div>
                    <div className="text-sm text-muted-foreground mb-3">Progress</div>
                    <Progress value={course.progress} className="w-24 h-2" />
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
            ))}
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
            {availableCourses.map((course) => (
              <div key={course.code} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{course.code}</h3>
                      <Badge variant="outline">{course.credits} Credits</Badge>
                    </div>
                    <h4 className="text-lg font-medium text-muted-foreground mb-1">{course.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <span className="font-medium">Instructor:</span> {course.instructor}
                        </p>
                        <p>
                          <span className="font-medium">Schedule:</span> {course.schedule}
                        </p>
                        <p>
                          <span className="font-medium">Room:</span> {course.room}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Capacity:</span> {course.enrolled}/{course.capacity}
                        </p>
                        <p>
                          <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="mb-3">
                      <Progress value={(course.enrolled / course.capacity) * 100} className="w-24 h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {course.capacity - course.enrolled} spots left
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">Enroll Now</Button>
                  <Button size="sm" variant="outline">
                    View Syllabus
                  </Button>
                  <Button size="sm" variant="outline">
                    Add to Wishlist
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
