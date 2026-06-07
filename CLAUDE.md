# AI Visual Lab — Claude Code Context

> **Styling is governed by the Prism design system. Read these before any styling work:**
> - `prism-design-system.md` — the rules (what colour goes where, component states, what's forbidden).
> - `visual-ai-themes.md` — the migration plan: §2 sanctioned Prism deviations, §3A dark-mode rationale, §10 voice, §12 guardrails.
> - `src/styles/prism-tokens.css` — light tokens (source of truth). `prism-tokens-dark.css` — dark overrides.
> - `src/styles/prism-components.css` / `prism-extensions.css` — ready-made classes; use these instead of restating styles per page.
>
> **Never hardcode hex or px — reference the tokens.**

## What this project is
A collection of interactive AI learning visualizations built with React + Vite.
- **Live:** https://aibitbybot.vercel.app
- **Repo:** https://github.com/thebabar/ai-practice

---

## Commands
```bash
npm install     # install dependencies
npm run dev     # local dev server → http://localhost:5173
npm run build   # production build (runs before every Vercel deploy)
npm run preview # preview the production build locally
```
There is **no test runner, linter, or Storybook** — these four scripts are the whole toolchain.
Node version is not pinned; use an active LTS.

## Deploy
```bash
git add . && git commit -m "your message" && git push origin main
# Vercel auto-deploys within ~60s of a push to main
```

---

## Project structure
```
ai-practice/
├── CLAUDE.md                      ← you are here
├── index.html                     ← HTML shell · do not modify
├── package.json
├── vite.config.js                 ← Vite + React plugin · do not modify
├── api/                            ← Vercel serverless functions (auth + chat)
│   ├── chat-pro.js                 ← project-key chat endpoint
│   ├── chat-user.js                ← bring-your-own-key chat endpoint
│   ├── verify-key.js               ← API-key validation
│   └── _lib/anthropic-stream.js    ← shared streaming helper
└── src/
    ├── main.jsx                   ← React entry point + loads Prism CSS + mounts analytics · do not modify
    ├── index.css                  ← global reset only · do not modify
    ├── App.jsx                    ← React Router — add new routes here
    ├── styles/
    │   ├── prism-tokens.css        ← light theme tokens (source of truth)
    │   ├── prism-tokens-dark.css   ← dark overrides · :root[data-theme="dark"]
    │   ├── prism-components.css     ← .btn .card .badge .input .nav .modal .prism-h1/h2/h3 .prism-body/label/caption/meta
    │   └── prism-extensions.css     ← sanctioned departures: .prism-mono (IBM Plex Mono), .prism-slider, .prism-tabs/.prism-tab
    ├── hooks/                      ← useApiKey, useAuth, useChat
    ├── components/
    │   ├── NavBar.jsx              ← shared nav · owns the GLOBAL theme toggle (see Theming)
    │   ├── ApiKeyModal.jsx          ← BYO-key entry modal
    │   └── PromptSnippet.jsx        ← copyable prompt block
    └── pages/                      ← one file per visualization
```
The `pages/` directory grows often. **Don't trust a hardcoded list — run `git ls-files src/pages`
for the current set** (~22 files today: ~20 visualizations + the two Clerk auth pages).

---

## Routes (`src/App.jsx`)

Most routes are a plain `path` → `Component` mapping you can read straight from `App.jsx`.
Only the rows below carry a rule the file won't make obvious:

| Path | Component | Why it's noted |
|------|-----------|----------------|
| `/learn-claude` | `Resources` | path ≠ component name |
| `/use-case-builder` | `UseCaseBuilderGate` | path ≠ component name; this is the **one page that gates on Clerk** |
| `/use-case-builder/verify` | `UseCaseBuilderVerify` | paired verify step |
| `/sign-in/*`, `/sign-up/*` | `SignInPage`, `SignUpPage` | **only mounted when `VITE_CLERK_PUBLISHABLE_KEY` is set** |

**Clerk wrapping:** when `VITE_CLERK_PUBLISHABLE_KEY` is set, all routes are wrapped in
`<ClerkProvider>` (router push/replace plumbed through `useNavigate`). When the env var is absent,
Clerk is skipped entirely and every non-auth route still works (one `console.info` on boot).

**Auth tiers:** Default = **Tier 1** — no LLM, no API key, no Clerk gating (runs under plain `npm run dev`).
Only `/use-case-builder` opts into Clerk. Build new pages as Tier 1 unless a spec explicitly says otherwise
(recent pages like `/ai-risk-governance` and `/app-building` are deliberately Tier 1).

---

## Dependencies (and which page needs them)
| Package | Used by |
|---------|---------|
| `react`, `react-dom`, `react-router-dom` | everything |
| `@phosphor-icons/react` (v2) | **all icons** — see Icons below |
| `recharts` | chart-driven pages (Temperature & Sampling, Board Briefing, etc.) |
| `@xyflow/react` | Workflow Canvas (node graph) |
| `@clerk/clerk-react`, `@clerk/backend` | auth + the use-case-builder gate (optional at runtime) |
| `@vercel/analytics` | mounted app-wide from `src/main.jsx` |

Clerk is a hard dependency but **optional at runtime** (env-var gated). Don't assume it's active.

---

## Theming — TWO independent systems (read this before touching theme code)

Both write a `data-theme` attribute and both default to **light** — but on **different elements**,
with **separate storage keys**, and they do **not** share state. A DOM like
`<html data-theme="light"> … <div class="ab-page" data-theme="dark">` is valid and intentional.

### System 1 — Global theme · the DEFAULT for every page
- Lives in `src/components/NavBar.jsx` (`useTheme()` → `[theme, toggle]`; sun/moon button).
- Storage key `ai-visual-lab-theme`; writes `document.documentElement.dataset.theme` (`<html data-theme="…">`).
- Activates `:root[data-theme="dark"]` in `prism-tokens-dark.css`, swapping surfaces/text/borders/signal-fills document-wide.
- **Every new page should ride this** — draw from Prism tokens and the global toggle handles dark mode for free. Do nothing extra.

### System 2 — Page-scoped theme · the EXCEPTION (only `/app-building`)
- Lives inside `src/pages/AppBuilding.jsx`. Storage key `app-building-theme`; sets `data-theme` on the page's own `<div class="ab-page">`, **not** the document root.
- A `.ab-page[data-theme="dark"]` block in that page's inline `<style>` overrides the same token names, scoped to the wrapper (custom properties inherit down the cascade).
- **Exists only because that page's spec needs theme isolation below the NavBar.** Do **not** copy this into new pages unless a spec explicitly calls for chrome-isolated theming — reach for System 1 instead.

**NavBar is not Prism-migrated.** It keeps its own hardcoded inline `<style>` with IBM Plex dark colours and stays dark in **both** themes. A new light-mode page will sit under a dark nav bar — that's expected, not a bug. Don't assume the NavBar adapts to your page background.

Neither system reads `prefers-color-scheme` (the old OS-preference branch was removed). The two selectors never collide because each overrides only its own scope.

---

## Icons — Phosphor, not custom SVG
Use `@phosphor-icons/react` v2: `Icon`-suffixed names (e.g. `RocketLaunchIcon`), `duotone` weight by default.
If a name doesn't resolve, fall back to the nearest existing Phosphor name — **never leave a broken import.**
> The old `TokenIcon` / `AgentLoopIcon` inline-SVG convention was retired in the Prism migration. Don't reintroduce it.

---

## Visualization page pattern
Every page follows the same shape:
```
Hero (title + subtitle)
Tab bar (5–6 tabs)
  Tab 1: core concept + interactive demo
  Tab 2: deep dive / visual explorer
  Tab 3: comparative or interactive tool
  Tab 4: real-world application
  Tab 5: (optional) advanced topic
  Last tab: a knowledge check
```
Every visualization ends with a knowledge check; **question count varies** (often 4, but e.g. AI Risk & Governance has 5,
and App Building runs a 4-question quiz per module rather than one trailing tab).
Pull type and components from the Prism CSS (don't restate font stacks per page). Voice follows Prism:
sentence case, second person, outcome-first, no exclamation marks, no "click here."

---

## Add a new visualization
1. Create `src/pages/YourTopic.jsx` (default export `YourTopic`). Copy structure from a recent page; import and render `<NavBar />` as the first element.
2. Register the route in `src/App.jsx`: `<Route path="/your-topic" element={<YourTopic />} />`.
3. Add a card in `src/pages/Home.jsx` — find the `VISUALIZATIONS` array and add an entry with this exact shape:
   ```js
   { path, category, tag, title, desc, pills, ready }
   ```
   - `category` must be one of: `learning-resources` | `hands-on-practice` | `agents` | `generative-ai` | `how-tech-works`.
     Home groups by category and filters via a chip row — **a card with a missing/invalid category renders in no section.**
   - The `ICON_MAP` key is the `path` with the leading `/` stripped; point it at a Phosphor icon.
   - There is **no `accent` field** anymore — it was retired in the Prism migration. Don't add one.
4. `npm run build` to verify no errors.
5. `git add . && git commit -m "add [topic] visualization" && git push origin main`.

**Most common build errors:** JSX inside a module-level object (move it into the component), a missing import, or a name mismatch between the `VISUALIZATIONS` array and the render code.

---

## Known localStorage keys
| Key | Owner / purpose |
|-----|-----------------|
| `ai-visual-lab-theme` | global theme (NavBar) |
| `app-building-theme` | page theme (AppBuilding only) |
| `app-building-progress` | App Building module complete-toggles |
| `home-category-filter` | Home chip-filter selection |
| `claude-resources-progress` | Resources (learn-claude) track progress |

---

## Git
Remote: `https://github.com/thebabar/ai-practice.git` · Auth: fine-grained PAT (Contents read/write).
On auth failure: `git remote set-url origin https://thebabar:TOKEN@github.com/thebabar/ai-practice.git`
(this writes the token into `.git/config` in plaintext — fine for solo use, just be aware).

Commits here are authored under **this repo's local git config**, which differs from the Prism project's
identity. If you co-edit both repos in one session, check `git config user.email` before committing so
commits don't land under the wrong author.
