# Predicted — Waitlist Landing Page

Single-viewport cinematic waitlist for [predicted.wtf](https://predicted.wtf).

## Features

- Full-screen looping background video (primary visual)
- Dark glass UI panels with backdrop blur
- Live TradingView SOL/USD chart embed
- Interactive dual-handle range forecast demo
- Supabase waitlist integration

## Setup

```bash
npm install
cp .env.example .env.local
```

Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Supabase

```sql
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

create policy "Allow anonymous inserts"
  on waitlist for insert to anon with check (true);
```

## Development

```bash
npm run dev
```

Desktop: fixed `100vh`, no scroll. Mobile may scroll if content overflows.

## Stack

Next.js · TypeScript · Tailwind CSS · Framer Motion · TradingView · Supabase
