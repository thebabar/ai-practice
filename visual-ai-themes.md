# Prism Migration Plan — AI Visual Lab

> Hand this to Claude Code. Save it in the repo root next to `CLAUDE.md` and add a line to
> `CLAUDE.md`: *"Design system rules live in `visual-ai-themes.md` — read it before any styling work."*
>
> This plan applies Prism's **visual language** (tokens, type, spacing, components, voice) to the
> existing React + Vite learning lab.
>
> **Brand identity update (2026-06-08):** The lab now sits inside the Prism family. The **Prism
> faceted-diamond mark** (icon only, no wordmark) is shown in the NavBar — see
> `src/components/NavBar.jsx` `PrismMark`. The lab keeps its own name (`AI Visual Lab`) throughout the
> rest of the UI; the Prism **wordmark and full lockup are still not used.** Earlier versions of this
> plan forbade the Prism logo entirely — that constraint is lifted, but only for the icon-only mark.

---

## TL;DR — the one decision that drives everything

Stop using color as *page identity*. Start using color as *conceptual meaning inside each page*.

- Old model: each visualization owns a neon accent on a black background.
- Prism model: warm-white/obsidian carries ~80% of every screen; orange + blue appear only where
  they mean something; purple is reserved for genuine AI/coach emphasis.
- Differentiation between visualizations now comes from the **icon** and the **hero treatment**
  (obsidian + refracted-light), not from a unique accent hex.

Everything below follows from that.

---

## 0. Confirm these before writing any code

These are judgment calls I want the human to lock before Claude Code runs, because they're expensive
to reverse:

1. **Theme mode — DECIDED: Prism Light is the default.** Ship a runtime toggle to **Prism Dark** as
   the alternate (§3A). "Dark" means the inverted Prism token layer that obeys the same system — *not*
   the old neon theme. One system, two surface modes. (Dark-first and legacy-neon-dark were considered
   and rejected.)
2. **Monospace exception (recommended yes).** Prism ships **no mono font**, but a tokenizer / vector /
   code lab genuinely needs one. Plan adds **IBM Plex Mono for code, tokens, and numeric display only**,
   documented as a deviation (§3). Confirm you're OK with one sanctioned exception.
3. **Drop per-page neon accents (recommended yes).** See TL;DR. If you have a strong reason to keep a
   unique color per visualization, say so — it changes §6 substantially.

---

## 1. Scope

Apply: color tokens, the 80/15/5 ratio, type scale, spacing/radius/shadow/motion, component patterns,
iconography, and voice.

Apply: the Prism **icon-only mark** in the NavBar (see header note · 2026-06-08). Don't apply the
Prism wordmark or full lockup — the lab still carries its own name. Don't invent components Prism doesn't
have without documenting them as deviations (§3).

When a Prism rule and an existing lab habit conflict, **the rule wins** unless it's listed in §3.

---

## 2. Documented deviations from Prism (the honest list)

Prism is deliberately small and will not natively cover a few things this lab needs. These are the
*only* sanctioned departures — everything else must come from the tokens.

| Deviation | Why | Constraint |
|---|---|---|
| **IBM Plex Mono** added | Tokens, code, vectors, costs need monospace; Prism has none | Code / numeric display only. Never for body or headings. |
| **Range slider** styling | Temperature/top-k/top-p need sliders; Prism has no slider | Build from tokens: track `--border-default`, fill = the *semantic* signal, thumb `--surface-1` + `--shadow-e1`, focus ring `--color-focus-ring`. |
| **Tab bar** | Lab uses tab navigation; Prism has nav but no tabs | Style as a row of ghost buttons; active tab = obsidian fill + warm-white text (reuse the nav active rule). |

Put these three in a small `prism-extensions.css` loaded **after** the two Prism files, so the Prism
files stay pristine and the deviations are visible in one place.

---

## 3. Global setup (do this first)

Load order is non-negotiable (tokens define the variables the rest depend on):

1. `src/index.css` — existing reset, leave it.
2. `prism-tokens.css` — copy into `src/styles/`, import in `main.jsx`.
3. `prism-components.css` — copy into `src/styles/`, import in `main.jsx` after tokens.
4. `prism-extensions.css` — new, the three §2 deviations, imported last.

