export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            companies: {
                Row: {
                    id: string
                    created_at: string
                    owner_id: string
                    slug: string
                    name: string
                    description: string | null
                    logo_url: string | null
                    banner_url: string | null
                    brand_color: string | null
                    video_url: string | null
                    content_sections: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    owner_id: string
                    slug: string
                    name: string
                    description?: string | null
                    logo_url?: string | null
                    banner_url?: string | null
                    brand_color?: string | null
                    video_url?: string | null
                    content_sections?: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    owner_id?: string
                    slug?: string
                    name?: string
                    description?: string | null
                    logo_url?: string | null
                    banner_url?: string | null
                    brand_color?: string | null
                    video_url?: string | null
                    content_sections?: Json
                }
            }
            jobs: {
                Row: {
                    id: string
                    created_at: string
                    company_id: string
                    title: string
                    description: string
                    location: string
                    type: string
                    is_published: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    company_id: string
                    title: string
                    description: string
                    location: string
                    type: string
                    is_published?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    company_id?: string
                    title?: string
                    description?: string
                    location?: string
                    type?: string
                    is_published?: boolean
                }
            }
        }
    }
}
