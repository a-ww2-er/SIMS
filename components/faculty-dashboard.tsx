"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, TrendingUp, AlertCircle, CheckCircle, Loader2, Plus, Trash2, Megaphone } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { FacultyService } from "@/lib/services/faculty-service"
import { NotificationService } from "@/lib/services/notification-service"
import type { Faculty, CourseSection, Announcement } from "@/lib/types/database"

export function FacultyDashboard() {
  const { user, userProfile } = useAuth()
  const [facultyProfile, setFacultyProfile] = useState<Faculty | null>(null)
  const [courses, setCourses] = useState<CourseSection[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [pendingGrades, setPendingGrades] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    target_audience: "all",
    priority: "normal"
  })
  const [creating, setCreating] = useState(false)

  const facultyService = new FacultyService()
  const notificationService = new NotificationService()

  useEffect(() => {
    if (user) {
      loadFacultyData()
    }
  }, [user])

  const loadFacultyData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load faculty profile, all courses, total students, pending grades, and announcements in parallel
      const [profile, allCourses, totalStudentsCount, grades, facultyAnnouncements] = await Promise.all([
        facultyService.getFacultyProfile(user.id),
        facultyService.getAllCourses(),
        facultyService.getTotalStudentCount(),
        facultyService.getPendingGrades(user.id),
        facultyService.getFacultyAnnouncements(user.id)
      ])

      setFacultyProfile(profile)
      setCourses(allCourses)
      setTotalStudents(totalStudentsCount)
      setPendingGrades(grades.length)
      setAnnouncements(facultyAnnouncements)
    } catch (error) {
      console.error("Error loading faculty data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!user || !facultyProfile) return

    try {
      setCreating(true)
      const result = await facultyService.createAnnouncement(newAnnouncement, user.id)

      if (result.success) {
        // Create notifications for target audience
        try {
          await notificationService.createAnnouncementNotification(
            result.data?.id || "",
            newAnnouncement.title,
            newAnnouncement.content,
            newAnnouncement.target_audience
          )
        } catch (notificationError) {
          console.error("Error creating announcement notifications:", notificationError)
          // Don't fail the announcement creation if notifications fail
        }

        // Reload announcements
        const updatedAnnouncements = await facultyService.getFacultyAnnouncements(user.id)
        setAnnouncements(updatedAnnouncements)

        // Reset form and close dialog
        setNewAnnouncement({
          title: "",
          content: "",
          target_audience: "all",
          priority: "normal"
        })
        setCreateDialogOpen(false)
      } else {
        alert(`Error creating announcement: ${result.error}`)
      }
    } catch (error) {
      console.error("Error creating announcement:", error)
      alert("Failed to create announcement")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      const result = await facultyService.deleteAnnouncement(announcementId)

      if (result.success) {
        // Remove from local state
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId))
      } else {
        alert(`Error deleting announcement: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting announcement:", error)
      alert("Failed to delete announcement")
    }
  }

  const facultyData = {
    name: facultyProfile?.user?.full_name || userProfile?.full_name || "Faculty Member",
    employeeId: facultyProfile?.employee_id || "Loading...",
    department: facultyProfile?.department || "Loading...",
    title: facultyProfile?.position || "Loading...",
    coursesThisSemester: courses.length,
    totalStudents: totalStudents,
  }


  
  return (
    <DashboardLayout>
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
              <div className="text-sm text-secondary-foreground/80">Registered Students</div>
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
                <div className="text-sm text-muted-foreground font-medium">Registered Students</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive mb-2">
                  {pendingGrades}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Pending Grades</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {announcements.length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Announcements</div>
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
                All Courses
              </CardTitle>
              <CardDescription>All courses available in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading courses...</span>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No courses assigned.
                </div>
              ) : (
                courses.map((section) => {
                  const course = section.course

                  if (!course) return null

                  return (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{course.course_code}</h4>
                          <p className="text-sm text-muted-foreground">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {section.schedule ? `${section.schedule.days.join(', ')} ${section.schedule.time}` : "TBD"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{section.current_enrollment}</div>
                          <div className="text-xs text-muted-foreground">Students</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {section.semester} {section.year}
                        </span>
                        {pendingGrades > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Grades pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                My Announcements
              </CardTitle>
              <CardDescription>Announcements you've created</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading announcements...</span>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No announcements yet.
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {announcement.target_audience}
                          </Badge>
                          <Badge
                            variant={
                              announcement.priority === "urgent" ? "destructive" :
                              announcement.priority === "high" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {announcement.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}

              {/* Create New Announcement Button */}
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                    <DialogDescription>
                      Create a new announcement for students, faculty, or everyone.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Announcement title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Announcement content..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select
                        value={newAnnouncement.target_audience}
                        onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, target_audience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Everyone</SelectItem>
                          <SelectItem value="students">Students Only</SelectItem>
                          <SelectItem value="faculty">Faculty Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newAnnouncement.priority}
                        onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateAnnouncement}
                        disabled={creating || !newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                        className="flex-1"
                      >
                        {creating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Announcement
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCreateDialogOpen(false)}
                        disabled={creating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
