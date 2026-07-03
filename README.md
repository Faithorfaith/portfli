# OpenShelf — a calm digital library

A Next.js (App Router) implementation of the OpenShelf PRD: readers browse
approved books on digital shelves, contributors submit books for review,
admins moderate submissions and reports, contributors earn points/badges,
and readers can tip verified authors.

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack) + TypeScript + Tailwind CSS v4
- **Prisma 7** + SQLite (via `@prisma/adapter-libsql`) for persistence
- No external services required — file uploads are written to `public/uploads`
  and tipping uses a simulated demo wallet (see "What's simulated" below)

## Getting started

```bash
npm install
npx prisma db push   # creates prisma/dev.db from prisma/schema.prisma
npm run db:seed      # seeds shelves, demo users, and sample books
npm run dev
```

Open http://localhost:3000. From `/signin` you can create a real profile
(name + email, no password in this preview build) or use the demo buttons to
sign in instantly as a reader or as the admin account.

## Project structure

- `app/` — routes (Shelf/Home, Search, Book detail, Reader, Submit wizard,
  Rewards, Profile, and the `/admin` dashboard with its own sidebar sections)
- `components/` — shelf/book UI (`ShelfRow`, `BookCover`, `TipModal`,
  `GuestbookSection`, `ReaderView`, `SubmitWizard`, admin widgets)
- `lib/actions/` — Server Actions for auth, books (save/tip/report/submit),
  guestbook, admin moderation, and file uploads
- `lib/` — Prisma client, auth/session helpers, rewards math, badge/ownership
  rules, formatting helpers
- `prisma/schema.prisma` — data model; `prisma/seed.ts` — demo data generator
  (also generates small placeholder PDFs so "Read Book" works out of the box)

## What's simulated (by design, for this preview build)

- **Auth** is name+email only, no password — good enough to demo
  per-user state (points, saved books, submissions) without building a full
  auth system.
- **Tipping** uses a demo wallet balance seeded on every account; no real
  payment processor is integrated. Swap in a real gateway (e.g. a Nigerian
  payments provider) before handling real money.
- **File storage** is the local filesystem (`public/uploads`), fine for a
  single-instance dev/demo deployment; use object storage (S3-compatible) for
  production.

## Key flows to try

- Sign in as **admin** → **Pending Books**: preview the uploaded file, verify
  the ownership claim, mark tip-eligible, and approve/reject/request changes.
  Approvals award points automatically.
- Sign in as a **reader**: save a book, tip a verified author, leave a
  guestbook note, and submit your own book through the 4-step wizard.
- **Rewards**: points, levels, badges, and the contributor leaderboard.
