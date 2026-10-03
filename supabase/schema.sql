-- ============================================================================
-- LeadFinder database schema
--
-- HOW TO USE: Supabase dashboard -> SQL Editor -> New query -> paste this whole
-- file -> Run. It is safe to run more than once.
--
-- THE MANUAL WORKFLOW (no admin panel needed):
--   1. A customer submits the form  -> a row appears in `requests`
--      (status = 'pending'). Their email is filled in for you.
--   2. You research it on your own machine. Optionally set status to
--      'researching' so you remember you've started.
--   3. Add one row per company to `leads` (Table Editor -> leads -> Insert row,
--      or import a CSV). Pick the request with the `request_id` picker.
--   4. Set the request's status to 'completed'. The customer can now see the
--      leads. (Leads stay hidden from them until you do this.)
--   5. Email the customer to tell them their matches are ready, then tick
--      `customer_notified` on the request. (Filter requests by status =
--      completed and customer_notified = false to see who is still waiting.)
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. REQUESTS  - one row per thing a customer asks for
-- ----------------------------------------------------------------------------

do $$
begin
  create type public.request_status as enum ('pending', 'researching', 'completed');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.requests (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),

  -- YOU change this one (dropdown in the table editor).
  status           public.request_status not null default 'pending',

  -- Filled in automatically so you know who to email. Don't edit.
  customer_email   text,

  -- What the customer asked for (from the request form).
  company_name     text not null check (char_length(btrim(company_name))   between 1 and 200),
  industry         text not null check (char_length(btrim(industry))       between 1 and 200),
  target_customer  text not null check (char_length(btrim(target_customer)) between 1 and 300),
  target_country   text not null check (char_length(btrim(target_country)) between 1 and 100),
  target_city      text not null check (char_length(btrim(target_city))    between 1 and 100),
  result_count     int  not null check (result_count in (10, 20, 50)),

  -- Set automatically the moment you flip status to 'completed'.
  completed_at     timestamptz,

  -- Which customer owns it (used for access rules). Filled in automatically.
  user_id          uuid not null default auth.uid()
                     references auth.users (id) on delete cascade
);

-- Product specifics, added after the first release. "add column if not exists"
-- makes this file work on a brand-new project AND on one that already has the
-- table (plain "create table if not exists" would not add columns to an existing
-- table). Both are optional at the database level because older requests don't
-- have them; the request form itself makes product_details required.
alter table public.requests
  add column if not exists product_details text
    check (product_details is null or char_length(btrim(product_details)) between 1 and 1000),
  add column if not exists extra_notes text
    check (extra_notes is null or char_length(btrim(extra_notes)) between 1 and 1000);

-- Bookkeeping for the manual follow-up email: tick `customer_notified` after you
-- have emailed the customer, and `customer_notified_at` is stamped for you.
alter table public.requests
  add column if not exists customer_notified boolean not null default false,
  add column if not exists customer_notified_at timestamptz;

comment on table  public.requests                 is 'One row per customer request. Customers create these via the form; you update status.';
comment on column public.requests.status          is 'pending = just received, researching = you have started, completed = leads entered and visible to the customer.';
comment on column public.requests.customer_email  is 'Who to email when results are ready. Filled in automatically.';
comment on column public.requests.target_customer is 'Who the customer wants to find, e.g. "distributors" or "importers".';
comment on column public.requests.product_details is 'What the customer sells: product type, price level, certifications, what sets it apart. Required by the form (older requests may be empty).';
comment on column public.requests.extra_notes     is 'Optional extra detail from the customer: typical order size, size of buyer, companies to skip.';
comment on column public.requests.result_count    is 'How many companies they asked for. Always 10, 20 or 50.';
comment on column public.requests.completed_at    is 'Set automatically when status becomes completed.';
comment on column public.requests.customer_notified    is 'Tick this after you have emailed the customer that their results are ready. Never shown to customers as an action; they cannot change it.';
comment on column public.requests.customer_notified_at is 'Set automatically when you tick customer_notified. Do not edit.';

create index if not exists requests_user_id_idx on public.requests (user_id);
create index if not exists requests_status_created_idx on public.requests (status, created_at desc);


-- ----------------------------------------------------------------------------
-- 2. LEADS  - one row per company YOU find for a request
-- ----------------------------------------------------------------------------

