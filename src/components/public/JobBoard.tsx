"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PublicJobCard } from "./PublicJobCard";
import { Search } from "lucide-react";

export function JobBoard({ jobs, brandColor }: { jobs: any[]; brandColor: string }) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterLocation, setFilterLocation] = useState("All");

    const locations = ["All", ...Array.from(new Set(jobs.map((j) => j.location)))];
    const types = ["All", ...Array.from(new Set(jobs.map((j) => j.type)))];

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
            const matchesType = filterType === "All" || job.type === filterType;
            const matchesLocation = filterLocation === "All" || job.location === filterLocation;
            return matchesSearch && matchesType && matchesLocation;
        });
    }, [jobs, search, filterType, filterLocation]);

    return (
        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for roles..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                    >
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        {types.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Open Roles ({filteredJobs.length})</h3>
                <div className="grid gap-4">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <PublicJobCard key={job.id} job={job} brandColor={brandColor} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No jobs found matching your criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
