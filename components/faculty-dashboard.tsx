"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export function FacultyDashboard() {
  const facultyData = {
    name: "Dr. Joshua Timileyn",
    employeeId: "FAC2024001",
    department: "Computer Science",
    title: "Associate Professor",
    coursesThisSemester: 3,
    totalStudents: 127,
  }

  const courses = [
    {
      code: "CS301",
      name: "Data Structures",
      students: 45,
      schedule: "MWF 10:00-11:00",
      pendingGrades: 12,
      nextClass: "Today 10:00 AM",
    },
    {
      code: "CS401",
      name: "Advanced Algorithms",
      students: 32,
      schedule: "TTh 2:00-3:30",
      pendingGrades: 8,
      nextClass: "Tomorrow 2:00 PM",
    },
    {
      code: "CS501",
      name: "Machine Learning",
      students: 50,
      schedule: "MWF 1:00-2:00",
      pendingGrades: 15,
      nextClass: "Today 1:00 PM",
    },
  ]

  const upcomingTasks = [
    { title: "Grade CS301 Midterm Exams", dueDate: "Oct 15", priority: "high", type: "grading" },
    { title: "Prepare CS401 Lecture Notes", dueDate: "Oct 16", priority: "medium", type: "preparation" },
    { title: "Faculty Meeting", dueDate: "Oct 18", priority: "low", type: "meeting" },
    { title: "Submit Grade Reports", dueDate: "Oct 20", priority: "high", type: "administrative" },
  ]

  const recentActivity = [
    { action: "Graded Assignment 3", course: "CS301", time: "2 hours ago" },
    { action: "Posted new lecture materials", course: "CS501", time: "4 hours ago" },
    { action: "Responded to student questions", course: "CS401", time: "6 hours ago" },
    { action: "Updated course syllabus", course: "CS301", time: "1 day ago" },
  ]

  const studentPerformance = [
    { course: "CS301", avgGrade: 82, trend: "up", atRisk: 3 },
    { course: "CS401", avgGrade: 78, trend: "stable", atRisk: 5 },
    { course: "CS501", avgGrade: 85, trend: "up", atRisk: 2 },
  ]

  return (
    <DashboardLayout userType="faculty" userName={facultyData.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-xl p-6 text-secondary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {facultyData.name}!</h1>
              <p className="text-secondary-foreground/90">
                {facultyData.title} • {facultyData.department} • ID: {facultyData.employeeId}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{facultyData.totalStudents}</div>
              <div className="text-sm text-secondary-foreground/80">Total Students</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{facultyData.coursesThisSemester}</div>
                <div className="text-sm text-muted-foreground font-medium">Active Courses</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{facultyData.totalStudents}</div>
                <div className="text-sm text-muted-foreground font-medium">Total Students</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive mb-2">
                  {courses.reduce((sum, course) => sum + course.pendingGrades, 0)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Pending Grades</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {upcomingTasks.filter((task) => task.priority === "high").length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">High Priority Tasks</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My Courses
              </CardTitle>
              <CardDescription>Courses you're teaching this semester</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div key={course.code} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{course.code}</h4>
                      <p className="text-sm text-muted-foreground">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.schedule}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{course.students}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next class: {course.nextClass}</span>
                    {course.pendingGrades > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {course.pendingGrades} pending grades
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Your pending tasks and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.priority === "high"
                        ? "bg-destructive"
                        : task.priority === "medium"
                          ? "bg-primary"
                          : "bg-accent"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Student Performance
              </CardTitle>
              <CardDescription>Class averages and at-risk students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentPerformance.map((perf) => (
                <div key={perf.course} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{perf.course}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{perf.avgGrade}%</span>
                      {perf.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-accent" />
                      ) : (
                        <div className="w-4 h-4 bg-muted rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={perf.avgGrade} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Class Average</span>
                      {perf.atRisk > 0 && (
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="w-3 h-3" />
                          <span>{perf.atRisk} at risk</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.action}</h4>
                    <p className="text-sm text-muted-foreground">{activity.course}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
