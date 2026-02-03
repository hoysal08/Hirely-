"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCompany(formData: FormData) {
    const supabase = await createClient() as any;

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

    // For the no-auth MVP, we treat this as a single-tenant app and simply
    // use the first (and only) company row, if it exists.
    const { data: existingCompany } = await supabase
        .from("companies")
        .select("id")
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
            .eq("id", existingCompany.id);

        if (error) throw new Error(error.message);
    } else {
        // Insert
        const { error } = await supabase.from("companies").insert({
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
    const supabase = await createClient() as any;
    // Get company ID (single-tenant assumption)
    const { data: company } = await supabase.from('companies').select('id').limit(1).single();
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
    const supabase = await createClient() as any;
    // Single-tenant MVP: allow deleting any job by id.
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard");
}
