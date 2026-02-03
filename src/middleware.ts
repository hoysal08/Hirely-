import { type NextRequest, NextResponse } from 'next/server'

// Auth has been removed for the MVP, so middleware is now a simple pass-through.
export function middleware(_request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
