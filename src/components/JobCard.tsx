"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteJob } from "@/app/dashboard/actions";

export function JobCard({ job }: { job: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3 text-sm">{job.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="destructive" size="sm" onClick={() => deleteJob(job.id)}>Delete</Button>
            </CardFooter>
        </Card>
    );
}
