"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { FacultyService } from "@/lib/services/faculty-service"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
interface CourseFormData {
  course_code: string
  title: string
  description: string
  credits: number
  department_id: string
  prerequisites: string[]
  section_number: string
  semester: string
  year: number
  max_enrollment: number
  schedule_days: string[]
  schedule_time: string
  schedule_room: string
}

export function RegisterCourse() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])

  const [formData, setFormData] = useState<CourseFormData>({
    course_code: "",
    title: "",
    description: "",
    credits: 3,
    department_id: "",
    prerequisites: [],
    section_number: "01",
    semester: "Fall",
    year: new Date().getFullYear(),
    max_enrollment: 30,
    schedule_days: [],
    schedule_time: "",
    schedule_room: "",
  })

  const [prerequisiteInput, setPrerequisiteInput] = useState("")

  const facultyService = new FacultyService()
  const supabase = createClient()

  const loadDepartments = async () => {
    try {
      const { data, error } = await supabase.from("departments").select("*").order("name")
      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error("Error loading departments:", error)
    }
  }

  // Load departments on component mount
  useEffect(() => {
    loadDepartments()
  }, [])

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedule_days: prev.schedule_days.includes(day)
        ? prev.schedule_days.filter(d => d !== day)
        : [...prev.schedule_days, day]
    }))
  }

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()]
      }))
      setPrerequisiteInput("")
    }
  }

  const removePrerequisite = (prereq: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prereq)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("You must be logged in to register a course")
      return
    }

    try {
      setLoading(true)

      // Get faculty profile
      const facultyProfile = await facultyService.getFacultyProfile(user.id)
      if (!facultyProfile) {
        alert("Faculty profile not found")
        return
      }

      // Create the course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .insert({
          course_code: formData.course_code,
          title: formData.title,
          description: formData.description,
          credits: formData.credits,
          department_id: formData.department_id,
          prerequisites: formData.prerequisites,
        })
        .select()
        .single()

      if (courseError) throw courseError

      // Create the course section
      const { error: sectionError } = await supabase
        .from("course_sections")
        .insert({
          course_id: courseData.id,
          section_number: formData.section_number,
          semester: formData.semester,
          year: formData.year,
          faculty_id: facultyProfile.id,
          max_enrollment: formData.max_enrollment,
          current_enrollment: 0,
          schedule: {
            days: formData.schedule_days,
            time: formData.schedule_time,
            room: formData.schedule_room,
          },
        })

      if (sectionError) throw sectionError

      alert("Course registered successfully!")
      router.push("/faculty/courses")

    } catch (error: any) {
      console.error("Error registering course:", error)
      alert(`Error registering course: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Register New Course</h1>
            <p className="text-muted-foreground">Create a new course and set up its first section</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Basic details about the course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course_code">Course Code *</Label>
                    <Input
                      id="course_code"
                      value={formData.course_code}
                      onChange={(e) => handleInputChange("course_code", e.target.value)}
                      placeholder="e.g., CS301"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Select value={formData.credits.toString()} onValueChange={(value) => handleInputChange("credits", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Data Structures and Algorithms"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Course description..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department_id} onValueChange={(value) => handleInputChange("department_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prerequisites */}
                <div>
                  <Label>Prerequisites</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={prerequisiteInput}
                      onChange={(e) => setPrerequisiteInput(e.target.value)}
                      placeholder="e.g., CS201"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrerequisite())}
                    />
                    <Button type="button" onClick={addPrerequisite} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.prerequisites.map((prereq) => (
                      <div key={prereq} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                        {prereq}
                        <button
                          type="button"
                          onClick={() => removePrerequisite(prereq)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Information */}
            <Card>
              <CardHeader>
                <CardTitle>Section Information</CardTitle>
                <CardDescription>Details for the course section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="section_number">Section Number</Label>
                    <Input
                      id="section_number"
                      value={formData.section_number}
                      onChange={(e) => handleInputChange("section_number", e.target.value)}
                      placeholder="01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_enrollment">Max Enrollment</Label>
                    <Input
                      id="max_enrollment"
                      type="number"
                      value={formData.max_enrollment}
                      onChange={(e) => handleInputChange("max_enrollment", parseInt(e.target.value))}
                      min="1"
                      max="200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 10}
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <Label>Schedule Days</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.schedule_days.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <Label htmlFor={day} className="text-sm">{day.slice(0, 3)}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule_time">Time</Label>
                    <Input
                      id="schedule_time"
                      value={formData.schedule_time}
                      onChange={(e) => handleInputChange("schedule_time", e.target.value)}
                      placeholder="e.g., 10:00-11:30 AM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule_room">Room</Label>
                    <Input
                      id="schedule_room"
                      value={formData.schedule_room}
                      onChange={(e) => handleInputChange("schedule_room", e.target.value)}
                      placeholder="e.g., CS Building 201"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering Course...
                </>
              ) : (
                "Register Course"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}