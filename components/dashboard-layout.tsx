"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  Upload,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { user, userProfile, signOut } = useAuth()

  const userType = userProfile?.role || "student"
  const userName = userProfile?.full_name || "User"

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out z-50 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 ">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png" alt="Logo" className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg">EduCare SIMS</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {getNavigationItems(userType).map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-4 h-4" />
              </Button>

              {/* <div className="hidden md:flex items-center gap-2 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, students, or resources..."
                  className="border-0 bg-muted/50 focus-visible:ring-1"
                />
              </div> */}
            </div>

            <div className="flex items-center gap-3">
              {/* <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs">3</Badge>
              </Button> */}

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userType}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

function getNavigationItems(userType: "student" | "faculty" | "admin") {
  const baseItems = [
    { icon: Home, label: "Dashboard", href: `/${userType}/dashboard` },
    // { icon: User, label: "Profile", href: `/${userType}/profile` },
    // { icon: Settings, label: "Settings", href: `/${userType}/settings` },
  ]

  switch (userType) {
    case "student":
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: "Courses", href: "/student/courses" },
        { icon: Upload, label: "Upload", href: "/student/upload" },
        { icon: FileText, label: "Records", href: "/student/records" },
        // { icon: Calendar, label: "Schedule", href: "/student/schedule" },
        ...baseItems.slice(1),
      ]
    case "faculty":
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: "All Courses", href: "/faculty/courses" },
        { icon: Plus, label: "Register Course", href: "/faculty/register-course" },
        { icon: Upload, label: "Student Uploads", href: "/faculty/uploads" },
        { icon: FileText, label: "Gradebook", href: "/faculty/gradebook" },
        // { icon: Calendar, label: "Schedule", href: "/faculty/schedule" },
        ...baseItems.slice(1),
      ]
    case "admin":
      return [
        ...baseItems.slice(0, 1),
        { icon: User, label: "Students", href: "/admin/students" },
        { icon: BookOpen, label: "Courses", href: "/admin/courses" },
        { icon: FileText, label: "Reports", href: "/admin/reports" },
        ...baseItems.slice(1),
      ]
    default:
      return baseItems
  }
}
