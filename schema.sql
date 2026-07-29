-- VoltKeep database schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query) after creating your project.

-- Businesses: one row per paying account (the owner's business)
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) not null,
  name text not null,
  plan text not null default 'trial', -- 'trial' | 'solo' | 'team' | 'multi_location'
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Team members: people credentials can be assigned to (doesn't have to be a login user)
create table team_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  email text,
  created_at timestamptz default now()
);

-- Credentials: the core object — a license, cert, insurance policy, or bond
create table credentials (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  type text not null default 'License', -- 'License' | 'Certification' | 'Insurance policy' | 'Surety bond' | 'Other'
  assigned_to uuid references team_members(id),
  expiry_date date not null,
  document_url text, -- Supabase Storage path, if a document was uploaded
  last_renewed_at timestamptz,
  status text not null default 'active', -- 'active' | 'renewed' | 'lapsed'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reminder log: tracks which reminders have already been sent, so we don't double-send
create table reminder_log (
  id uuid primary key default gen_random_uuid(),
  credential_id uuid references credentials(id) on delete cascade not null,
  days_before int not null, -- 90 | 60 | 30 | 7
  sent_at timestamptz default now(),
  unique(credential_id, days_before)
);

-- Indexes for the daily reminder job and dashboard queries
create index idx_credentials_business on credentials(business_id);
create index idx_credentials_expiry on credentials(expiry_date);
create index idx_team_members_business on team_members(business_id);

-- Row Level Security: every business can only ever see its own data
alter table businesses enable row level security;
alter table team_members enable row level security;
alter table credentials enable row level security;
alter table reminder_log enable row level security;

create policy "Owners can view their own business"
  on businesses for select using (auth.uid() = owner_id);
create policy "Owners can update their own business"
  on businesses for update using (auth.uid() = owner_id);
create policy "Owners can insert their own business"
  on businesses for insert with check (auth.uid() = owner_id);

create policy "Owners can manage their team members"
  on team_members for all using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

create policy "Owners can manage their credentials"
  on credentials for all using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

create policy "Owners can view their reminder log"
  on reminder_log for select using (
    credential_id in (
      select id from credentials where business_id in (
        select id from businesses where owner_id = auth.uid()
      )
    )
  );

-- Storage bucket for uploaded documents (run separately, or create via Supabase dashboard: Storage > New bucket "credential-documents", private)
