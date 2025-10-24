-- frameworks (extend existing table with code and label columns)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frameworks' AND column_name = 'code') THEN
    ALTER TABLE frameworks ADD COLUMN code text UNIQUE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frameworks' AND column_name = 'label') THEN
    ALTER TABLE frameworks ADD COLUMN label text;
  END IF;
END $$;

create table if not exists org_frameworks (
  org_id uuid references orgs(id) on delete cascade,
  framework_id uuid references frameworks(id) on delete cascade,
  primary key (org_id, framework_id)
);

-- canvas_processes (for visual canvas)
create table if not exists canvas_processes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  key text not null,   -- e.g., BAI09, DSS01
  name text not null,
  value_stream text check (value_stream in ('Strategy2Portfolio','Requirement2Deploy','Request2Fulfill','Detect2Correct')),
  x int default 0,
  y int default 0
);

-- relationships (edges)
create table if not exists process_relationships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  from_process uuid references canvas_processes(id) on delete cascade,
  to_process uuid references canvas_processes(id) on delete cascade,
  label text
);

-- RLS
alter table org_frameworks enable row level security;
alter table canvas_processes enable row level security;
alter table process_relationships enable row level security;

-- policies (read/write if member of org)
create policy "org_frameworks_read" on org_frameworks for select using (exists (select 1 from org_members m where m.org_id = org_frameworks.org_id and m.user_id = auth.uid()));
create policy "org_frameworks_write" on org_frameworks for all using (exists (select 1 from org_members m where m.org_id = org_frameworks.org_id and m.user_id = auth.uid()));
create policy "canvas_processes_read" on canvas_processes for select using (exists (select 1 from org_members m where m.org_id = canvas_processes.org_id and m.user_id = auth.uid()));
create policy "canvas_processes_write" on canvas_processes for all using (exists (select 1 from org_members m where m.org_id = canvas_processes.org_id and m.user_id = auth.uid()));
create policy "process_relationships_read" on process_relationships for select using (exists (select 1 from org_members m where m.org_id = process_relationships.org_id and m.user_id = auth.uid()));
create policy "process_relationships_write" on process_relationships for all using (exists (select 1 from org_members m where m.org_id = process_relationships.org_id and m.user_id = auth.uid()));

-- seed frameworks
insert into frameworks (code,label) values
('COBIT','COBIT 2019'),('IT4IT','IT4IT Reference Architecture'),
('DORA','DORA'),('NIST','NIST CSF'),('ISO27001','ISO/IEC 27001'),('AI_ACT','EU AI Act')
on conflict (code) do nothing;
