import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedRoutes = ["/student", "/faculty", "/admin"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    // No user, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (user && isProtectedRoute) {
    const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

    const userRole = userProfile?.role
    const requestedPath = request.nextUrl.pathname

    // Check if user is accessing the correct role-based route
    if (requestedPath.startsWith("/student") && userRole !== "student") {
      const url = request.nextUrl.clone()
      url.pathname = userRole === "faculty" ? "/faculty/dashboard" : "/admin/dashboard"
      return NextResponse.redirect(url)
    }

    if (requestedPath.startsWith("/faculty") && userRole !== "faculty") {
      const url = request.nextUrl.clone()
      url.pathname = userRole === "student" ? "/student/dashboard" : "/admin/dashboard"
      return NextResponse.redirect(url)
    }

    if (requestedPath.startsWith("/admin") && userRole !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = userRole === "student" ? "/student/dashboard" : "/faculty/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
