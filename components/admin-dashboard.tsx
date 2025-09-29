"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertTriangle, Calendar, Building, DollarSign } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export function AdminDashboard() {
  const adminData = {
    name: "Dr.Binyami Ajayi",
    employeeId: "ADM2024001",
    role: "System Administrator",
    department: "Academic Affairs",
  }

  const systemStats = {
    totalStudents: 2847,
    totalFaculty: 156,
    totalCourses: 342,
    activeSemesters: 2,
    pendingApplications: 23,
    systemUptime: 99.8,
  }

  const departmentStats = [
    { name: "Computer Science", students: 456, faculty: 24, courses: 48, growth: 12 },
    { name: "Engineering", students: 623, faculty: 31, courses: 67, growth: 8 },
    { name: "Business", students: 789, faculty: 28, courses: 52, growth: 15 },
    { name: "Mathematics", students: 234, faculty: 18, courses: 34, growth: 5 },
    { name: "Liberal Arts", students: 745, faculty: 55, courses: 141, growth: -2 },
  ]

  const recentAlerts = [
    { type: "warning", message: "Server maintenance scheduled for Oct 20", time: "2 hours ago" },
    { type: "info", message: "New faculty orientation completed", time: "4 hours ago" },
    { type: "error", message: "Grade submission deadline approaching", time: "6 hours ago" },
    { type: "success", message: "Semester enrollment targets met", time: "1 day ago" },
  ]

  const upcomingEvents = [
    { title: "Faculty Senate Meeting", date: "Oct 15", type: "meeting" },
    { title: "Student Registration Opens", date: "Oct 18", type: "registration" },
    { title: "Semester Grade Reports Due", date: "Oct 22", type: "deadline" },
    { title: "Board of Trustees Meeting", date: "Oct 25", type: "meeting" },
  ]

  const financialOverview = {
    tuitionRevenue: 12500000,
    operatingExpenses: 8900000,
    scholarshipFunds: 1200000,
    budgetUtilization: 78,
  }

  const enrollmentTrends = [
    { semester: "Fall 2023", students: 2654 },
    { semester: "Spring 2024", students: 2701 },
    { semester: "Fall 2024", students: 2847 },
  ]

  return (
    <DashboardLayout userType="admin" userName={adminData.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {adminData.name}!</h1>
              <p className="text-primary-foreground/90">
                {adminData.role} • {adminData.department} • ID: {adminData.employeeId}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{systemStats.systemUptime}%</div>
              <div className="text-sm text-primary-foreground/80">System Uptime</div>
            </div>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{systemStats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">Total Students</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{systemStats.totalFaculty}</div>
                <div className="text-sm text-muted-foreground font-medium">Faculty Members</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{systemStats.totalCourses}</div>
                <div className="text-sm text-muted-foreground font-medium">Active Courses</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive mb-2">{systemStats.pendingApplications}</div>
                <div className="text-sm text-muted-foreground font-medium">Pending Applications</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Department Overview
              </CardTitle>
              <CardDescription>Student and faculty distribution by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{dept.name}</h4>
                    <Badge variant={dept.growth > 0 ? "default" : dept.growth < 0 ? "destructive" : "secondary"}>
                      {dept.growth > 0 ? "+" : ""}
                      {dept.growth}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{dept.students}</div>
                      <div className="text-muted-foreground">Students</div>
                    </div>
                    <div>
                      <div className="font-medium">{dept.faculty}</div>
                      <div className="text-muted-foreground">Faculty</div>
                    </div>
                    <div>
                      <div className="font-medium">{dept.courses}</div>
                      <div className="text-muted-foreground">Courses</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                System Alerts
              </CardTitle>
              <CardDescription>Recent system notifications and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full mt-2 ${
                      alert.type === "error"
                        ? "bg-destructive"
                        : alert.type === "warning"
                          ? "bg-yellow-500"
                          : alert.type === "success"
                            ? "bg-accent"
                            : "bg-primary"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Overview
              </CardTitle>
              <CardDescription>Current fiscal year financial summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent mb-1">
                    ${(financialOverview.tuitionRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Tuition Revenue</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-destructive mb-1">
                    ${(financialOverview.operatingExpenses / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Operating Expenses</div>
                </div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  ${(financialOverview.scholarshipFunds / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Scholarship Funds</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Utilization</span>
                  <span>{financialOverview.budgetUtilization}%</span>
                </div>
                <Progress value={financialOverview.budgetUtilization} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Important institutional events and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.type === "deadline"
                        ? "bg-destructive"
                        : event.type === "registration"
                          ? "bg-primary"
                          : "bg-accent"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Enrollment Trends
            </CardTitle>
            <CardDescription>Student enrollment over recent semesters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enrollmentTrends.map((trend, index) => (
                <div key={index} className="border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{trend.students.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground font-medium">{trend.semester}</div>
                  {index > 0 && (
                    <div className="text-xs text-accent mt-2 font-medium">
                      +{trend.students - enrollmentTrends[index - 1].students} students
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
