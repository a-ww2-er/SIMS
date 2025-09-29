"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn, userProfile, user } = useAuth()
  const supabase = createClient()


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { error: authError } = await signIn(email, password)

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    // Redirect immediately based on user metadata (should be available after login)
    const userRole = user?.user_metadata?.role || 'student'

    if (userRole === 'faculty') {
      router.push('/faculty/dashboard')
    } else if (userRole === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/student/dashboard')
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full bg-white shadow-2xl border-0">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold text-secondary">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Sign in to access your educational portal
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </div>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            No account? <button
            onClick={()=> router.push('auth/register')}
            className="text-primary hover:underline font-medium">Register here</button>
          </p>
          <p className="text-sm text-muted-foreground">
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="text-primary hover:underline font-medium"
            >
              Forgot your password?
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
