"use client";

import { updateCompany } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { useState } from "react";
import { SectionBuilder } from "./SectionBuilder";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
        </Button>
    );
}

export function CompanyForm({ company }: { company: any }) {
    
    const initialSections = company?.content_sections || [
        { id: "1", type: "text", title: "About Us", content: company?.description || "", order: 0 },
        { id: "system_jobs", type: "jobs", title: "Open Roles", content: "", order: 1 }
    ];

    const [sections, setSections] = useState<any[]>(initialSections);

    const handlePreview = () => {
        // Save current form state to localStorage
        const previewData = {
            company: {
                name: (document.getElementById('name') as HTMLInputElement)?.value,
                slug: (document.getElementById('slug') as HTMLInputElement)?.value,
                brand_color: (document.getElementById('brand_color') as HTMLInputElement)?.value,
                logo_url: (document.getElementById('logo_url') as HTMLInputElement)?.value,
                banner_url: (document.getElementById('banner_url') as HTMLInputElement)?.value,
            },
            sections: sections
        };
        localStorage.setItem("company_preview_data", JSON.stringify(previewData));
        window.open(`/preview`, '_blank');
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>Company Details</CardTitle>
                    <CardDescription>
                        Customize how your company appears to candidates.
                    </CardDescription>
                </div>
                <Button variant="outline" type="button" onClick={handlePreview}>
                    Preview Changes ↗
                </Button>
            </CardHeader>
            <CardContent>
                <form action={async (formData) => {
                    formData.set("content_sections", JSON.stringify(sections));
                    await updateCompany(formData);
                }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={company?.name}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={company?.slug}
                                placeholder="e.g. acme-corp"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <SectionBuilder value={sections} onChange={setSections} />
                        <input type="hidden" name="content_sections" value={JSON.stringify(sections)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand_color">Brand Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="brand_color"
                                    name="brand_color"
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    defaultValue={company?.brand_color || "#000000"}
                                />
                                <Input
                                    type="text"
                                    defaultValue={company?.brand_color || "#000000"}
                                    readOnly
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo_url">Logo URL</Label>
                            <Input
                                id="logo_url"
                                name="logo_url"
                                defaultValue={company?.logo_url}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="banner_url">Banner Image URL</Label>
                        <Input
                            id="banner_url"
                            name="banner_url"
                            defaultValue={company?.banner_url}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
