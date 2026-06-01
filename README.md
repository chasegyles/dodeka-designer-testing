# Quizly

A designer knowledge testing platform. Admins create quiz "variants" from source URLs (Wikipedia articles, Webflow docs, internal references, anything Anthropic's web search can read). Each variant gets a shareable URL. Takers enter their name, answer multiple-choice questions, and see their score. Admins see every attempt.

Built to deploy on Railway as a single Node service. Tested locally first.

## Stack

- **Backend** — Express + SQLite (`better-sqlite3`)
- **Frontend** — React + Vite + React Router
- **Question generation** — Anthropic API (`claude-sonnet-4-5` + web_search tool), server-side only

The API key lives server-side as an environment variable. It is never sent to the browser. Questions are generated once when a variant is created and stored in SQLite; every taker on the same variant sees the same questions for comparable scoring.

## Project layout

```
quiz-platform/
├── server/             Express API + Anthropic client
│   ├── index.js        Routes, auth middleware, SPA fallback
│   ├── db.js           SQLite schema and connection
│   └── claude.js       Anthropic API client
├── client/             React app
│   ├── index.html
│   ├── vite.config.js  Dev proxy /api → :3001
│   └── src/
│       ├── main.jsx    Router setup
│       ├── api.js      Fetch wrapper with admin password header
│       ├── styles.css  Design tokens
│       ├── components/ Shared UI, AdminLogin
│       └── pages/      AdminDashboard, CreateVariant, VariantDetail, TakeQuiz
├── data/               SQLite DB lives here (created at runtime, gitignored)
├── .env.example
└── package.json
```

## Local setup

You'll need Node 20 or newer.

```bash
# 1. Install dependencies (root only — server + client share the same package.json)
npm install

# 2. Copy the env template and add your Anthropic API key
cp .env.example .env
# Then edit .env and set ANTHROPIC_API_KEY=sk-ant-api03-...

# 3. Start dev mode (Express on :3001, Vite on :5173)
npm run dev
```

Open `http://localhost:5173` in your browser. Vite proxies `/api/*` calls to Express on `:3001`, so you only ever visit the Vite port.

In dev mode the admin pages are open (no password). If you want to test the login flow, set `ADMIN_PASSWORD=anything` in `.env` and restart.

## Production build (local test)

```bash
npm run build    # builds client/dist
npm start        # Express serves both /api/* and the built client on :3001
```

Now open `http://localhost:3001` — single port, no Vite needed. This is the same way Railway will run it.

## Routes

| Path                | Audience | What it does                                              |
|---------------------|----------|-----------------------------------------------------------|
| `/`                 | Admin    | Dashboard of all variants with attempt counts and scores  |
| `/new`              | Admin    | Create a new variant (name, source URLs, question count)  |
| `/variant/:id`      | Admin    | Share URL, list of all attempts, drill into each one      |
| `/quiz/:id`         | Anyone   | Enter name, take the quiz, see results                    |

API routes mirror these (`/api/admin/*` for admin, `/api/quiz/*` for public).

## Deploying to Railway

1. **Push this repo to GitHub.**
2. **In Railway**, create a new project → "Deploy from GitHub repo" → pick this repo.
3. **Environment variables** (Settings → Variables):
   - `ANTHROPIC_API_KEY` — required, your key
   - `ADMIN_PASSWORD` — set this in production (anything not blank turns on the login screen)
   - `DATABASE_PATH` — set to `/data/quiz.db` if you mount a volume (recommended)
4. **Volume for the database** (Settings → Volumes):
   - Mount path: `/data`
   - This keeps the SQLite file across deploys. Without it, every redeploy wipes attempts.
5. **Build & start commands** — Railway's Nixpacks autodetects these from `package.json`:
   - Build: `npm run build`
   - Start: `npm start`
6. **Generate a domain** in Settings → Networking. Done.

Railway sets `PORT` automatically and the server reads it.

## How variants work

When you create a variant:

1. You give it a name, list of source URLs, and a question count.
2. The server calls the Anthropic API with the `web_search` tool, which reads each source URL.
3. Claude returns a JSON array of questions, each with 4 options, the correct index, an explanation, and the source it came from.
4. The full question set is stored in the `variants.questions` column (JSON).
5. A short ID is generated for the share URL (`/quiz/abc1234567`).

When someone takes the quiz, the server returns questions **without** the `correctIndex`. The taker submits their answers, the server grades them, stores the attempt, and returns the full review (correct answers + explanations + source links).

## Schema

```sql
CREATE TABLE variants (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  source_urls     TEXT NOT NULL,    -- JSON array
  question_count  INTEGER NOT NULL,
  questions       TEXT NOT NULL,    -- JSON, includes correct answers
  created_at      INTEGER NOT NULL,
  generated_at    INTEGER NOT NULL
);

CREATE TABLE attempts (
  id              TEXT PRIMARY KEY,
  variant_id      TEXT NOT NULL,
  taker_name      TEXT NOT NULL,
  answers         TEXT NOT NULL,    -- JSON array of indices
  correct_count   INTEGER NOT NULL,
  total_count     INTEGER NOT NULL,
  score_pct       INTEGER NOT NULL,
  completed_at    INTEGER NOT NULL,
  FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
);
```

## Future additions worth considering

- Question regeneration on an existing variant (currently you have to delete and recreate)
- CSV export of attempts
- Email invites with prefilled name
- Rate limiting on quiz submissions
- Postgres adapter (swap `better-sqlite3` for `pg` if you outgrow SQLite)
- Per-question time tracking

## Troubleshooting

**"ANTHROPIC_API_KEY not set"** in server logs — your `.env` isn't being read. Make sure it's at the project root, not in `server/`.

**Question generation fails with 403** — check that your Anthropic API key has access to the web_search tool. Most do, but new keys sometimes don't.

**`better-sqlite3` install fails** — needs Python and a C++ compiler. On macOS run `xcode-select --install`. On Railway this is preinstalled.

**Quiz page loads but shows "Quiz not found"** — the variant ID in the URL doesn't exist in the database. Check `/variant/:id` exists in the admin dashboard.
