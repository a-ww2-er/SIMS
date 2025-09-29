"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  AlertTriangle,
  Download,
  FileText,
  Target,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-semester")
  const [selectedReport, setSelectedReport] = useState("overview")

  const enrollmentData = [
    { semester: "Fall 2022", students: 2456, faculty: 142, courses: 298 },
    { semester: "Spring 2023", students: 2523, faculty: 148, courses: 312 },
    { semester: "Fall 2023", students: 2654, faculty: 151, courses: 325 },
    { semester: "Spring 2024", students: 2701, faculty: 154, courses: 334 },
    { semester: "Fall 2024", students: 2847, faculty: 156, courses: 342 },
  ]

  const departmentPerformance = [
    { department: "Computer Science", avgGPA: 3.42, students: 456, retention: 94 },
    { department: "Engineering", avgGPA: 3.28, students: 623, retention: 91 },
    { department: "Business", avgGPA: 3.15, students: 789, retention: 88 },
    { department: "Mathematics", avgGPA: 3.38, students: 234, retention: 93 },
    { department: "Liberal Arts", avgGPA: 3.22, students: 745, retention: 89 },
  ]

  const gradeDistribution = [
    { grade: "A", count: 1247, percentage: 35.2, color: "#10b981" },
    { grade: "B", count: 1456, percentage: 41.1, color: "#3b82f6" },
    { grade: "C", count: 623, percentage: 17.6, color: "#f59e0b" },
    { grade: "D", count: 156, percentage: 4.4, color: "#ef4444" },
    { grade: "F", count: 62, percentage: 1.7, color: "#dc2626" },
  ]

  const financialMetrics = {
    totalRevenue: 15200000,
    tuitionRevenue: 12500000,
    operatingExpenses: 8900000,
    scholarshipFunds: 1200000,
    netIncome: 6300000,
    budgetUtilization: 78,
  }

  const atRiskStudents = [
    { name: "John Doe", studentId: "STU2024123", gpa: 1.8, department: "Engineering", risk: "high" },
    { name: "Jane Smith", studentId: "STU2024124", gpa: 2.1, department: "Business", risk: "medium" },
    { name: "Mike Johnson", studentId: "STU2024125", gpa: 1.9, department: "Computer Science", risk: "high" },
    { name: "Sarah Wilson", studentId: "STU2024126", gpa: 2.3, department: "Mathematics", risk: "medium" },
  ]

  const facultyMetrics = {
    totalFaculty: 156,
    avgClassSize: 28.5,
    avgTeachingLoad: 3.2,
    satisfactionScore: 4.2,
    retentionRate: 94.5,
  }

  const periodOptions = [
    { value: "current-semester", label: "Current Semester" },
    { value: "academic-year", label: "Academic Year" },
    { value: "last-year", label: "Last Year" },
    { value: "5-year", label: "5 Year Trend" },
  ]

  const reportTypes = [
    { value: "overview", label: "Executive Overview" },
    { value: "academic", label: "Academic Performance" },
    { value: "financial", label: "Financial Report" },
    { value: "enrollment", label: "Enrollment Analytics" },
    { value: "faculty", label: "Faculty Metrics" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive institutional performance insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2,847</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <TrendingUp className="w-3 h-3" />
                    +5.4% from last semester
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png" alt="Logo" className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">3.29</div>
                  <div className="text-sm text-muted-foreground">Avg Institution GPA</div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <TrendingUp className="w-3 h-3" />
                    +0.12 from last year
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">91.2%</div>
                  <div className="text-sm text-muted-foreground">Retention Rate</div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <TrendingUp className="w-3 h-3" />
                    +2.1% from last year
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{atRiskStudents.length}</div>
                  <div className="text-sm text-muted-foreground">At-Risk Students</div>
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <TrendingDown className="w-3 h-3" />
                    -8 from last month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Enrollment Trends
              </CardTitle>
              <CardDescription>Student enrollment over the past 5 semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Grade Distribution
              </CardTitle>
              <CardDescription>Overall grade distribution across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Department Performance
            </CardTitle>
            <CardDescription>Academic performance metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgGPA" fill="#3b82f6" name="Average GPA" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Financial Overview
              </CardTitle>
              <CardDescription>Current fiscal year financial summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="text-lg font-bold text-accent">
                    ${(financialMetrics.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-lg font-bold text-primary">
                    ${(financialMetrics.netIncome / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Net Income</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Utilization</span>
                  <span>{financialMetrics.budgetUtilization}%</span>
                </div>
                <Progress value={financialMetrics.budgetUtilization} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Tuition Revenue</div>
                  <div className="text-muted-foreground">
                    ${(financialMetrics.tuitionRevenue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="font-medium">Operating Expenses</div>
                  <div className="text-muted-foreground">
                    ${(financialMetrics.operatingExpenses / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* At-Risk Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                At-Risk Students
              </CardTitle>
              <CardDescription>Students requiring academic intervention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {atRiskStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {student.studentId} • {student.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-destructive">{student.gpa}</div>
                    <Badge variant={student.risk === "high" ? "destructive" : "secondary"}>{student.risk} risk</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Faculty Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Faculty Metrics
            </CardTitle>
            <CardDescription>Faculty performance and satisfaction indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{facultyMetrics.totalFaculty}</div>
                <div className="text-sm text-muted-foreground">Total Faculty</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-accent">{facultyMetrics.avgClassSize}</div>
                <div className="text-sm text-muted-foreground">Avg Class Size</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-secondary">{facultyMetrics.avgTeachingLoad}</div>
                <div className="text-sm text-muted-foreground">Avg Teaching Load</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{facultyMetrics.satisfactionScore}/5</div>
                <div className="text-sm text-muted-foreground">Satisfaction Score</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-accent">{facultyMetrics.retentionRate}%</div>
                <div className="text-sm text-muted-foreground">Retention Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
