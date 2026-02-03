"use client";

import { useEffect, useState } from "react";
import { SectionRenderer } from "@/components/public/SectionRenderer";
import Image from "next/image";

export default function PreviewPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("company_preview_data");
        if (stored) {
            setData(JSON.parse(stored));
        }
    }, []);

    if (!data) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-500">
                Loading preview... (Or no data found)
            </div>
        );
    }

    const { company, sections } = data;
    const brandColor = company.brand_color || "#000000";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
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
                {/* Logo Overlay */}
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

                {/* Dynamic Sections */}
                <div className="space-y-4">
                    {sections.map((section: any) => (
                        <SectionRenderer
                            key={section.id}
                            section={section}
                            jobs={[]} // Empty jobs for preview or mock? User says "draft that is not saved yet"
                            brandColor={brandColor}
                        />
                    ))}
                </div>
                <div className="container mx-auto px-4 text-center mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                    This is a preview. Jobs are not loaded here.
                </div>
            </div>
        </div>
    );
}