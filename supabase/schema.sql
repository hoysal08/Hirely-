-- Create companies table
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users(id) not null,
  slug text unique not null,
  name text not null,
  description text,
  logo_url text,
  banner_url text,
  brand_color text default '#000000',
  content_sections jsonb default '[]'::jsonb,
  
  constraint owner_unique unique (owner_id) -- One company per recruiter/user
);

-- Create jobs table
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  title text not null,
  description text not null,
  location text not null,
  type text not null, -- 'Full-time', 'Contract', etc.
  is_published boolean default true
);

-- Enable RLS
alter table public.companies enable row level security;
alter table public.jobs enable row level security;

-- Policies for Companies
-- Everyone can read companies (public pages)
create policy "Companies are viewable by everyone"
  on public.companies for select
  using ( true );

-- Users can insert their own company
create policy "Users can create their own company"
  on public.companies for insert
  with check ( auth.uid() = owner_id );

-- Users can update their own company
create policy "Users can update their own company"
  on public.companies for update
  using ( auth.uid() = owner_id );

-- Policies for Jobs
-- Everyone can read published jobs
create policy "Jobs are viewable by everyone"
  on public.jobs for select
  using ( true );

-- Recruiters can manage jobs for their company
create policy "Recruiters can insert jobs for their company"
  on public.jobs for insert
  with check ( 
    exists (
      select 1 from public.companies
      where id = company_id
      and owner_id = auth.uid()
    ) 
  );

create policy "Recruiters can update jobs for their company"
  on public.jobs for update
  using (
    exists (
      select 1 from public.companies
      where id = company_id
      and owner_id = auth.uid()
    )
  );

create policy "Recruiters can delete jobs for their company"
  on public.jobs for delete
  using (
    exists (
      select 1 from public.companies
      where id = company_id
      and owner_id = auth.uid()
    )
  );
