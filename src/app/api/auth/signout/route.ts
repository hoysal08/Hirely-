import { type NextRequest, NextResponse } from "next/server";

// Legacy sign-out route. With auth removed, just send users back to the dashboard.
export async function GET(req: NextRequest) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
}
