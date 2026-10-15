-- ==============================================================================
-- SAIL-06 Cinematic Portfolio — Supabase Schema & Row Level Security (RLS)
-- Production Database Migration Script
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Site Sections Table (Key-Value structured storage for Hero, About, Engineering, Founder, Contact)
-- ------------------------------------------------------------------------------
create table if not exists public.site_sections (
    id text primary key,
    section_name text not null unique,
    content jsonb not null default '{}'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_sections enable row level security;

-- Public can view site sections
create policy "Allow public read access on site_sections"
    on public.site_sections for select
    to anon, authenticated
    using (true);

-- Only authenticated owner/service role can mutate site sections
create policy "Allow owner full access on site_sections"
    on public.site_sections for all
    to authenticated
    using (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role')
    with check (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role');


-- ------------------------------------------------------------------------------
-- 2. Projects Table
-- ------------------------------------------------------------------------------
create table if not exists public.projects (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    category text not null,
    description text not null,
    detailed_desc text,
    tech text[] default array[]::text[],
    highlight text,
    image_url text,
    image_alt text,
    link text,
    sort_order integer default 0,
    status text not null default 'draft' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_projects_status_order on public.projects (status, sort_order);

-- Enable RLS
alter table public.projects enable row level security;

-- Public can ONLY view published projects
create policy "Allow public read on published projects"
    on public.projects for select
    to anon, authenticated
    using (status = 'published');

-- Owner can perform all operations (view drafts, insert, update, delete)
create policy "Allow owner full access on projects"
    on public.projects for all
    to authenticated
    using (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role')
    with check (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role');


-- ------------------------------------------------------------------------------
-- 3. Blog Posts Table
-- ------------------------------------------------------------------------------
create table if not exists public.blog_posts (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text not null unique,
    excerpt text not null,
    content text not null,
    category text not null,
    read_time text default '5 min read',
    published_date text not null,
    thumbnail_url text,
    status text not null default 'draft' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_blog_status_slug on public.blog_posts (status, slug);

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Public can ONLY view published posts
create policy "Allow public read on published blog posts"
    on public.blog_posts for select
    to anon, authenticated
    using (status = 'published');

-- Owner can view drafts and perform all mutations
create policy "Allow owner full access on blog posts"
    on public.blog_posts for all
    to authenticated
    using (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role')
    with check (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role');


-- ------------------------------------------------------------------------------
-- 4. Travel Stories Table
-- ------------------------------------------------------------------------------
create table if not exists public.travel_stories (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    location text not null,
    travel_date text not null,
    image_url text not null,
    note text,
    caption text,
    alt_text text,
    sort_order integer default 0,
    status text not null default 'draft' check (status in ('draft', 'published')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_travel_status_order on public.travel_stories (status, sort_order);

-- Enable RLS
alter table public.travel_stories enable row level security;

-- Public can ONLY view published travel stories
create policy "Allow public read on published travel stories"
    on public.travel_stories for select
    to anon, authenticated
    using (status = 'published');

-- Owner can manage all travel stories
create policy "Allow owner full access on travel stories"
    on public.travel_stories for all
    to authenticated
    using (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role')
    with check (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role');


-- ------------------------------------------------------------------------------
-- 5. Travel Followers / Newsletter Table
-- ------------------------------------------------------------------------------
create table if not exists public.travel_followers (
    id uuid default uuid_generate_v4() primary key,
    email text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.travel_followers enable row level security;

-- Public can insert their email to follow
create policy "Allow public insert to travel_followers"
    on public.travel_followers for insert
    to anon, authenticated
    with check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Only owner can view follower list
create policy "Allow owner read on travel_followers"
    on public.travel_followers for select
    to authenticated
    using (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role');


-- ------------------------------------------------------------------------------
-- 6. Storage Bucket for Portfolio Assets
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- Public can download and view portfolio images
create policy "Public Access to portfolio-assets"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'portfolio-assets');

-- Only authenticated owner can upload or delete images
create policy "Owner Upload Access to portfolio-assets"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role'));

create policy "Owner Delete Access to portfolio-assets"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'role' = 'owner' or auth.role() = 'service_role'));
