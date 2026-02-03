"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicJobCard({ job, brandColor }: { job: any, brandColor: string }) {
    return (
        <Card className="hover:shadow-md transition-shadow group cursor-pointer border-l-4" style={{ borderLeftColor: brandColor || '#000' }}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {job.title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {job.type}
                    </span>
                </div>
                <p className="line-clamp-2 text-sm text-gray-600">{job.description}</p>
            </CardContent>
            <CardFooter>
                <span className="text-sm text-gray-500">{job.posted_days_ago || "Recently"}</span>
            </CardFooter>
        </Card>
    );
}
