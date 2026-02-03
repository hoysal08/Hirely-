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

    // Get company for user
    const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!company) {
        throw new Error("Company not found. Please create a company profile first.");
    }

    // Read CSV file
    const csvPath = path.join(process.cwd(), "init-data.csv");
    const fileContent = fs.readFileSync(csvPath, "utf-8");

    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    const jobs = records.map((record: any) => ({
        company_id: company.id,
        title: record.title,
        location: record.location,
        type: `${record.employment_type} - ${record.work_policy}`,
        description: `
**Department:** ${record.department}
**Experience:** ${record.experience_level}
**Salary:** ${record.salary_range}
**Posted:** ${record.posted_days_ago}

Join us as a ${record.title} in our ${record.department} team! We are looking for talented individuals to help us grow.
        `.trim(),
        is_published: true,
    }));

    // Insert jobs in batches if needed, but for 150 rows it's fine
    const { error } = await supabase.from("jobs").insert(jobs);

    if (error) {
        console.error("Import Error:", error);
        throw new Error("Failed to import jobs: " + error.message);
    }

    revalidatePath("/dashboard");
    return { success: true, count: jobs.length };
}
