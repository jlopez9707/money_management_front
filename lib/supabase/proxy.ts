import { getUser } from '@/actions/auth/get-user'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const user = await getUser();

  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/update-password'
  ]

  // if user is not logged in and is trying to access a protected route, redirect to login
  if(!user && protectedRoutes.includes(request.nextUrl.pathname)){
    return NextResponse.redirect(new URL('/', request.url))
  }

  // if user is logged in and is trying to access the login page, redirect to dashboard
  if(user && request.nextUrl.pathname === '/'){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}