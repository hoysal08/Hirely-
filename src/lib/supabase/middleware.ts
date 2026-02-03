import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. Create an unmodified response
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 2. Create the Supabase client with the standard getAll/setAll pattern
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Sync cookies to the request so getUser() can see them in the same request
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

                    // Create a new response to set the cookies
                    supabaseResponse = NextResponse.next({
                        request,
                    })

                    // Sync cookies to the response so they are sent back to the browser
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )


    try {
        await supabase.auth.getUser()
    } catch (e) {
        // Log error but don't crash. Let the page-level auth check handle it.
        console.error("Middleware Auth Error:", e)
    }

    return supabaseResponse
}
