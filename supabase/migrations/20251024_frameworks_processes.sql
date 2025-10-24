-- frameworks + org link
create table if not exists frameworks (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null
);

create table if not exists org_frameworks (
  org_id uuid references orgs(id) on delete cascade,
  framework_id uuid references frameworks(id) on delete cascade,
  primary key (org_id, framework_id)
);

-- processes (for canvas)
create table if not exists processes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  key text not null,   -- e.g., BAI09, DSS01
  name text not null,
  value_stream text check (value_stream in ('Strategy2Portfolio','Requirement2Deploy','Request2Fulfill','Detect2Correct')),
  x int default 0,
  y int default 0
);

-- relationships (edges)
create table if not exists relationships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  from_process uuid references processes(id) on delete cascade,
  to_process uuid references processes(id) on delete cascade,
  label text
);

-- RLS
alter table frameworks enable row level security;
alter table org_frameworks enable row level security;
alter table processes enable row level security;
alter table relationships enable row level security;

-- policies (read/write if member of org)
create policy "frameworks_read" on frameworks for select using (true); -- public catalogue
create policy "org_frameworks_read" on org_frameworks for select using (exists (select 1 from org_members m where m.org_id = org_frameworks.org_id and m.user_id = auth.uid()));
create policy "org_frameworks_write" on org_frameworks for all using (exists (select 1 from org_members m where m.org_id = org_frameworks.org_id and m.user_id = auth.uid()));
create policy "processes_read" on processes for select using (exists (select 1 from org_members m where m.org_id = processes.org_id and m.user_id = auth.uid()));
create policy "processes_write" on processes for all using (exists (select 1 from org_members m where m.org_id = processes.org_id and m.user_id = auth.uid()));
create policy "relationships_read" on relationships for select using (exists (select 1 from org_members m where m.org_id = relationships.org_id and m.user_id = auth.uid()));
create policy "relationships_write" on relationships for all using (exists (select 1 from org_members m where m.org_id = relationships.org_id and m.user_id = auth.uid()));

-- seed frameworks
insert into frameworks (code,label) values
('COBIT','COBIT 2019'),('IT4IT','IT4IT Reference Architecture'),
('DORA','DORA'),('NIST','NIST CSF'),('ISO27001','ISO/IEC 27001'),('AI_ACT','EU AI Act')
on conflict (code) do nothing;
