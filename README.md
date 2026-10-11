# EduForge AI

An AI study companion for students: a RAG-powered tutor you can chat with about
your own PDFs, plus notes, flashcards, quizzes, a study planner, scholarship
matching and progress analytics — backed by Supabase, with generation on Groq
and embeddings run locally.

## Features

| Area | What it does |
| --- | --- |
| **AI Tutor** | Streaming chat with optional PDF upload. Documents are chunked, embedded and stored so answers about your file are grounded and cited, while general questions are answered normally. |
| **Notes** | Markdown notes with autosave, AI-powered generation and summarisation. |
| **Flashcards** | Generate decks from a topic or your notes, then review them in an SM-2 spaced-repetition queue with intervals, lapses and due dates. |
| **Quizzes** | Generate multiple-choice quizzes, take them, and keep accuracy history per subject. |
| **Planner** | Study tasks with priority, subject, duration and due dates; AI can draft a plan from your goals. |
| **Scholarships** | Search and filter, match against your student profile, save, track applications and ask an AI advisor about a specific award. |
| **Analytics** | 90-day view of XP, study minutes, quiz accuracy and flashcard retention. |
| **Dashboard** | Streak, XP, level, recent activity and upcoming tasks, with global search (`⌘K`) and notifications. |

XP, streaks and levels are derived from a single `activity_log` table through SQL
functions, so the numbers shown on the dashboard and in analytics can never
disagree with each other.

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **React 19**
- **TypeScript** in strict mode
- **Tailwind CSS v4**
- **Supabase** — Postgres, Row Level Security, storage, auth (`@supabase/ssr`)
- **Groq** (via the `openai` client, OpenAI-compatible) — chat streaming and structured JSON generation
- **transformers.js** (`@huggingface/transformers`) — embeddings, run in-process; Groq has no embeddings endpoint
- **pgvector** — similarity search over document chunks
- **Framer Motion**, **lucide-react**, **sonner**

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`. You need a Supabase project URL + anon key and a Groq API
key at minimum. See `.env.example` for what each variable does and which ones are
optional.

`SUPABASE_SERVICE_ROLE_KEY` is server-only and bypasses Row Level Security. Never
prefix it with `NEXT_PUBLIC_` and never import it into a client component.

Embeddings need no key — the model is downloaded on first use into `.models/`
(about 85 MB, gitignored) and cached from then on.

### 3. Set up the database

Run these **in order** in the Supabase SQL editor
(Dashboard → your project → SQL Editor). All of them are idempotent and safe to
re-run.

1. `supabase/migrations/001_scholarship_tables.sql` — scholarship schema
2. `supabase/migrations/002_study_features.sql` — notes, flashcards, quizzes,
   planner, activity log, notifications, settings, RLS policies, grants and the
   dashboard SQL functions
3. `supabase/migrations/003_local_embeddings.sql` — rebuilds
   `document_chunks.embedding` at 384 dimensions for the local model, recreates
   its similarity index and the `match_document_chunks` RPC
4. `supabase/seed/scholarships.sql` — reference scholarship data

Two things trip people up in the SQL editor: if any text is selected, only the
selection runs; and each file must be pasted and run in its own query tab.

Until step 2 has run, the dashboard features render empty/zero states rather than
erroring — every data helper falls back gracefully. Scholarships stays empty
until step 4 runs.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run reembed` | Regenerate chunk embeddings after an embedding-model change (see below) |
| `npx tsc --noEmit` | Typecheck |

Note: `next lint` was removed in Next.js 16 — use `npm run lint` (plain ESLint).

### Changing the embedding model

The vector width is baked into `document_chunks.embedding`. Switching
`EMBEDDING_MODEL` to one with a different width needs a migration to re-type the
column, then a backfill:

```bash
npm run reembed -- --dry-run   # report what would be re-embedded
npm run reembed                # only chunks with a NULL embedding
npm run reembed -- --all       # every chunk
```

The script imports `lib/ai/embeddings.ts` directly, so it can never drift from
what the running app produces. It needs `SUPABASE_SERVICE_ROLE_KEY`, because Row
Level Security would otherwise hide other users' chunks from the backfill.

## Project structure

```
app/
  (auth)/          login, signup, forgot-password, verify-email
  (public)/        marketing, blog, guides, help, legal pages
  api/             route handlers for chat, search, notifications, AI generation
  dashboard/       authenticated app: notes, flashcards, quiz, planner,
                   tutor, scholarships, analytics, settings
components/        feature-grouped UI (chat, notes, quiz, dashboard, public, ...)
lib/
  ai/              Groq client (chat, structured JSON) and local embeddings
  rag/             document ingestion and similarity search
  scholarships/    queries, matching logic, types
  study/           dashboard/activity queries and shared types
  supabase/        server and browser clients
supabase/
  migrations/      database schema
  seed/            reference data
```

## Conventions

- **Toasts, not dialogs.** Use `sonner` (`toast.success` / `toast.error`). Never
  `alert()` or `confirm()`.
- **Server Actions** return `ActionResult<T>` (`{ ok, data?, error? }`) and call
  `revalidatePath` for the routes they affect.
- **Dark theme only.** There is no light theme; `app/layout.tsx` pins
  `colorScheme: "dark"`.
- **Row Level Security** confines every user to their own rows. Any new table
  holding user data needs own-row policies plus table grants for `anon`,
  `authenticated` and `service_role`.
- **Migrations must be re-runnable.** Guard with `IF NOT EXISTS`,
  `DROP ... IF EXISTS`, and wrap enum creation so `duplicate_object` is swallowed.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to your production origin. It drives `metadataBase`,
`sitemap.xml` and `robots.txt`; without it, Open Graph URLs resolve against
localhost.

`/dashboard`, `/profile`, `/api/` and `/auth/` are disallowed in `robots.txt`, and
the authenticated trees carry `noindex` from `app/dashboard/layout.tsx` and
`app/(auth)/layout.tsx`.

### Local embeddings on serverless

Embeddings run in-process, so the model (about 85 MB) must be present on the
filesystem. `EMBEDDING_CACHE_DIR` defaults to `.models/` inside the project, and
`serverExternalPackages` keeps `@huggingface/transformers` out of the webpack
bundle so its native runtime resolves.

On platforms with an ephemeral or read-only filesystem the model is re-fetched
into a temporary directory on cold start, which costs roughly a minute the first
time and is not covered by the request timeout on the default tiers. Options:
pre-bake the model into the deployment image and point `EMBEDDING_CACHE_DIR` at
it, or run ingestion on a worker with a persistent volume. A long-running Node
server has neither problem — the model loads once in about a second and stays
resident.
