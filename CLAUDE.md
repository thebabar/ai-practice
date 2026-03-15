# AI Visual Lab — Claude Code Context

## What This Project Is
A collection of interactive AI learning visualizations built with React + Vite,
deployed on Vercel at https://ai-practice-eight.vercel.app
GitHub repo: https://github.com/thebabar/ai-practice

---

## Commands
```bash
npm install       # install dependencies
npm run dev       # start local dev server at http://localhost:5173
npm run build     # production build (runs before Vercel deploy)
npm run preview   # preview production build locally
```

## Deploy
```bash
git add .
git commit -m "your message"
git push origin main
# Vercel auto-deploys within ~60 seconds of push
```

---

## Project Structure
```
ai-practice/
├── CLAUDE.md                          ← you are here
├── index.html                         ← HTML shell, do not modify
├── package.json                       ← dependencies: react, react-dom, react-router-dom, vite
├── vite.config.js                     ← Vite + React plugin config, do not modify
├── public/
│   └── favicon.svg                    ← site favicon
└── src/
    ├── main.jsx                       ← React entry point, do not modify
    ├── index.css                      ← global reset only, do not modify
    ├── App.jsx                        ← React Router — add new routes here
    ├── components/
    │   └── NavBar.jsx                 ← shared nav bar used by all pages
    └── pages/
        ├── Home.jsx                   ← landing page with all visualization cards
        ├── TokenOptimization.jsx      ← Visualization 1: Token Optimization
        ├── AgentsTools.jsx            ← Visualization 2: Agents, Tools & Context
        ├── VectorEmbeddings.jsx       ← Visualization 3: Vector Embeddings
        └── TemperatureSampling.jsx    ← Visualization 4: Temperature & Sampling
```

---

## How to Add a New Visualization (3 steps)

### Step 1 — Create the page file
Create `src/pages/YourTopic.jsx`. Copy the structure from an existing page like
`AgentsTools.jsx`. Key things every page needs:
- `import NavBar from '../components/NavBar.jsx'` at the top
- `<NavBar />` as first element inside the root div
- Same font imports (IBM Plex Sans + IBM Plex Mono)
- Tab-based navigation using the same `.ts-tab` / `.ag-tab` pattern
- A quiz section as the last tab

### Step 2 — Register the route
In `src/App.jsx`, add:
```jsx
import YourTopic from './pages/YourTopic.jsx'
// inside <Routes>:
<Route path="/your-topic" element={<YourTopic />} />
```

### Step 3 — Add card to home page
In `src/pages/Home.jsx`, find the `VISUALIZATIONS` array and either:
- Change an existing card from `ready: false` to `ready: true`
- Or add a new entry with `ready: true`

Card fields required: `path`, `icon` (null for SVG icons), `tag`, `title`, `desc`, `pills`, `accent`, `accentDim`, `iconBg`, `glow`, `glowColor`, `ready`

---

## Design System

### Fonts
- **Headings / titles:** `IBM Plex Sans` (700–800 weight)
- **Body / UI / labels:** `IBM Plex Sans` (400–500 weight)
- **Code / tokens / monospace elements:** `IBM Plex Mono` (400–500 weight)
- **Base font size:** 16px (never go below 12px for any visible text)
- Google Fonts import URL:
  `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap`

### Colors (dark theme, background #050810)
Each visualization has a unique accent color:
- Token Optimization: `#38bdf8` (blue)
- Agents & Tools: `#34d399` (green)
- Vector Embeddings: `#f97316` (orange)
- Temperature & Sampling: `#ec4899` (pink)
- Neural Networks (upcoming): `#818cf8` (purple)

### Card Icons
- Token Optimization and Agents use custom inline SVG components (`TokenIcon`, `AgentLoopIcon`)
  defined directly in `Home.jsx` — not emojis
- New visualizations should also use custom SVGs for distinctiveness
- Icon size in card: 28–32px within a 52×52px container

### Layout rules
- Max content width: 920px (panels), 1100px (home grid)
- All pages: dark background `#050810`, no light mode
- Cards: `background: #0a080e` or similar dark surface, border `1px solid`
- Border radius: 14px for cards, 8px for inputs/buttons, 6px for tags

---

## Visualization Structure Pattern
Every page follows this consistent pattern:

```
Hero section (title + subtitle)
Tab bar (5–6 tabs)
  Tab 1: Core concept explanation + interactive demo
  Tab 2: Deep dive / visual explorer
  Tab 3: Comparative / interactive tool
  Tab 4: Real-world application
  Tab 5: (optional) Advanced topic
  Last tab: Quiz (always 4 questions with explanations)
```

---

## Live Visualizations
| # | Title | Path | Accent |
|---|-------|------|--------|
| 1 | Token Optimization | `/token-optimization` | `#38bdf8` |
| 2 | Agents, Tools & Context | `/agents-tools` | `#34d399` |
| 3 | Vector Embeddings | `/vector-embeddings` | `#f97316` |
| 4 | Temperature & Sampling | `/temperature-sampling` | `#ec4899` |

## Planned (Coming Soon cards on Home page)
- Neural Networks (`#818cf8`)

---

## Common Tasks for Claude Code

### Add a new visualization from a .jsx file I provide
1. Copy the file to `src/pages/`
2. Add the import and route to `src/App.jsx`
3. Update the matching card in `src/pages/Home.jsx` — set `ready: true`, update `path` and `pills`
4. Run `npm run build` to verify no errors
5. `git add . && git commit -m "add [topic] visualization" && git push origin main`

### Update fonts or sizing across all pages
Edit each file in `src/pages/` plus `src/components/NavBar.jsx`.
The font import `@import url(...)` is inside the CSS template literal at the top of each file.

### Fix a build error
Run `npm run build` and read the error. Most common issues:
- JSX inside module-level objects (must be inside component functions)
- Missing imports
- Mismatched variable names between VISUALIZATIONS array and render code

### Check what's live
Visit https://ai-practice-eight.vercel.app or check
https://vercel.com for deployment status.

---

## Git Credentials
Remote: `https://github.com/thebabar/ai-practice.git`
Auth: Personal access token (fine-grained, Contents read/write)
If push fails with auth error: `git remote set-url origin https://thebabar:TOKEN@github.com/thebabar/ai-practice.git`
