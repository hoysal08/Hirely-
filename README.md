# Careers Page Builder

A Full Stack application that allows recruiters to build branded careers pages and candidates to browse open roles.

## Features
-   **Recruiter Dashboard:** Manage company details (branding, content) and post/manage jobs.
-   **Public Careers Page:** Dynamic, SEO-ready pages for each company (`/[slug]/careers`).
-   **Job Search:** Candidates can filter jobs by location and type.
-   **Mobile Friendly:** Fully responsive design.

## Tech Stack
-   **Framework:** Next.js 14
-   **Styling:** Tailwind CSS, Shadcn UI
-   **Database:** Supabase (PostgreSQL)
-   **Auth:** Supabase Auth

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd white-carrot-assignment
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # Note: Requires Node.js 18+ (tested on v18.17.1)
    ```

3.  **Configure Environment:**
    -   Create `.env.local` in the root directory.
    -   Add your Supabase credentials:
        ```env
        NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        NEXT_PUBLIC_BASE_URL=http://localhost:3000
        ```

4.  **Database Setup:**
    -   Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor.
    -   Ensure Email Auth is enabled in Supabase.

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Usage Guide
1.  **Recruiter:**
    -   Sign up at `/login`.
    -   Go to the **Company Profile** tab to set your company name, slug (e.g., `my-company`), and branding.
    -   Go to the **Jobs** tab to post new openings.
2.  **Candidate:**
    -   Visit `http://localhost:3000/my-company/careers` to see the public page.

## Testing
-   Run `npm run build` to verify production build.
-   The app is designed to be mobile-first using Tailwind's responsive utilities.
