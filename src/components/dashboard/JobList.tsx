"use client";

import { createJob } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JobCard } from "@/components/JobCard";
import { useState } from "react";

export function JobList({ jobs }: { jobs: any[] }) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Open Positions ({jobs.length})</h2>
                <div className="flex gap-2">
                    <form action={async () => {
                        const { importSampleData } = await import("@/app/dashboard/import-action");
                        await importSampleData();
                    }}>
                        <Button variant="outline" type="submit">
                            Import Sample Data
                        </Button>
                    </form>
                    <Button onClick={() => setIsCreating(!isCreating)}>
                        {isCreating ? "Cancel" : "Post New Job"}
                    </Button>
                </div>
            </div>

            {isCreating && (
                <Card className="border-dashed border-2">
                    <CardHeader>
                        <CardTitle>Create New Job</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={async (formData) => {
                            await createJob(formData);
                            setIsCreating(false);
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input id="title" name="title" required placeholder="e.g. Senior Engineer" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        name="type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option>Full-time</option>
                                        <option>Contract</option>
                                        <option>Remote</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" required placeholder="e.g. New York / Remote" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={3}
                                />
                            </div>
                            <Button type="submit">Publish Job</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 bg-muted/20 p-4 rounded-xl">
                {jobs.length === 0 && !isCreating && (
                    <p className="text-center text-muted-foreground py-8">No jobs posted yet.</p>
                )}
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
