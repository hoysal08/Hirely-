"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    console.log("Login action triggered");
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Attempting login for:", email);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login Error:", error.message);
        return redirect("/login?message=Could not authenticate user"); // Fixed redirect path to stay on login
    }

    console.log("Login successful, redirecting to dashboard");
    return redirect("/dashboard");
}

export async function signup(formData: FormData) {
    console.log("Signup action triggered");
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Attempting signup for:", email);

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
    });

    if (error) {
        console.error("Signup Error:", error.message);
        return redirect("/login?message=" + encodeURIComponent(error.message));
    }

    console.log("Signup init successful, check email");
    return redirect("/login?message=Check email to continue sign in process");
}
