import { Badge } from "@/components/ui/badge";
import { PublicJobCard } from "./PublicJobCard";
import { JobBoard } from "./JobBoard";

export function SectionRenderer({
    section,
    jobs,
    brandColor
}: {
    section: any,
    jobs: any[],
    brandColor: string
}) {
    if (section.type === 'text') {
        return (
            <section className="container mx-auto px-4 py-12 max-w-4xl">
                <h2 className="text-2xl font-bold mb-6" style={{ color: brandColor }}>{section.title}</h2>
                <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
                    {section.content}
                </div>
            </section>
        );
    }

    if (section.type === 'image') {
        return (
            <section className="w-full py-12 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: brandColor }}>{section.title}</h2>
                    <img
                        src={section.content}
                        alt={section.title}
                        className="w-full h-auto rounded-xl shadow-lg object-cover max-h-[600px]"
                    />
                </div>
            </section>
        );
    }

    if (section.type === 'video') {
        // Simple video embed handling
        // Assuming user pastes a YouTube URL or direct link.
        // For simplicity, just use a basic iframe if it contains youtube/vimeo, or video tag otherwise.
        const isYoutube = section.content.includes('youtube.com') || section.content.includes('youtu.be');

        return (
            <section className="container mx-auto px-4 py-12 max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: brandColor }}>{section.title}</h2>
                <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
                    {isYoutube ? (
                        <iframe
                            src={section.content.replace('watch?v=', 'embed/')}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    ) : (
                        <video controls className="w-full h-full" src={section.content} />
                    )}
                </div>
            </section>
        );
    }

    if (section.type === 'jobs') {
        return (
            <section className="container mx-auto px-4 py-12 max-w-5xl" id="jobs">
                <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: brandColor }}>{section.title}</h2>
                <JobBoard jobs={jobs} brandColor={brandColor} />
            </section>
        );
    }

    return null;
}
