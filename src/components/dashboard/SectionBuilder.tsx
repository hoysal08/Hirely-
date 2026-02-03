"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, X, Plus } from "lucide-react";

type Section = {
    id: string;
    type: "text" | "video" | "image" | "jobs";
    title: string;
    content: string;
    order: number;
};

function SortableItem({ section, onDelete, onChange }: { section: Section; onDelete: (id: string) => void; onChange: (id: string, field: string, value: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-4 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 p-2 border-b bg-gray-50 rounded-t-lg">
                <button {...attributes} {...listeners} className="cursor-grab hover:text-gray-700 text-gray-400">
                    <GripVertical className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium uppercase text-gray-500 bg-gray-200 px-2 py-0.5 rounded text-xs">
                    {section.type}
                </span>
                <div className="flex-1">
                    <Input
                        value={section.title}
                        onChange={(e) => onChange(section.id, 'title', e.target.value)}
                        className="h-7 text-sm font-semibold bg-transparent border-none shadow-none focus-visible:ring-0 px-2"
                        placeholder="Section Title"
                    />
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDelete(section.id)} className="h-7 w-7 p-0 text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                </Button>
            </div>
            <div className="p-4">
                {section.type === 'text' && (
                    <Textarea
                        value={section.content}
                        onChange={(e) => onChange(section.id, 'content', e.target.value)}
                        placeholder="Enter text content..."
                        className="min-h-[100px]"
                    />
                )}
                {(section.type === 'video' || section.type === 'image') && (
                    <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">URL</Label>
                        <Input
                            value={section.content}
                            onChange={(e) => onChange(section.id, 'content', e.target.value)}
                            placeholder={section.type === 'video' ? "https://youtube.com/..." : "https://image.url/..."}
                        />
                    </div>
                )}
                {section.type === 'jobs' && (
                    <div className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded border border-dashed text-center">
                        This section will display the list of open positions.
                    </div>
                )}
            </div>
        </div>
    );
}

export function SectionBuilder({ value, onChange }: { value: any[]; onChange: (sections: any[]) => void }) {
    const [sections, setSections] = useState<Section[]>(
        Array.isArray(value) ? value : []
    );

    useEffect(() => {
        // Keep internal state in sync if parent updates, but prevent loops ideally
        if (JSON.stringify(value) !== JSON.stringify(sections)) {
            setSections(Array.isArray(value) ? value : []);
        }
    }, [value]); // careful with dependency loops

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                onChange(newItems); // Notify parent
                return newItems;
            });
        }
    };

    const addSection = (type: "text" | "video" | "image" | "jobs") => {
        const newSection: Section = {
            id: crypto.randomUUID(),
            type,
            title: type === 'jobs' ? "Open Roles" : type.charAt(0).toUpperCase() + type.slice(1),
            content: "",
            order: sections.length
        };
        const newItems = [...sections, newSection];
        setSections(newItems);
        onChange(newItems);
    };

    const updateSection = (id: string, field: string, newValue: string) => {
        const newItems = sections.map(s => s.id === id ? { ...s, [field]: newValue } : s);
        setSections(newItems);
        onChange(newItems);
    }

    const deleteSection = (id: string) => {
        const newItems = sections.filter(s => s.id !== id);
        setSections(newItems);
        onChange(newItems);
    }

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Page Sections</label>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sections.map((section) => (
                        <SortableItem key={section.id} section={section} onDelete={deleteSection} onChange={updateSection} />
                    ))}
                </SortableContext>
            </DndContext>

            <div className="flex gap-2 flex-wrap">
                <Button type="button" variant="outline" size="sm" onClick={() => addSection('text')}><Plus className="w-4 h-4 mr-1" /> Text</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection('image')}><Plus className="w-4 h-4 mr-1" /> Image</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection('video')}><Plus className="w-4 h-4 mr-1" /> Video</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection('jobs')} disabled={sections.some(s => s.type === 'jobs')}><Plus className="w-4 h-4 mr-1" /> Job List</Button>
            </div>
        </div>
    );
}
