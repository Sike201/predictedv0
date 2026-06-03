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

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the full script in [`supabase/waitlist.sql`](supabase/waitlist.sql).

That script creates the `waitlist` table with:

- **Unique emails** — duplicate signups return Postgres error `23505` (handled in the UI as “already on the waitlist”).
- **Format validation** — invalid emails are rejected by a `CHECK` constraint (same pattern as the client).
- **Normalized storage** — a trigger trims and lowercases emails before insert.
- **RLS** — anonymous users can **insert only**; they cannot read or modify rows.

## Development

```bash
npm run dev
```

Desktop: fixed `100vh`, no scroll. Mobile may scroll if content overflows.

## Stack

Next.js · TypeScript · Tailwind CSS · Framer Motion · TradingView · Supabase
