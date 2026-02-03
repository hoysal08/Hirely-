import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase session middleware
 *
 * - Refreshes the Supabase session cookie on every request (GET + POST).
 * - Uses the official `@supabase/ssr` pattern so cookies are written ONLY on the response.
 * - Guards `/dashboard` for unauthenticated users on full page loads (GET),
 *   without interfering with Server Actions / POST requests.
 */
export async function updateSession(request: NextRequest) {
    // Create a response that we can attach cookies to.
    // Forward the incoming headers so Supabase can read the auth cookies.
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
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
                    // IMPORTANT: Only mutate the response cookies.
                    // Mutating `request.cookies` is not supported in the Edge runtime
                    // and leads to flaky auth (logout on refresh / POST failures).
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Trigger a session refresh if needed.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect dashboard routes on full page loads.
    // We only redirect on GET so we don't break Server Actions / form POSTs.
    if (
        request.nextUrl.pathname.startsWith('/dashboard') &&
        !user &&
        request.method === 'GET'
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return response
}
