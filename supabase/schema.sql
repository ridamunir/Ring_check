-- Admin Panel — Supabase schema (Postgres)
-- Run in Supabase SQL Editor. Run schema.sql first, then seed.sql.
-- One Supabase project per tool site. Vercel hosts only the site.
-- v4: multilingual — languages table + pages.translation_group_id.

create extension if not exists pgcrypto;

-- ============ pages ============
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  type text not null default 'tool' check (type in ('tool','foundational','hub','pillar','subpage','blog')),
  parent_id uuid references pages(id) on delete cascade,
  title text,
  language_code text default 'en-GB',
  translation_group_id uuid,
  meta_title text,
  meta_description text,
  canonical_url text,
  featured_image text,
  status text default 'draft' check (status in ('published','draft','unpublished')),
  publish_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ sections ============
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  title text not null,
  sort_order int default 0
);

-- ============ variables ============
create table if not exists variables (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete cascade,
  name text not null,
  value_html text default '',
  sort_order int default 0
);

-- ============ indexes ============
create index if not exists idx_pages_slug on pages(slug);
-- Slug is unique per language (the same slug may exist in English and in
-- Spanish, but never twice in one language — public routes cannot tell
-- two same-language pages with one slug apart).
create unique index if not exists idx_pages_slug_language on pages(slug, language_code);
create index if not exists idx_pages_type on pages(type);
create index if not exists idx_pages_parent_id on pages(parent_id);
create index if not exists idx_pages_translation_group on pages(translation_group_id);
create index if not exists idx_sections_page_id on sections(page_id);
create index if not exists idx_variables_section_id on variables(section_id);

-- ============ updated_at trigger ============
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pages_updated_at on pages;
create trigger trg_pages_updated_at
  before update on pages
  for each row execute function set_updated_at();

-- ============ Row Level Security ============
-- Simplicity: permissive policies so the panel works out of the
-- box. The admin panel itself is protected by login (Supabase Auth email +
-- password, enforced in middleware and in every admin route), and public
-- pages only read published content.
-- NOTE: Nomi should restrict these policies in production if he wants
-- tighter control (e.g. only the service-role key may write).
alter table pages enable row level security;
alter table sections enable row level security;
alter table variables enable row level security;

drop policy if exists "allow all" on pages;
create policy "allow all" on pages for all using (true) with check (true);

drop policy if exists "allow all" on sections;
create policy "allow all" on sections for all using (true) with check (true);

drop policy if exists "allow all" on variables;
create policy "allow all" on variables for all using (true) with check (true);

-- ============ languages (multilingual) ============
-- One row per language. English is the default (no URL prefix); every
-- other enabled language is served under its short code (/es, /fr, ...).
-- Pages link their language versions with pages.translation_group_id.
create table if not exists languages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  full_code text not null,
  name text not null,
  og_locale text,
  is_default boolean not null default false,
  enabled boolean not null default false,
  is_custom boolean not null default false,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table languages enable row level security;
drop policy if exists "allow all" on languages;
create policy "allow all" on languages for all using (true) with check (true);

-- ============ MIGRATION for existing installs (v3 -> v4) ============
-- Fresh installs already have everything above. If your project was
-- created with the older schema, run these lines once instead:
--   alter table pages add column if not exists translation_group_id uuid;
--   create index if not exists idx_pages_translation_group on pages(translation_group_id);
--   -- (plus the languages table block above)
--   update pages set translation_group_id = id where translation_group_id is null;
-- Then re-run seed.sql to add the predefined languages + Spanish demo pages.

-- ============ Storage (optional, for featured-image upload) ============
-- Create a public bucket named "images" in Supabase Dashboard > Storage
-- if you want the admin featured-image upload to work. If the bucket does
-- not exist, the URL field in the editor still works and saving is not blocked.

