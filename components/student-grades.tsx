"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, FileText, Download, Calendar, Award, Target } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"

export function StudentGrades() {
  const [selectedSemester, setSelectedSemester] = useState("fall-2024")

  const gradeData = {
    currentGPA: 3.75,
    cumulativeGPA: 3.68,
    creditsCompleted: 85,
    creditsInProgress: 15,
    semesterRank: 12,
    totalStudents: 156,
  }

  const courseGrades = [
    {
      code: "CS301",
      name: "Data Structures and Algorithms",
      instructor: "Dr. Sarah Smith",
      credits: 3,
      currentGrade: "A-",
      percentage: 91.5,
      assignments: [
        { name: "Assignment 1", grade: "A", points: 95, maxPoints: 100, date: "Sep 15" },
        { name: "Assignment 2", grade: "A-", points: 88, maxPoints: 100, date: "Sep 29" },
        { name: "Midterm Exam", grade: "A-", points: 89, maxPoints: 100, date: "Oct 8" },
        { name: "Assignment 3", grade: "A", points: 94, maxPoints: 100, date: "Oct 12" },
      ],
      trend: "up",
    },
    {
      code: "CS302",
      name: "Database Systems",
      instructor: "Prof. Michael Johnson",
      credits: 4,
      currentGrade: "B+",
      percentage: 87.2,
      assignments: [
        { name: "Lab Report 1", grade: "B+", points: 85, maxPoints: 100, date: "Sep 20" },
        { name: "Quiz 1", grade: "A-", points: 90, maxPoints: 100, date: "Sep 27" },
        { name: "Lab Report 2", grade: "B", points: 82, maxPoints: 100, date: "Oct 6" },
        { name: "Project Phase 1", grade: "A", points: 95, maxPoints: 100, date: "Oct 10" },
      ],
      trend: "stable",
    },
    {
      code: "CS303",
      name: "Software Engineering",
      instructor: "Dr. Emily Brown",
      credits: 3,
      currentGrade: "A",
      percentage: 94.8,
      assignments: [
        { name: "Sprint 1", grade: "A", points: 96, maxPoints: 100, date: "Sep 18" },
        { name: "Code Review", grade: "A", points: 98, maxPoints: 100, date: "Sep 25" },
        { name: "Sprint 2", grade: "A-", points: 92, maxPoints: 100, date: "Oct 2" },
        { name: "Documentation", grade: "A", points: 94, maxPoints: 100, date: "Oct 9" },
      ],
      trend: "up",
    },
    {
      code: "MATH201",
      name: "Statistics for Computer Science",
      instructor: "Prof. David Davis",
      credits: 3,
      currentGrade: "B",
      percentage: 83.4,
      assignments: [
        { name: "Homework 1", grade: "B+", points: 87, maxPoints: 100, date: "Sep 12" },
        { name: "Quiz 1", grade: "B", points: 82, maxPoints: 100, date: "Sep 19" },
        { name: "Homework 2", grade: "B-", points: 78, maxPoints: 100, date: "Oct 3" },
        { name: "Quiz 2", grade: "B+", points: 86, maxPoints: 100, date: "Oct 7" },
      ],
      trend: "down",
    },
  ]

  const semesterOptions = [
    { value: "fall-2024", label: "Fall 2024" },
    { value: "spring-2024", label: "Spring 2024" },
    { value: "fall-2023", label: "Fall 2023" },
    { value: "spring-2023", label: "Spring 2023" },
  ]

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-accent"
    if (grade.startsWith("B")) return "text-primary"
    if (grade.startsWith("C")) return "text-yellow-600"
    return "text-destructive"
  }

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.startsWith("A")) return "default"
    if (grade.startsWith("B")) return "secondary"
    return "outline"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Grades</h1>
            <p className="text-muted-foreground">Track your academic performance and progress</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {semesterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Transcript
            </Button>
          </div>
        </div>

        {/* GPA Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{gradeData.currentGPA}</div>
                  <div className="text-sm text-muted-foreground">Current GPA</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{gradeData.cumulativeGPA}</div>
                  <div className="text-sm text-muted-foreground">Cumulative GPA</div>
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
                  <div className="text-2xl font-bold">{gradeData.creditsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Credits Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">#{gradeData.semesterRank}</div>
                  <div className="text-sm text-muted-foreground">Class Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Grades */}
        <div className="space-y-4">
          {courseGrades.map((course) => (
            <Card key={course.code}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {course.code} - {course.name}
                      <Badge variant={getGradeBadgeVariant(course.currentGrade)}>{course.currentGrade}</Badge>
                      {course.trend === "up" && <TrendingUp className="w-4 h-4 text-accent" />}
                      {course.trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                    </CardTitle>
                    <CardDescription>
                      {course.instructor} • {course.credits} Credits • {course.percentage}%
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getGradeColor(course.currentGrade)}`}>
                      {course.percentage}%
                    </div>
                    <Progress value={course.percentage} className="w-24 h-2 mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Assignment Breakdown
                  </h4>
                  <div className="grid gap-2">
                    {course.assignments.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={getGradeBadgeVariant(assignment.grade)} className="min-w-12">
                            {assignment.grade}
                          </Badge>
                          <div>
                            <p className="font-medium">{assignment.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {assignment.points}/{assignment.maxPoints} points
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{assignment.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Grade Distribution
            </CardTitle>
            <CardDescription>Your grade distribution across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-accent">1</div>
                <div className="text-sm text-muted-foreground">A Grades</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">B Grades</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-muted-foreground">C Grades</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-destructive">0</div>
                <div className="text-sm text-muted-foreground">Below C</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
