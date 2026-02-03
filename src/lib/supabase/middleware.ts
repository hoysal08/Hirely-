import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    // Ensure production-safe cookie settings
                    const cookieOptions = {
                        ...options,
                        sameSite: 'lax' as const,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                    }

                    request.cookies.set({
                        name,
                        value,
                        ...cookieOptions,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...cookieOptions,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    // Ensure production-safe cookie settings for removal
                    const cookieOptions = {
                        ...options,
                        sameSite: 'lax' as const,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                        maxAge: 0,
                    }

                    request.cookies.set({
                        name,
                        value: '',
                        ...cookieOptions,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...cookieOptions,
                    })
                },
            },
        }
    )

    // IMPORTANT: Use getUser() for authoritative verification
    // This makes a network call to validate the JWT server-side
    // and will trigger automatic token refresh if needed
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    // Protect dashboard routes - redirect to login if not authenticated
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user || authError) {
            const redirectUrl = new URL('/login', request.url)
            // Preserve the original URL for redirect after login
            redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Redirect authenticated users away from auth pages
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
        if (user && !authError) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return response
}