create table if not exists public.leads (
  id                       uuid primary key default gen_random_uuid(),
  created_at               timestamptz not null default now(),

  -- Which request this company belongs to. In the table editor this column
  -- shows a "select record" picker, so you never have to copy a UUID by hand.
  request_id               uuid not null references public.requests (id) on delete cascade,

  -- REQUIRED: the company name. Everything below is optional - fill in what
  -- you actually found and verified, leave the rest empty.
  company_name             text not null check (char_length(btrim(company_name)) between 1 and 200),
  country                  text,
  city                     text,
  website                  text,

  -- The decision maker. Never guess: if you haven't confirmed the person is
  -- real and in that role (and that the email address works, if you give one),
  -- leave `decision_maker_verified` OFF.
  decision_maker_name      text,
  decision_maker_title     text,
  decision_maker_verified  boolean not null default false,
  contact_email            text,

  -- 0-100, higher = better match.
  lead_score               int check (lead_score between 0 and 100),

  -- The drafted outreach email.
  email_subject            text,
  email_body               text
);

comment on table  public.leads                          is 'One row per company found for a request. You enter these by hand.';
comment on column public.leads.request_id               is 'Which request this lead is for. Use the record picker.';
comment on column public.leads.decision_maker_verified  is 'Tick ONLY if you confirmed this person and their role (and, if you filled in contact_email, that the address is real). Shown to the customer as "Verified" or "Unverified".';
comment on column public.leads.lead_score               is 'Match quality from 0 to 100.';
comment on column public.leads.email_subject            is 'Subject line of the drafted outreach email.';
comment on column public.leads.email_body               is 'Body of the drafted outreach email (plain text).';

create index if not exists leads_request_id_idx on public.leads (request_id);


-- ----------------------------------------------------------------------------
-- 3. AUTOMATIC FILL-INS (triggers)
-- ----------------------------------------------------------------------------

-- Copy the customer's email onto the request so you can see who to contact.
create or replace function public.set_request_customer_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.customer_email := (select u.email from auth.users u where u.id = new.user_id);
  return new;
end
$$;

drop trigger if exists requests_set_customer_email on public.requests;
create trigger requests_set_customer_email
  before insert on public.requests
  for each row execute function public.set_request_customer_email();

-- Stamp completed_at when you mark a request completed (and clear it if you
-- move it back).
create or replace function public.set_request_completed_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    new.completed_at := now();
  elsif new.status <> 'completed' then
    new.completed_at := null;
  end if;
  return new;
end
$$;

drop trigger if exists requests_set_completed_at on public.requests;
create trigger requests_set_completed_at
  before update on public.requests
  for each row execute function public.set_request_completed_at();

-- Stamp customer_notified_at when you tick customer_notified (and clear it if you
-- untick it). A date you typed in yourself is kept when you tick the box.
create or replace function public.set_request_notified_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.customer_notified and not old.customer_notified then
    new.customer_notified_at := coalesce(new.customer_notified_at, now());
  elsif not new.customer_notified then
    new.customer_notified_at := null;
  end if;
  return new;
end
$$;

drop trigger if exists requests_set_notified_at on public.requests;
create trigger requests_set_notified_at
  before update on public.requests
  for each row execute function public.set_request_notified_at();

-- Trigger functions should never be callable from the public API.
revoke execute on function public.set_request_customer_email() from public, anon, authenticated;
revoke execute on function public.set_request_completed_at()   from public, anon, authenticated;
revoke execute on function public.set_request_notified_at()    from public, anon, authenticated;


-- ----------------------------------------------------------------------------
-- 4. ACCESS RULES (Row Level Security)
--
-- Customers (logged-in users) can:
--   * create a request for themselves, and read their own requests
--   * read the leads of their own requests - once status is 'completed'
-- Customers can NOT edit or delete anything, see anyone else's data, or
-- choose their own status. Visitors who aren't logged in can do nothing.
-- You are unaffected: the dashboard / table editor bypasses these rules.
-- ----------------------------------------------------------------------------

alter table public.requests enable row level security;
alter table public.leads    enable row level security;

-- Start from nothing, then grant only what's needed.
revoke all on public.requests from anon, authenticated;
revoke all on public.leads    from anon, authenticated;

-- Customers may read their requests, and may fill in ONLY the form fields when
-- creating one (so they can't set their own status, email, owner or dates).
grant select on public.requests to authenticated;
grant insert (company_name, industry, product_details, target_customer, target_country, target_city, extra_notes, result_count)
  on public.requests to authenticated;

grant select on public.leads to authenticated;

drop policy if exists "Customers read their own requests" on public.requests;
create policy "Customers read their own requests"
  on public.requests for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Customers create their own requests" on public.requests;
create policy "Customers create their own requests"
  on public.requests for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
    and completed_at is null
  );

drop policy if exists "Customers read leads of their completed requests" on public.leads;
create policy "Customers read leads of their completed requests"
  on public.leads for select to authenticated
  using (
    exists (
      select 1
      from public.requests r
      where r.id = leads.request_id
        and r.user_id = (select auth.uid())
        and r.status = 'completed'
    )
  );
