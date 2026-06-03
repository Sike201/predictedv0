-- Run ONLY if you already created `waitlist` from the old README snippet
-- (table exists but without format checks / normalize trigger)

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

-- Normalize existing rows before adding strict constraints
update public.waitlist set email = lower(btrim(email)) where email is not null;

alter table public.waitlist
  drop constraint if exists waitlist_email_format,
  drop constraint if exists waitlist_email_lowercase,
  drop constraint if exists waitlist_email_length;

alter table public.waitlist
  add constraint waitlist_email_format check (
    email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  ),
  add constraint waitlist_email_lowercase check (email = lower(email)),
  add constraint waitlist_email_length check (char_length(email) <= 320);

-- Remove duplicate emails (keeps oldest row) before unique constraint
delete from public.waitlist w
using public.waitlist w2
where w.id > w2.id and w.email = w2.email;

alter table public.waitlist
  drop constraint if exists waitlist_email_unique;

alter table public.waitlist
  add constraint waitlist_email_unique unique (email);
