-- Predicted waitlist — run in Supabase Dashboard → SQL Editor
-- Matches src/components/WaitlistForm.tsx (table: waitlist, column: email)

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),

  -- Same shape as isValidEmail() in src/lib/supabase.ts; stored lowercase only
  constraint waitlist_email_format check (
    email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  ),
  constraint waitlist_email_lowercase check (email = lower(email)),
  constraint waitlist_email_length check (char_length(email) <= 320),
  constraint waitlist_email_unique unique (email)
);

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- ---------------------------------------------------------------------------
-- Normalize email before constraints run (trim + lowercase)
-- ---------------------------------------------------------------------------
create or replace function public.normalize_waitlist_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.email := lower(btrim(new.email));
  return new;
end;
$$;

drop trigger if exists waitlist_normalize_email on public.waitlist;

create trigger waitlist_normalize_email
  before insert or update of email on public.waitlist
  for each row
  execute function public.normalize_waitlist_email();

-- ---------------------------------------------------------------------------
-- Row Level Security — public can sign up only (no reads/updates/deletes)
-- ---------------------------------------------------------------------------
alter table public.waitlist enable row level security;

drop policy if exists "Allow anonymous waitlist signup" on public.waitlist;

create policy "Allow anonymous waitlist signup"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

grant usage on schema public to anon, authenticated;
grant insert on table public.waitlist to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Optional: view signups in Dashboard (service role) or add an admin policy later
-- ---------------------------------------------------------------------------