```jsx
// main.jsx — after the existing index.css import
import './styles/prism-tokens.css'
import './styles/prism-components.css'
import './styles/prism-extensions.css'
```

Then retire the per-page `<style>` template literals and the per-page Google Fonts `@import` — fonts
now come once from `prism-components.css`. Where a page used a `--accent` variable, **rebind it to a
Prism token** (e.g. `--accent: var(--blue-500)`) rather than deleting the structure; that keeps each
page's diff small.

Base body should end up as: `--surface-base` background, `--text-primary` text, Inter, 14px/160% body.
(`prism-components.css` already sets this on `body` — just make sure nothing overrides it.)

---

## 3A. Theming — light + dark (both modes)

Run this section only if you chose Option A or B in §0. Skip it for Option C (legacy neon dark).

The toggle works by **swapping only the neutral tokens** — surfaces, text, borders, and the signal
*fill* roles. Everything else is shared, so both modes are the same Prism, just on different surfaces.

### 3A.1 Restructure the tokens into shared vs mode-dependent
- **Shared (stay on `:root`, defined once):** type scale, spacing, radius, shadow geometry, motion,
  the focus ring, and the signal **500** hexes themselves (`--orange-500` etc.).
- **Mode-dependent (defined twice — light on `:root`, dark on `:root[data-theme="dark"]`):**
  `--surface-base / -1 / -2 / -3`, `--text-primary / -secondary / -tertiary`,
  `--border-default / -strong`, and the signal **fill / soft-bg** values (the pale `50`/`100` tints).

### 3A.2 Dark values to define (Prism gives you none of these — this is the real work)
Tune by eye and **check contrast** — Prism requires contrast-tested type-on-color.
- `--surface-base` → obsidian `#1A1714`; `--surface-1/2/3` → a charcoal *lift* ramp, e.g.
  `#221E1A` → `#2B2622` → `#353029`.
- `--text-primary` → warm-white `#F7F4F1`; secondary/tertiary → muted warm grays, e.g.
  `#C7BDB2` / `#9C9085`.
- `--border-default/strong` → dark borders, e.g. `#3A332D` / `#4D453D`.
- **Signal fills invert their mechanism.** The pale `50`/`100` tints don't read on dark. Replace them
  with low-opacity overlays of the 500 — soft-bg `rgba(232,100,26,0.12)`, callout fill
  `rgba(232,100,26,0.20)` for orange; same pattern for blue and purple. For accent **text/borders** on
  dark, prefer the lighter **300** tints over the 500s for legibility (watch blue-500 especially — bump
  to `--blue-300` if it fails contrast on obsidian).
- Feedback colors (`success/error/warning/info`) are bright enough to hold on dark — verify, don't assume.
- **Refracted light and frosted glass already assume dark** — reuse as-is. In dark mode the hero needs
  no obsidian block (the page is already dark); put the refracted-light gradient directly on the base.

### 3A.3 The toggle
- A control sets `document.documentElement.dataset.theme = 'dark' | 'light'`.
- Default to the OS preference (`window.matchMedia('(prefers-color-scheme: dark)')`), then persist the
  user's choice to **`localStorage`** — this is a real Vite app, not an artifact, so `localStorage` is
  fine here.
- Put the toggle in `NavBar.jsx` so it's shared across all pages.

### 3A.4 What is identical in both modes
80/15/5 ratio · the semantic color logic (blue = deterministic, orange = exploratory, purple =
AI emphasis) · type scale · spacing/radius/shadow · components · voice. Only the neutral surfaces,
borders, and signal-fill mechanics differ. If a page looks like a different design in dark, something
leaked out of the mode-dependent set — fix the tokens, not the page.

---

## 4. Typography migration

