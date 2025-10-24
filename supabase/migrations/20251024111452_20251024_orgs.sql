/*
  # Organizations and Members Schema

  1. New Tables
    - `orgs`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `country` (text, optional)
      - `size_bucket` (text, enum constraint: '<50', '50-250', '250-1000', '1000+')
      - `it_role` (text, optional)
      - `created_at` (timestamptz, default now)
      - `owner_user_id` (uuid, required)
    - `org_members`
      - `org_id` (uuid, foreign key to orgs)
      - `user_id` (uuid, required)
      - `role` (role_name enum: ADMIN, PROCESS_OWNER, RISK_OFFICER, VIEWER)
      - Primary key: (org_id, user_id)

  2. Security
    - Enable RLS on both tables
    - `orgs_read`: Users can read orgs they own or are members of
    - `orgs_write`: Only owners can modify their org
    - `members_read`: Users can read members of orgs they belong to
    - `members_write`: Only ADMIN role members can modify org membership
*/

create table if not exists orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  size_bucket text check (size_bucket in ('<50','50-250','250-1000','1000+')),
  it_role text,
  created_at timestamptz default now(),
  owner_user_id uuid not null
);

DO $$ BEGIN
  CREATE TYPE role_name AS ENUM ('ADMIN','PROCESS_OWNER','RISK_OFFICER','VIEWER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

create table if not exists org_members (
  org_id uuid references orgs(id) on delete cascade,
  user_id uuid not null,
  role role_name not null default 'ADMIN',
  primary key (org_id, user_id)
);

alter table orgs enable row level security;
alter table org_members enable row level security;

create policy "orgs_read" on orgs for select using (
  auth.uid() = owner_user_id or exists (select 1 from org_members m where m.org_id = orgs.id and m.user_id = auth.uid())
);

create policy "orgs_write" on orgs for all using (auth.uid() = owner_user_id);

create policy "members_read" on org_members for select using (
  auth.uid() = user_id or exists (select 1 from org_members m where m.org_id = org_members.org_id and m.user_id = auth.uid())
);

create policy "members_write" on org_members for all using (
  exists (select 1 from org_members m where m.org_id = org_members.org_id and m.user_id = auth.uid() and m.role = 'ADMIN')
);
