import { NextResponse } from "next/server";

// Legacy auth callback route. Auth has been removed, so we simply
// redirect back to the dashboard to avoid dead links.
export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
