# Tech Spec: Careers Page Builder

## Goal Requirements
Build a platform where:
1.  **Recruiters** can create and customize a branded careers page.
2.  **Candidates** can view the page and browse/search jobs.

## Tech Stack
-   **Frontend/Backend Framework:** Next.js 14 (App Router)
-   **Styling:** Tailwind CSS + Shadcn UI (for clean, accessible components)
-   **Database & Auth:** Supabase (PostgreSQL, Auth)
-   **Hosting:** Vercel

## Architecture
### Database Schema (Supabase)

**Table: `companies`**
-   `id` (uuid, PK)
-   `name` (text)
-   `slug` (text, unique) - for URL routing
-   `logo_url` (text)
-   `banner_url` (text)
-   `brand_color` (text) - hex code
-   `description` (text) - "About Us" content
-   `video_url` (text) - "Life at Company" video
-   `created_at` (timestamptz)
-   `owner_id` (uuid) - links to auth.users

**Table: `jobs`**
-   `id` (uuid, PK)
-   `company_id` (uuid, FK -> companies.id)
-   `title` (text)
-   `location` (text)
-   `type` (text) - e.g., Full-time, Remote
-   `description` (text)
-   `created_at` (timestamptz)
-   `is_published` (boolean)

### Component Hierarchy
-   `app/page.tsx`: Redirects to `/login`.
-   `app/login/page.tsx`: Login/Signup for recruiters.
-   `app/dashboard/page.tsx`: Recruiter dashboard (Edit Company Info, Manage Jobs).
-   `app/[slug]/careers/page.tsx`: Public Careers Page (Company Branding).
-   `components/dashboard/CompanyForm.tsx`: Form to edit company details.
-   `components/dashboard/JobList.tsx`: List and Create functionality for jobs.
-   `components/public/JobBoard.tsx`: Client-side search and filtering for public page.
-   `components/public/PublicJobCard.tsx`: Display card for public job listings.

### Security (RLS)
-   **Companies:** Public read access. Insert/Update restricted to `owner_id`.
-   **Jobs:** Public read access (if published). Insert/Update/Delete restricted to company owner.

## Assumptions
-   One recruiter manages one company (1:1 mapping).
-   Images are handled via external URLs for simplicity in this MVP.
-   Supabase Auth handles session management via cookies.

## Test Plan
-   **Build Verification:** `npm run build` should pass without errors.
-   **Responsive Check:** Manually verify layouts on Mobile (375px) and Desktop (1280px).
-   **Flow Verification:**
    1.  Register new user.
    2.  Set up company profile (Slug: `acme`).
    3.  Post 2 jobs (1 Remote, 1 NY).
    4.  Visit `/acme/careers` incognito.
    5.  Verify branding allows filter by location.
