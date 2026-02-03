import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyForm } from "@/components/dashboard/CompanyForm";
import { JobList } from "@/components/dashboard/JobList";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient() as any;
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    const { data: jobs } = company
        ? await supabase
            .from("jobs")
            .select("*")
            .eq("company_id", company.id)
            .order("created_at", { ascending: false })
        : { data: [] };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
                <form action="/auth/signout" method="post">
                    {/* We can add a signout action later, or just a basic button for now */}
                    <Button variant="outline" asChild>
                        <Link href="/api/auth/signout">Sign Out</Link>
                    </Button>
                </form>
            </div>

            {!company && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
                    <h3 className="font-semibold text-yellow-800">Welcome!</h3>
                    <p className="text-yellow-700">Please set up your company profile to get started.</p>
                </div>
            )}

            <Tabs defaultValue="company" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="company">Company Profile</TabsTrigger>
                    <TabsTrigger value="jobs" disabled={!company}>Jobs</TabsTrigger>
                </TabsList>
                <TabsContent value="company">
                    <CompanyForm company={company} />
                </TabsContent>
                <TabsContent value="jobs">
                    <JobList jobs={jobs || []} />
                </TabsContent>
            </Tabs>

            {company && (
                <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-medium mb-2">Your Public Page</h3>
                    <div className="flex items-center gap-4">
                        <a href={`/${company.slug}/careers`} target="_blank" className="text-blue-600 hover:underline">
                            View Live Page ↗
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
