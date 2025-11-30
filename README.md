<!-- (almost) Completely by AI -->
<div align="center">
  <h1>Fussr</h1>
</div>

Fussr is a modern Q&A platform built with SvelteKit and Supabase. It supports user authentication, posting and answering questions, voting, following, and multilingual UI (English and Arabic by default). This repository contains a frontend built with Svelte + Vite, server handlers and API endpoints for interacting with a Supabase Postgres database, plus a few utilities and localization tooling.

---

## Project goals

The goal of Fussr is to provide a lightweight question-and-answer site focused on developer questions and solutions. It’s designed to be extensible and portable, with the core features implemented in a modular SvelteKit project and the database handled via Supabase.

## Features

- User authentication with Supabase (email/password)
- CRUD for questions and answers
- Votes (up/down) for questions & answers
- Follow/unfollow questions
- Mark answers as solutions
- Localization with Paraglide (inlang)
- Server-side rendering (SvelteKit / Supabase server client)
- Supabase database migrations & seed scaffolding
- Dicebear avatars for default user avatars

## Tech stack

- Svelte 5 + SvelteKit
- Vite for the dev server & build tooling
- Partial SSR via `@supabase/ssr` and `@supabase/supabase-js`
- Supabase for Postgres database, Auth, Storage, and local dev via Supabase CLI
- Paraglide (inlang) for localization and runtime middleware
- TanStack Query (Svelte) for client-side caching
- Zod for validating input payloads
- DayJS, Lodash, PrismJS, and others for utilities and code highlighting

---

## Getting started

### Prerequisites

- Node.js (v18+ recommended) and npm/yarn/pnpm
- Supabase CLI (for `supabase start` and local development)
- A Supabase project if you want to connect to a remote Supabase instance

### Setup

1. Clone the repo:

```pwsh
git clone https://github.com/IamFastre/Fussr.git
cd Fussr
```

2. Install dependencies:

```pwsh
npm install
```

3. Copy `.env.template` to `.env` and fill in values:

```pwsh
Copy-Item .env.template .env
# Edit .env with your supabase values and (optionally) VITE_PORT
```

Important environment variables (see `.env.template`):

- PUBLIC_SUPABASE_URL: public project URL (e.g. https://xyz.supabase.co)
- PUBLIC_SUPABASE_ANON_KEY: public anon key (frontend)
- PRIVATE_SUPABASE_ADMIN_KEY: *admin* key (server-only)
- PRIVATE_SUPABASE_DB_PASSWORD: if using the local db password
- VITE_PORT: port for Vite development server (defaults to 3000)

> Note: Keep `PRIVATE_SUPABASE_ADMIN_KEY` secret — do not commit it.

### Running Supabase locally

If you want to run the Supabase local dev instance, install the Supabase CLI and run:

```pwsh
# Start local Supabase instance
supabase start

# Push your schema/migrations+seeds and config locally
npm run db:push
```

The `supabase/config.toml` file configures local ports and services (Studio, Realtime, DB). By default the file is set up to use the following ports for local development:

- API: 54321
- DB: 54322
- Studio: 54323
- Inbucket (email dev server): 54324

### Running the app

Run the development server:

```pwsh
npm run dev
```

Build and preview:

```pwsh
npm run build
npm run preview
```

### Generate or update Supabase types

This project includes a script to regenerate typed interfaces for the Supabase schemas:

```pwsh
npm run db:types
```

This script runs `supabase gen types` and writes the results to `src/lib/supabase/types.ts` which is used throughout the codebase to ensure the Supabase client is typed correctly.

---

## Development & build scripts

Key npm scripts (from `package.json`):

- `npm run dev` - Start Vite development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run check:ts` / `check:sv` - TypeScript / Svelte checks
- `npm run db:migration` - Create a new Supabase migration
- `npm run db:diff` - Produce a DB diff
- `npm run db:push` - Push to Supabase (migrations & config)
- `npm run db:types` - Update generated Supabase types

---

## Database schema (main tables)

- `users` — Stores profile information synced from Supabase Auth. (uuid linked to auth users)
- `questions` — Question meta (title, body, tags, author, score, answers, follows)
- `answers` — Responses to a question (body, author, is_solution, score)
- `question_votes` — Up/down votes on questions
- `answer_votes` — Up/down votes on answers
- `question_follows` — Users following questions

Triggers ensure relations are maintained, for example incrementing/decrementing answers count and creating a follow for the author of a new question.

---

## Localization

This project uses Paraglide (via `@inlang/paraglide-js`) and is configured via `vite.config.ts` to output compiled messages in `src/paraglide/` (generated directory). The repository includes `i18n/en.json` and `i18n/ar.json` as the source of translations.

Paraglide middleware is configured in `src/hooks.server.ts` to localize the rendered content and maps the current locale to appropriate content.

---

## License

The project is licensed under [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html#license-text)
