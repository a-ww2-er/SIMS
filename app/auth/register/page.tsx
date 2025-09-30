"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { signUpStudent } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    const { error: authError } = await signUpStudent(
      formData.email,
      formData.password,
      formData.fullName
    )

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    setSuccess("Student registration successful! Please check your email to confirm your account.")
    setIsLoading(false)
  }

  return (
     <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80">
         <div className="min-h-screen flex">
           {/* Left Side - Hero Content */}
           <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
             <div className="absolute inset-0 bg-black/20" />
   
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-10">
               <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl" />
               <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl" />
               <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/50 rounded-full blur-2xl" />
             </div>
   
             <div className="relative z-10 max-w-lg">
               <div className="flex items-center gap-3 mb-8">
                 {/* <div className="p-3 bg-primary rounded-xl"> */}
                   <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png" alt="Logo" className="w-12 h-12" />
                 {/* </div> */}
                 <h1 className="text-3xl font-bold text-white">EduCare SIMS</h1>
               </div>
   
               <h2 className="text-5xl font-bold text-white mb-6 text-balance leading-tight">
                 {"Access records more "}
                 <span className="italic font-serif">Easily</span>
               </h2>
   
               <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed">
                 Empowering educational excellence through comprehensive student information management. Your education,
                 your future.
               </p>
   
               <div className="space-y-4">
                 <div className="text-white/80 text-lg font-medium">Trusted by 500+ educational institutions</div>
                 <div className="flex items-center gap-6 text-white/70">
                   <div className="text-center">
                     <div className="text-2xl font-bold">2,847</div>
                     <div className="text-sm">Active Students</div>
                   </div>
                   <div className="text-center">
                     <div className="text-2xl font-bold">156</div>
                     <div className="text-sm">Faculty Members</div>
                   </div>
                   <div className="text-center">
                     <div className="text-2xl font-bold">342</div>
                     <div className="text-sm">Courses</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
   
           {/* Right Side - Login Form */}
           <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white/5 backdrop-blur-sm">
             <div className="w-full max-w-md">
             <Card className="w-full max-w-md bg-white shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-3xl font-bold text-secondary">Student Registration</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Create your student account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            {success && <div className="text-sm text-accent bg-accent/10 p-3 rounded-md">{success}</div>}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium"
              disabled={isLoading || !formData.fullName || !formData.email || !formData.password || !formData.confirmPassword}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating student account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create Student Account
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/")}
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </button>
            </p>
            {/* <p className="text-sm text-muted-foreground mt-2">
              Are you an admin?{" "}
              <button
                onClick={() => router.push("/auth/register-faculty")}
                className="text-primary hover:underline font-medium"
              >
                Register as an admin
              </button>
            </p> */}
          </div>
        </CardContent>
      </Card>
             </div>
           </div>
   
           {/* Mobile Hero Content */}
           <div className="lg:hidden absolute top-6 left-6 right-6 z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-primary rounded-lg">
                 <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png" alt="Logo" className="w-6 h-6" />
               </div>
               <h1 className="text-xl font-bold text-white">EduCare SIMS</h1>
             </div>
           </div>
         </div>
       </div>
     )
     
}