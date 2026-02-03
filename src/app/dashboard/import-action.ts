"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function importSampleData() {
    const supabase = await createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Get company
    const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!company) {
        throw new Error("Company not found");
    }

    // Read CSV from public directory (works in both dev and production)
    const csvPath = path.join(process.cwd(), "public", "init-data.csv");

    let csvContent: string;
    try {
        csvContent = fs.readFileSync(csvPath, "utf-8");
    } catch (error) {
        console.error("Failed to read CSV file:", error);
        throw new Error("CSV file not found. Please ensure init-data.csv is in the public directory.");
    }

    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
    });

    // Insert jobs
    const jobsToInsert = records.map((record: any) => ({
        company_id: company.id,
        title: record.title,
        location: record.location,
        type: record.type,
        description: record.description,
        is_published: true,
    }));

    // Insert jobs in batches if needed, but for 150 rows it's fine
    const { error } = await supabase.from("jobs").insert(jobsToInsert);

    if (error) {
        console.error("Import Error:", error);
        throw new Error("Failed to import jobs: " + error.message);
    }

    revalidatePath("/dashboard");
    return { success: true, count: jobsToInsert.length };
}
