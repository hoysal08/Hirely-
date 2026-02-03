import { createClient } from "@/lib/supabase/client";
// Note: Using client wrapper for convenience or better createClient() directly
// Actually for server component fetching I should use a simple fetch or the server helper if auth is needed. 
// Since this is public data, standard supabase-js via createClient (for public usage) or just re-using the server helper (but as admin/anon) is fine.
// I will use @supabase/ssr createServerClient but with NO cookies for public access, 
// OR simpler: just use the project URL/Key directly since RLS allows public select.

import { createClient as createSupabaseClient } from '@/lib/supabase/client'; // This is browser client... wait.
import { notFound } from "next/navigation";
import Image from "next/image";
import { JobBoard } from "@/components/public/JobBoard";
import { Metadata } from 'next';
import { SectionRenderer } from "@/components/public/SectionRenderer";

// I need to make sure I can fetch data on the server without cookies for public pages.
// I'll create a simple utility here or just inline it.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
import { createClient as createClientPrimitive } from '@supabase/supabase-js';


const supabase = createClientPrimitive(supabaseUrl, supabaseKey) as any;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { data: company } = await supabase
        .from("companies")
        .select("name, description")
        .eq("slug", params.slug)
        .single();

    if (!company) return { title: 'Not Found' };

    return {
        title: `${company.name} Careers`,
        description: company.description,
    }
}

export default async function PublicCareersPage({ params }: { params: { slug: string } }) {
    const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", params.slug)
        .single();

    if (!company) {
        notFound();
    }

    const { data: jobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    // Use brand color or default
    const brandColor = company.brand_color || "#000000";

    // Default sections if none exist (backward compatibility)
    const sections = company.content_sections && company.content_sections.length > 0
        ? company.content_sections
        : [
            { id: "1", type: "text", title: "About Us", content: company.description || "We are hiring! Join our team.", order: 0 },
            { id: "jobs", type: "jobs", title: "Open Roles", content: "", order: 1 }
        ];



    return (
        <div className="min-h-screen bg-gray-50">

            <div
                className="h-48 md:h-64 bg-gray-900 w-full relative overflow-hidden"
                style={{ backgroundColor: brandColor }}
            >
                {company.banner_url && (
                    <Image
                        src={company.banner_url}
                        alt={`${company.name} Banner`}
                        fill
                        className="object-cover opacity-50"
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white shadow-sm">{company.name}</h1>
                </div>
            </div>

            <div className="py-8 -mt-10 relative z-10">

                {company.logo_url && (
                    <div className="container mx-auto px-4 mb-12">
                        <div className="w-32 h-32 relative rounded-xl overflow-hidden border-4 border-white shadow-md bg-white mx-auto md:mx-0">
                            <Image
                                src={company.logo_url}
                                alt={`${company.name} Logo`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}


                <div className="space-y-4">
                    {sections.map((section: any) => (
                        <SectionRenderer
                            key={section.id}
                            section={section}
                            jobs={jobs || []}
                            brandColor={brandColor}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center text-gray-400 text-sm">
                    <p>Powered by Whitecarrot Careers</p>
                </div>
            </div>
        </div>
    );
}
