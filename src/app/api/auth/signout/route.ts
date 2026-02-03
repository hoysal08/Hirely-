import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = createClient();
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login", req.url));
}
