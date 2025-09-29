import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Get user profile to determine redirect
        const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

        const role = userProfile?.role
        let redirectPath = "/"

        switch (role) {
          case "student":
            redirectPath = "/student/dashboard"
            break
          case "faculty":
            redirectPath = "/faculty/dashboard"
            break
          case "admin":
            redirectPath = "/admin/dashboard"
            break
          default:
            redirectPath = "/"
        }

        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