| Old | New |
|---|---|
| IBM Plex Sans 700–800 headings | **Inter** headings (`--text-weight-h1/h2` = 800, `--text-size-h1` 32 / `h2` 24) |
| IBM Plex Sans body | **IBM Plex Sans** body stays for dense reading; UI labels use Inter (`prism-components.css` defaults UI to Inter — fine) |
| IBM Plex Mono code | **IBM Plex Mono** stays, but only via the §2 exception class |
| Free sizing, "never below 12px" | **Seven sizes only** (32/24/18/14/14/12/11). Never interpolate — move a level. |
| any weight | **400, 600, 800 only — weight 500 is excluded.** Audit for stray 500s/700s. |

Use the `.prism-h1 / .prism-h2 / .prism-h3 / .prism-body / .prism-label / .prism-caption / .prism-meta`
utilities instead of ad-hoc font CSS. Drop `text-transform: uppercase` on tabs/labels — Prism is
sentence case (see §11).

---

## 5. Color migration — the heart of it

### 5.1 The 80/15/5 budget on every screen
~80% warm-white + obsidian, ~15% orange + blue, ~5% purple. If a screen starts to feel colorful,
it's wrong. Signal colors are **never** the page background and **never** decoration.

### 5.2 Heroes get obsidian + refracted light
Each visualization's title section uses an obsidian (`--text-primary`) background with the brand's
refracted-light motif behind the title — `--gradient-refracted-a` for a dramatic cover, `-b` for the
blue-orange blend. Rules: atmospheric/background only, never over busy content, never over photos,
never reversed. This is where the "lab" drama survives the move to light. (In dark mode, skip the
obsidian block — the page is already dark — and lay the refracted gradient straight on the base; see §3A.2.)

### 5.3 Use color semantically *within* each visualization
This is the upgrade. Map the concept's own contrast onto orange/blue:

- **Temperature & Sampling** — blue = deterministic / low temp / "structured"; orange = exploratory /
  high temp / "on-demand." Top-p nucleus selected tokens in orange, rejected in `--text-tertiary`.
- **Token Optimization** — blue for context/structure, orange for cost/spend emphasis; KV-cache hits
  use `--color-success` (with icon + label, never bare).
- **Vector Embeddings** — blue and orange as the two ends of a similarity axis; cosine-similar pairs
  pull toward one signal, dissimilar toward the other. Reserved purple is *not* needed here.
- **Agents & Tools** — blue for the deterministic loop steps, orange for tool calls / external actions.

Purple is held back for any genuine "ask the model / AI coach" affordance (e.g. a "Try this prompt"
helper). If a viz has none, it uses no purple.

### 5.4 Worked example — your "Shared memory architecture" diagram
A concrete test of the principle on something you already have:

- Neutral "Apps each person uses" cards → keep neutral (`--surface-1` + `--border-default`). Correct.
- Teal/green "Use case" cards → **green isn't a Prism signal.** These become **blue** (they're
  structured workflows) or drop to neutral with a blue tag. The green has to go.
- Lavender "Shared brain" cards → **purple is legitimate here** — this is the AI/memory layer, genuine
  emphasis. Keep as `--purple-50` fill / `--purple-100` border (the `.card--purple` pattern).
- Dashed purple MCP connector → fine, purple = AI emphasis, kept thin and atmospheric.
- Result: neutral + blue + one purple zone = on-ratio. Two accents max in view.

---

## 6. Primitives

- **Spacing:** only `4 / 8 / 12 / 16 / 24 / 32 / 48`. Card padding default 16, section breaks 32,
  outer margins 48. No arbitrary px.
- **Radius:** only `--radius-sm` 4 (inputs, badges, small buttons) and `--radius-md` 8 (cards, modals,
  big buttons). The lab's current 14px cards drop to 8. No pill rounding.
- **Shadow:** only `--shadow-e1` (hover lift) and `--shadow-e2` (cards at rest). No heavy drops.
- **Motion:** functional only, `--duration-standard` 200ms default, never exceed 500ms, no
  spring/bounce/overshoot, respect `prefers-reduced-motion` (already handled in components CSS).
  Audit existing animations for long/looping/decorative idles and cut them.

---

## 7. Component mapping

