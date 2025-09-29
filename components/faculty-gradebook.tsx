"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Users, FileText, Download, Search, Plus, Edit, Save } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export function FacultyGradebook() {
  const [selectedCourse, setSelectedCourse] = useState("CS301")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingGrade, setEditingGrade] = useState<string | null>(null)

  const courses = [
    { code: "CS301", name: "Data Structures", students: 45 },
    { code: "CS401", name: "Advanced Algorithms", students: 32 },
    { code: "CS501", name: "Machine Learning", students: 28 },
  ]

  const assignments = [
    { id: "a1", name: "Assignment 1", type: "homework", maxPoints: 100, dueDate: "Sep 15", weight: 10 },
    { id: "a2", name: "Assignment 2", type: "homework", maxPoints: 100, dueDate: "Sep 29", weight: 10 },
    { id: "midterm", name: "Midterm Exam", type: "exam", maxPoints: 100, dueDate: "Oct 8", weight: 25 },
    { id: "a3", name: "Assignment 3", type: "homework", maxPoints: 100, dueDate: "Oct 12", weight: 10 },
    { id: "project", name: "Final Project", type: "project", maxPoints: 100, dueDate: "Nov 15", weight: 30 },
    { id: "final", name: "Final Exam", type: "exam", maxPoints: 100, dueDate: "Dec 10", weight: 15 },
  ]

  const students = [
    {
      id: "s1",
      name: "Alice Johnson",
      email: "alice.johnson@university.edu",
      studentId: "STU2024001",
      grades: {
        a1: 95,
        a2: 88,
        midterm: 89,
        a3: 94,
        project: null,
        final: null,
      },
      currentGrade: "A-",
      attendance: 95,
    },
    {
      id: "s2",
      name: "Bob Smith",
      email: "bob.smith@university.edu",
      studentId: "STU2024002",
      grades: {
        a1: 82,
        a2: 85,
        midterm: 78,
        a3: 88,
        project: null,
        final: null,
      },
      currentGrade: "B+",
      attendance: 88,
    },
    {
      id: "s3",
      name: "Carol Davis",
      email: "carol.davis@university.edu",
      studentId: "STU2024003",
      grades: {
        a1: 98,
        a2: 92,
        midterm: 95,
        a3: 97,
        project: null,
        final: null,
      },
      currentGrade: "A",
      attendance: 100,
    },
    {
      id: "s4",
      name: "David Wilson",
      email: "david.wilson@university.edu",
      studentId: "STU2024004",
      grades: {
        a1: 75,
        a2: 78,
        midterm: 72,
        a3: 80,
        project: null,
        final: null,
      },
      currentGrade: "C+",
      attendance: 82,
    },
    {
      id: "s5",
      name: "Eva Brown",
      email: "eva.brown@university.edu",
      studentId: "STU2024005",
      grades: {
        a1: 90,
        a2: 87,
        midterm: 85,
        a3: 92,
        project: null,
        final: null,
      },
      currentGrade: "B+",
      attendance: 92,
    },
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.startsWith("A")) return "default"
    if (grade.startsWith("B")) return "secondary"
    if (grade.startsWith("C")) return "outline"
    return "destructive"
  }

  const calculateClassAverage = (assignmentId: string) => {
    const grades = students
      .map((s) => s.grades[assignmentId as keyof typeof s.grades])
      .filter((g) => g !== null) as number[]
    return grades.length > 0 ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length) : 0
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gradebook</h1>
            <p className="text-muted-foreground">Manage grades and track student performance</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Assignment
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Grades
            </Button>
          </div>
        </div>

        {/* Course Selection and Search */}
        <div className="flex items-center gap-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.code} value={course.code}>
                  {course.code} - {course.name} ({course.students} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Grade Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{filteredStudents.length}</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{assignments.length}</div>
                  <div className="text-sm text-muted-foreground">Assignments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      filteredStudents.reduce((sum, student) => {
                        const grades = Object.values(student.grades).filter((g) => g !== null) as number[]
                        return sum + (grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0)
                      }, 0) / filteredStudents.length,
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Class Average</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Edit className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {
                      filteredStudents.filter((student) =>
                        Object.values(student.grades).some((grade) => grade === null),
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Grades</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gradebook Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Grade Matrix
            </CardTitle>
            <CardDescription>Click on any grade to edit it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Student</TableHead>
                    <TableHead className="w-24">ID</TableHead>
                    {assignments.map((assignment) => (
                      <TableHead key={assignment.id} className="text-center min-w-20">
                        <div className="space-y-1">
                          <div className="font-medium">{assignment.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.maxPoints}pts • {assignment.weight}%
                          </div>
                          <div className="text-xs text-primary">Avg: {calculateClassAverage(assignment.id)}%</div>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Current Grade</TableHead>
                    <TableHead className="text-center">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.studentId}</TableCell>
                      {assignments.map((assignment) => {
                        const grade = student.grades[assignment.id as keyof typeof student.grades]
                        const cellKey = `${student.id}-${assignment.id}`
                        return (
                          <TableCell key={assignment.id} className="text-center">
                            {editingGrade === cellKey ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  min="0"
                                  max={assignment.maxPoints}
                                  defaultValue={grade || ""}
                                  className="w-16 h-8 text-center"
                                  onBlur={() => setEditingGrade(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") setEditingGrade(null)
                                  }}
                                />
                                <Button size="sm" variant="ghost" onClick={() => setEditingGrade(null)}>
                                  <Save className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingGrade(cellKey)}
                                className="hover:bg-muted rounded px-2 py-1 min-w-12"
                              >
                                {grade !== null ? (
                                  <span className={grade >= 90 ? "text-accent font-medium" : ""}>{grade}</span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </button>
                            )}
                          </TableCell>
                        )
                      })}
                      <TableCell className="text-center">
                        <Badge variant={getGradeBadgeVariant(student.currentGrade)}>{student.currentGrade}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={student.attendance >= 90 ? "text-accent font-medium" : ""}>
                          {student.attendance}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
