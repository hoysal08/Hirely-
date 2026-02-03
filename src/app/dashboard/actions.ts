"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCompany(formData: FormData) {
    const supabase = createClient() as any;
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string | null;
    const brand_color = formData.get("brand_color") as string | null;
    const logo_url = formData.get("logo_url") as string | null;
    const banner_url = formData.get("banner_url") as string | null;

    // Parse content sections
    let content_sections = [];
    try {
        const sectionsRaw = formData.get("content_sections") as string;
        if (sectionsRaw) {
            content_sections = JSON.parse(sectionsRaw);
        }
    } catch (e) {
        console.error("Failed to parse content_sections", e);
    }

    // Check if company exists for this user
    const { data: existingCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (existingCompany) {
        // Update
        const updates = {
            name,
            slug,
            description,
            brand_color,
            logo_url,
            banner_url,
            content_sections
        };

        const { error } = await supabase
            .from("companies")
            .update(updates)
            .eq("owner_id", user.id);

        if (error) throw new Error(error.message);
    } else {
        // Insert
        const { error } = await supabase.from("companies").insert({
            owner_id: user.id,
            name,
            slug,
            description,
            brand_color,
            logo_url,
            banner_url,
            content_sections
        });

        if (error) throw new Error(error.message);
    }

    revalidatePath("/dashboard");
}

export async function createJob(formData: FormData) {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Get company ID
    const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single();
    if (!company) throw new Error("Company not found");

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;

    const { error } = await supabase.from('jobs').insert({
        company_id: company.id,
        title,
        location,
        type,
        description,
        is_published: true
    });

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard");
}

export async function deleteJob(jobId: string) {
    const supabase = createClient() as any;
    // Policies handle security, but good to be explicit
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard");
}
