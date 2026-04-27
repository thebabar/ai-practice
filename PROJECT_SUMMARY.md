# Project Summary — AI Visual Lab + Learning Module

## Project 1: Learning Module (Claude Artifact)
**File:** `learning-module.jsx` — single React artifact running inside Claude

**Stack:** React, Tailwind-free (custom CSS), Anthropic API via artifact's built-in fetch, `window.storage` for persistence

**Features built:**
- Topic input → AI-generated 7–9 module course outline
- Per-module content generation via Claude API
- Sidebar navigation with progress tracking and gold progress bar
- **Inline module name editing** — hover to reveal ✎ icon, click to rename, clears cached content so it regenerates with correct name
- **Scenario Cards (Module 1 only)** — 3 AI-generated real-world scenarios, freeform response textarea, conversational Claude feedback per card (no scores, no right answers)
- **Excel uploader** — parses `.xlsx` via SheetJS, renders scrollable data table, generates 3-category practice challenges (Data Observations, Spreadsheet Tasks, Formula Challenges) from actual sheet data
- **Reference doc uploader** — `.txt` files passed as context to all Claude API calls
- **Course outline upload** — drop a `.txt` file on home screen, Claude parses it into modules, preview before building
- **`window.storage` persistence** — auto-saves all course state on every change, Saved Courses panel on home screen with Resume/Delete, "✓ Course saved" toast
- **Storage adapter pattern** — 4 functions at top of file (`storageGet`, `storageSet`, `storageDel`, `storageListKeys`), swap to `localStorage` equivalents when moving to Vercel

**Known issues fixed:**
- Missing `loadModuleContent` function declaration (dropped during a Python string replacement)
- Broken `"\n"` literal in `csvRows.join()` (same cause)
- SheetJS dynamic CDN import replaced with static `import * as XLSX from "xlsx"`
- Sidebar last module clipping — switched from flexbox to CSS Grid (`grid-template-rows: auto 1fr auto`) with `height: 100vh`

**Moving to Vercel:**
- Use Vite + React: `npm create vite@latest -- --template react`, drop file into `src/App.jsx`
- Swap `window.storage` adapter for `localStorage` (4-line change, comments in file)
- Add Anthropic API key via a serverless function — never expose in browser

---

## Project 2: AI Visual Lab (Vercel)
**Repo:** `thebabar/ai-practice`
**Deployed:** `ai-practice-eight.vercel.app`
**Local:** `ai-visual-lab/` subfolder
**Stack:** React + Vite, auto-deploy on push to main
**Design system:** documented in `CLAUDE.md` — IBM Plex Sans/Mono fonts, `#050810` background, hero → 5–6 tabs → quiz page pattern

### Existing visualizations (Tier 1 — no key, no login):
Token Optimization, Agents/Tools & Context, Vector Embeddings, Temperature & Sampling, Types of LLMs, Image Generation, Introduction to LLMs, Workflow Canvas

### Auth architecture (3 tiers):
- **Tier 1** — no key, no login, all existing activities unchanged
- **Tier 2** — user brings their own Anthropic key (stored in `localStorage` under `anthropic_api_key`)
- **Tier 3** — login required, host absorbs API cost (may change later)

### Infrastructure built:

**Clerk Auth (Tier 3):**
- `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local` and Vercel env vars
- `ClerkProvider` wraps app only when env var is set — blank key = zero Clerk code runs
- `src/hooks/useAuth.js` — returns `{ isLoaded, isSignedIn, user, signOut }`, returns disabled stub when no key set
- `src/pages/SignInPage.jsx` and `SignUpPage.jsx` at `/sign-in/*` and `/sign-up/*`
- NavBar shows "Sign in" link (SignedOut) and UserButton avatar (SignedIn)
- No existing pages or routes gated

**API Key Modal (Tier 2):**
- Key icon in NavBar, green dot when key saved
- `src/components/ApiKeyModal.jsx` — masked input, Test/Save/Clear, status banner
- `src/hooks/useApiKey.js` — `{ key, hasKey, saveKey, clearKey }`, broadcasts custom event for instant dot update
- `api/verify-key.js` — POST `{ key }` → test call to Anthropic → `{ valid: boolean }`
- `vercel.json` rewrite updated to `/((?!api/).*)`  so SPA fallback doesn't swallow `/api/*`

**Streaming API routes:**
- `api/_lib/anthropic-stream.js` — shared SSE helper, emits `data: {"text":"..."}` events, ends with `data: [DONE]`
- `api/chat-user.js` — reads `x-api-key` header (Tier 2), streams via shared helper, `claude-haiku-4-5-20251001`
- `api/chat-pro.js` — verifies Clerk session via `@clerk/backend` `verifyToken()`, uses `ANTHROPIC_API_KEY` env var (Tier 3)
- `src/hooks/useChat.js` — `{ messages, isStreaming, error, sendMessage, stop, reset }`, picks endpoint by `tier: 'user'|'pro'`, handles key/token attachment automatically

**Vercel environment variables set:**
- `ANTHROPIC_API_KEY` — server-side key for Tier 3
- `CLERK_SECRET_KEY` — for JWT verification in `api/chat-pro.js`
- `VITE_CLERK_PUBLISHABLE_KEY` — for frontend Clerk UI

### Board Briefing Generator page:
**File:** `src/pages/BoardBriefing.jsx`
**Route:** `/board-briefing`
**Tier:** User key (Tier 2), `useChat({ tier: 'user' })`
**Accent:** Gold `#c9a84c`

**Structure:**
- Tab 1 — Overview (static: what a board brief is, why it matters)
- Tab 2 — Generate Brief (main activity)
- Tab 3 — What Makes a Good Brief (static tips)
- Tab 4 — Quiz (5 questions on AI governance)

**Form inputs:** Company Name, Industry, Company Size, Current AI Initiatives, Biggest AI Risk, AI Budget (optional)

**Output:** 4 streaming cards — Q1 Summary (gold), Key Risks (rose `#f08080`), Strategic Recommendations (teal `#4ec9b0`), Financial Outlook (gold). Cards fade in as each `## Header` appears in stream. Copy + Export to PDF (`window.print()`) on completion. `@media print` block hides nav/form/tabs for clean board-ready output.

**Parser:** `parseSections()` splits stream by exact `## ` headers — system prompt must always include the 4 exact headers or cards stay empty.

**State fix:** `useChat()`, `useApiKey()`, and form state are called inside the top-level `BoardBriefing` component (which stays mounted across tab switches) and passed down to `GeneratePanel` as props. `GeneratePanel` itself is still conditionally mounted/unmounted via `{tab === 'generate' && <GeneratePanel ... />}` — the brief survives because the hooks live in the always-mounted parent, not because the panel uses CSS hiding.

### Dev caveats (saved in Claude Code project memory):
- `npm run dev` (Vite) does not serve `/api/*` — use `vercel dev` or test on deployed URL
- `vercel.json` rewrite must stay as `/((?!api/).*)`  — do not change to `/(.*)`
- `.env.local` is gitignored — add all env vars manually to Vercel dashboard for production

---

## Key decisions made:
- Tier 3 cost absorbed by host for now, may add user billing later
- Auth provider: Clerk (chosen for Vite compatibility and easy free tier)
- All new LLM activities default to `tier: 'user'` unless explicitly specified as `tier: 'pro'`
- Excel files not persisted in `window.storage` (too heavy) — re-upload required each session
- Single `.jsx` file architecture for the learning module artifact for simplicity