-- ============ admin_users (login users / roles) ============
-- One profile row per Supabase Auth user. The login itself lives in
-- Supabase Auth (auth.users) — this table only stores the display name
-- and the panel role ('admin' or 'editor').
--
-- FIRST ADMIN — 3 ways (details in DEPLOY.md, "How to create the first admin"):
--   1. Supabase Dashboard > Authentication > Users > Add user (tick
--      "Auto Confirm User"), then insert the matching admin_users row:
--        insert into admin_users (id, name, role)
--        values ('<auth-user-uuid>', 'Your Name', 'admin');
--   2. Bootstrap: set ADMIN_PASSWORD in Vercel, login with any email +
--      ADMIN_PASSWORD (works ONLY while admin_users is empty), create
--      the first admin in the panel under Users, then REMOVE
--      ADMIN_PASSWORD from Vercel and redeploy.
--   3. Create the user from the panel (Users > Add New User) once any
--      Admin is logged in.
-- Before creating users, enable the Email provider in Supabase Dashboard
-- > Authentication > Providers > Email (enable it; "Confirm email" can
-- stay OFF — the panel creates users with email_confirm: true, so they
-- can log in immediately).
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_admin_users_updated_at on admin_users;
create trigger trg_admin_users_updated_at
  before update on admin_users
  for each row execute function set_updated_at();

-- Row Level Security: defence-in-depth only. The app always talks to
-- admin_users with the service_role key server-side (lib/session.js), so
-- RLS never blocks the panel. These policies only limit what a logged-in
-- end user could do with the anon key directly.
alter table admin_users enable row level security;

drop policy if exists "admins can read admin_users" on admin_users;
create policy "admins can read admin_users" on admin_users
  for select to authenticated
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'admin'));

drop policy if exists "users can read own profile" on admin_users;
create policy "users can read own profile" on admin_users
  for select to authenticated
  using (id = auth.uid());


-- ============ MyRingCheck tool tables ============
-- Numbers, reports, votes, searches and contact messages.
-- Votes and searches are NEVER seeded: a counter only exists after a real user action.
-- Display rule (Nomi, 21 Nov 2026): SEARCH COUNTS ARE HIDDEN from all public display.
-- Counting still runs (every search is saved in `searches`) and the 5+ searches
-- index rule still applies. Display is off until Nomi says to turn it back on.
-- VOTES: where a vote count is 0, show NO number — show an honest label instead
-- ("No votes yet — be the first to vote"). A vote counter appears only after the
-- first real vote. No estimated counts, ever.

create table if not exists numbers (
  number text primary key,
  top_category text,
  source text default 'community',
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  number text not null references numbers(number) on delete cascade,
  body text not null,
  category text not null default 'scam',
  asked_otp boolean not null default false,
  asked_bank_details boolean not null default false,
  used_threat boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  number text not null references numbers(number) on delete cascade,
  vote text not null check (vote in ('safe','unsafe')),
  voter_key text,
  created_at timestamptz default now()
);

create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  number text not null references numbers(number) on delete cascade,
  searched_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  topic text,
  number text,
  body text not null,
  status text not null default 'new' check (status in ('new','done')),
  created_at timestamptz default now()
);

create index if not exists idx_reports_number on reports(number);
create index if not exists idx_reports_status on reports(status);
create index if not exists idx_votes_number on votes(number);
create index if not exists idx_searches_number on searches(number);
create index if not exists idx_searches_at on searches(searched_at);

alter table numbers enable row level security;
alter table reports enable row level security;
alter table votes enable row level security;
alter table searches enable row level security;
alter table messages enable row level security;

drop policy if exists "allow all" on numbers;
create policy "allow all" on numbers for all using (true) with check (true);
drop policy if exists "allow all" on reports;
create policy "allow all" on reports for all using (true) with check (true);
drop policy if exists "allow all" on votes;
create policy "allow all" on votes for all using (true) with check (true);
drop policy if exists "allow all" on searches;
create policy "allow all" on searches for all using (true) with check (true);
drop policy if exists "allow all" on messages;
create policy "allow all" on messages for all using (true) with check (true);

-- Nomi's decision 21 Nov 2026: the 20 seeded research-based numbers are indexable
-- from launch day. `seeded` marks them; isIndexable() in lib/tool-data.js checks it.
alter table numbers add column if not exists seeded boolean not null default false;