| Lab element today | Prism target |
|---|---|
| Tab bar (uppercase) | `.btn--default` ghost row; active tab = obsidian fill + warm-white text (nav active rule); sentence case |
| Concept cards | `.card--default`; signal-tinted `.card--orange/blue/purple` **only** where the tint carries meaning |
| Quiz answer states | feedback palette with icon + label: correct `--color-success`, wrong `--color-error` (never bare color) |
| Cost calculator fields | `.input` with **mandatory label** (Inter 600/14), helper text, S/M/L heights |
| "Coming soon" / Beta tags | `.badge--beta` (info) and signal badges; always paired with text |
| Primary actions ("Generate", "Run sampler") | `.btn--orange` / gradient orange on L/XL only |
| Sliders | §2 extension, fill = semantic signal |
| Home nav / back button | `.nav__item` patterns |

---

## 8. Per-page notes

- **Build one page end-to-end first** to lock the pattern, then replicate. Recommend
  **Temperature & Sampling** as the showcase — its blue/orange semantic mapping (§5.3) is the cleanest
  proof that color-as-meaning works. Lock it, screenshot it, reuse the structure everywhere.
- **Home.jsx** — obsidian + refracted-light hero; cards become `.card--default` with Phosphor icons;
  the per-card neon accents disappear; "Coming soon" → `.badge--beta`.
- The planned **Neural Networks** card: don't give it a unique purple identity — purple stays reserved.
  It gets the same neutral card + Phosphor icon as the rest.

---

## 9. Icons

Replace custom SVGs (TokenIcon, AgentLoopIcon) **and** all emoji icons (🔢, 🎲) with **Phosphor,
outlined, 1.5px stroke, 24px** (`react-phosphor` / `phosphor-react`). Default obsidian; tint orange or
blue only when the icon sits in a semantic context. One icon family, everywhere.

---

## 10. Voice pass

Run all copy through Prism voice: sentence case, outcome-first, second person, contractions, specific
numbers. Remove every exclamation mark and any buzzwords ("transformative", "microlearning"). Quiz
explanations and tab labels included. Headings are specific and outcome-led, not feature-led.

---

## 11. Execution order for Claude Code

1. Copy the three CSS files into `src/styles/`, wire imports in `main.jsx` (§3). Build — confirm fonts
   and warm-white base load with nothing broken.
2. Create `prism-extensions.css` with the mono class, slider, and tab styles (§2).
3. **If offering both themes (§0 A/B):** restructure tokens into shared vs mode-dependent, define the
   Prism Dark layer, and add the toggle to `NavBar.jsx` (§3A). Verify contrast in dark.
4. Migrate **Temperature & Sampling** fully as the reference pattern (§8). Verify against §12 *in both
   themes* if applicable.
5. Replicate across Token Optimization, Agents & Tools, Vector Embeddings.
6. Migrate Home + cards + obsidian/refracted hero.
7. Swap all icons to Phosphor (§9).
8. Voice pass on all copy (§10).
9. `npm run build`, fix errors, run §12 checklist, then commit + push (`git push origin main`).

Do steps 4–8 as separate commits so each is reviewable.

---

## 12. Guardrails checklist — verify before deploy

Screen fails review if it reads as any of: feature-led · cold/clinical · loud/attention-seeking ·
generic SaaS · rainbow/decorative · social-media brand.

Technical pass:
- [ ] No hardcoded hex or px — everything via tokens (mono/slider/tabs excepted per §2).
- [ ] Only two radii, two shadows in use.
- [ ] Weight 500 nowhere; only 400 / 600 / 800.
- [ ] Signal colors are accents only — never a page background, never decoration.
- [ ] At most two signal colors visible in any single view; purple only for real AI emphasis.
- [ ] Type sizes are exactly the seven steps.
- [ ] Focus ring (3px purple, 2px offset) visible on every interactive element.
- [ ] `prefers-reduced-motion` respected; no animation over 500ms; no decorative idle motion.
- [ ] Sentence case, no exclamation marks, outcome-led copy.
- [ ] Prism icon-only mark in NavBar; Prism wordmark or full lockup NOT used.
- [ ] **If both themes ship:** run this whole checklist in light *and* dark; only neutrals/fills should
      differ between them; all signal and feedback colors pass contrast on dark surfaces.
