# Prism Design System — Implementation Handoff (v2.0)

This document is the **rules layer** for the Prism brand kit. It is meant to be read
by Claude Code (or any engineer) alongside two companion files:

- `prism-tokens.css` — the authoritative values (colours, type, spacing, radius, shadow, motion) as CSS custom properties.
- `prism-components.css` — ready-made component styles built on those tokens.

The tokens tell you *what the values are*. This document tells you *how to apply them* —
which colour goes where, what each component does in every state, and what is forbidden.
When a value and a rule seem to conflict, the rule wins.

> Source of truth: **Prism · Brand Kit v2.0** (48-page PDF). Page references appear in
> parentheses throughout so any decision can be traced back.

---

## 0. How to use this in a build

1. Load `prism-tokens.css` once at the app root (it defines everything on `:root`).
2. Load `prism-components.css` after it.
3. Reference variables — `var(--orange-500)`, `var(--spacing-4)` — **never hardcode hex or px.** (p27)
4. Apply the component classes from `prism-components.css` and follow the per-component rules below.
5. Before shipping a screen, run it past the **Guardrails checklist** (§9). If it trips one, the screen is wrong — not the system.

---

## 1. The core principle: restraint

Prism is "corporate, sharp, deliberately quiet." (p28) The system is intentionally small:
**two radii, two shadows, seven spacing steps, seven type sizes, three signal colours.**
There is no `radius-lg`, no `E3` shadow, no weight-500 type. If you feel the need to add one,
the design is wrong, not the system. Premium = restraint.

---

## 2. Colour

### 2.1 The 80 / 15 / 5 hierarchy (p19) — the most important colour rule

| Band | Share | Colours | Role |
|------|-------|---------|------|
| Neutral | ~80% | Warm white `#F7F4F1` (~50%) + Obsidian `#1A1714` (~30%) | Carry all structure: backgrounds, surfaces, text |
| Signal | ~15% | Orange (~8%) + Blue (~7%) | Accents only — actions, tags, emphasis |
| AI Coach | ~5% | Purple | Special emphasis only |

**Signal colours are only ever accents — never the page background, never decoration.** (p19)
Warm neutrals carry the structure; signals appear only where they carry *meaning*. If a screen
starts to feel rainbow-ish, return to this ratio.

### 2.2 The three signals map to product layers (p16)

| Signal | Hex (500) | Means | Used for |
|--------|-----------|-------|----------|
| Orange | `#E8641A` | **On-demand** | Primary CTA, on-demand modules/cards/badges |
| Blue | `#3B7DD8` | **Structured** | Secondary CTA, structured learning paths |
| Purple | `#7C3AED` | **AI Coach** | "Ask Prism", coach surfaces — emphasis only |

Each signal has a 4-step scale: **500** = action, **300** = hover, **100** = callout fills, **50** = soft backgrounds. Never use a signal as a page background.

### 2.3 Surfaces, text, borders (p17)

- Surfaces elevate: `--surface-base` (page) → `--surface-1` (#FFF, cards) → `--surface-2` (hover) → `--surface-3` (strongest).
- Text steps down by purpose, not aesthetics: `--text-primary` (headlines/body) → `--text-secondary` (subheads) → `--text-tertiary` (captions/meta/placeholder).
- Two borders only: `--border-default` (cards/inputs) and `--border-strong` (hover/strong dividers).

### 2.4 Feedback colours (p18) — sit *outside* the brand palette

`--color-success` `--color-error` `--color-warning` `--color-info`. These signal system state and
must read instantly. **Always pair with an icon and clear text. Never decorative.**

### 2.5 Permitted colour-per-element matrix (p20)

Page background → warm-white or obsidian **only**. Headlines/body → warm-white or obsidian.
Subhead & CTA → any signal. Logo → black/white/warm-white/obsidian (+ orange only for the mark, never recoloured otherwise). When in doubt, consult this matrix before committing a hex value.

---

## 3. Typography (p22–25)

Three typefaces, all Google Fonts: **Inter** (UI & headlines, weights 300/400/600/700/800),
**IBM Plex Sans** (dense product body), **Lora** (editorial only — certificates, pull quotes; 400 italic).

### 3.1 Type scale — seven steps, weight 500 excluded (p23)

| Token | Size | Weight | Line-height | Letter-spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| H1 | 32px | 800 | 110% | −0.025em | Page titles |
| H2 | 24px | 800 | 110% | −0.020em | Card titles & sections |
| H3 | 18px | 600 | 110% | −0.015em | Subtitles & group headings |
| Body | 14px | 400 | 160% | 0 | Body copy (most of the reading load) |
| Label | 14px | 600 | 135% | 0 | Form labels & field titles |
| Caption | 12px | 400 | 135% | 0 | Helper text, supporting copy |
| Meta | 11px | 400 | 140% | 0 | Timestamps, metadata, footnotes |

**Never invent a size between steps — raise or lower a level instead.** Use only weights 400 or 600 (and 800 for H1/H2); 500 is excluded. Headings get 110% line-height; body/sub-heads 135–160% for breathing room.

### 3.2 Permitted type-on-colour combinations (p25)

Type colour must come from the contrast-tested set. On imagery, confirm the background is calm and contrast still passes.

---

## 4. System primitives

### 4.1 Spacing — seven tokens, no hardcoded px (p27)

`4 / 8 / 12 / 16 / 24 / 32 / 48`. Reference points: icon-to-text gap = 4; button vertical padding = 8;
form-field padding = 12; **card padding (default) = 16**; form-group gaps = 24; section breaks = 32; page/layout margins = 48.

### 4.2 Radius — two tokens only (p28)

`--radius-sm` 4px (inputs, small buttons, badges) · `--radius-md` 8px (cards, modals, large buttons — default). **No `radius-lg`.**

### 4.3 Shadow — two levels only (p28)

`--shadow-e1` subtle (hover lift on interactive elements) · `--shadow-e2` medium (cards & modals at rest). **No `E3`.**

### 4.4 Gradients (p29) — always 180° top-to-bottom

- **Card** gradients use the pastel ramp (50 → 100) per signal.
- **Button** gradients darken the action 6% — **L & XL signal CTAs only.**
- **Image overlays** are dark transparent only — never coloured.
- **Frosted glass** is reserved for premium & AI Coach surfaces.

### 4.5 Motion (p30) — functional, never decorative

Default `--duration-standard` (200ms) with `--ease-standard`. Hover/toggle = 120ms. Modals = 280ms.
**Never exceed 500ms.** No spring, no bounce, no overshoot, no decorative idle animation. Always respect `prefers-reduced-motion`. Never block user interaction during animation.

### 4.6 Iconography (p41)

**Phosphor icons, outlined, 1.5px stroke, 24px.** Default colour obsidian; orange for on-demand, blue for structured, purple for AI Coach. The rounded rectangle (`--radius-md`) is the universal container for cards, buttons, image containers.

---

## 5. Components

All states below are implemented in `prism-components.css`. Focus ring is **always visible** on
interactive elements: 3px purple outline (`--color-focus-ring`), 2px offset. (p18)

### 5.1 Button (p32) — most-used component

- **Sizes:** XS 24 · S 28 · **M 40 (default)** · L 48 · XL 56 (heights).
- **Variants:** Default (neutral ghost), Orange (on-demand), Blue (structured), Purple (AI Coach), and **gradient** (L & XL only).
- **States:** default, hover, pressed, focused (ring), disabled, loading.
- **Colour leads by layer:** Orange leads on-demand, Blue carries structured, Purple is reserved for AI Coach.
- Gradient CTAs map to specific actions: orange "Generate course", blue "Continue learning", purple "Ask Prism ★".

### 5.2 Input (p33)

- **Sizes:** S 32 · M 40 (default) · L 48 (heights).
- **Label is mandatory — never placeholder-only.** Label = Inter 600/14, always present.
- Helper text = 12/tertiary below the field; on validation it swaps colour and text.
- Container: spacing-3 padding, optional prefix/suffix (16px icon, spacing-2 gap), `--radius-sm`.
- **States:** default, hover (border strengthens to `--border-strong`), focused (purple ring 3px), filled, success (green border + check + "verified" helper), error (red border + ✕ + error helper replaces helper), warning (amber border + ! + warning helper), disabled (locked, faded).

### 5.3 Card (p34) — six patterns

- **Default:** `--surface-1` fill, `--border-default`, `--shadow-e2`. Carries dense content.
- **Signal-tinted** (Orange / Blue / Purple): the tint **must match the layer it represents** — orange on-demand, blue structured, purple AI Coach. Uses the 50 fill or the card gradient.
- **Hero:** image + dark overlay gradient + title.
- **Frosted glass:** premium & AI Coach featured surfaces only.
- **Padding tiers:** Compact 8 (dense rows) · Standard 16 (default) · Spacious 24 (hero).
- `--radius-md`.

### 5.4 Modal (p35)

- **Sizes (widths):** S 400 (alerts) · M 600 (default) · L 800 (forms).
- **Anatomy:** Backdrop `rgba(0,0,0,0.4)` dismissible → Header (H2 + close, spacing-4) → Content (scrollable past max-height, spacing-4) → Footer (Cancel left, primary right, spacing-4).
- **Focus trap is non-negotiable:** Tab loops inside; Esc closes. Dismissible four ways — close button, backdrop, Escape, Cancel.

### 5.5 Navigation (p36)

- **Desktop:** 250px fixed sidebar. **Mobile:** collapsed to icon-only 64px.
- **Nav item states:** default (transparent fill, ink text) · hover (`--surface-2` fill) · **active (obsidian fill, warm-white text, `aria-current="page"`)** · focused (3px purple ring, 2px offset).
- Active state is quiet but unmistakable.

### 5.6 Badge (p37)

- **Sizes:** SM 24 · MD 32.
- **Signal variants:** Default (neutral surface + default border), On-demand (orange-50 fill + orange-500 border), Structured (blue-50 + blue-500), AI Coach (purple-50 + purple-500).
- **Status variants** use the feedback palette: Complete (success), Failed (error), Expiring (warning), Beta (info) — each with an icon.
- May include an icon, be removable (✕), or be composed in a row.
- **Always paired with text — never icon-only without an `aria-label`.** Signal colours match the layer; status colours match the feedback palette. `--radius-sm`.

---

## 6. Logo rules (p9–13)

- Primary lockup = faceted-diamond mark + Inter-800 "Prism" wordmark. Landscape and portrait variants exist — pick by available space.
- Mark colours: black (light bg), white (dark bg), orange (brand). **Do not recolour the mark** beyond these.
- **Minimum size 20px** — never render the mark below it. Reserve clearspace equal to the mark's height on all four sides.
- **Six misuses — never do:** rotate, stretch, place on coloured fields, recolour, use orange on mid-tone, render below 20px.
- ⚠️ **Asset gap:** logos were delivered as PNG. Request **SVG** versions (mark + the Phosphor icon set) so they scale and recolour per the iconography rules. PNGs are a stopgap.

---

## 7. Voice (p42) — applies to all UI copy

Four principles, **always left, never right**: **Clear** not blunt · **Confident** not arrogant · **Human** not casual · **Outcome-first** not feature-first.

- **Always:** lead with the user outcome; use specific numbers ("15 min", "4 modules"); second person ("you"); active voice, contractions, sentence case.
- **Never:** exclamation marks; buzzwords ("microlearning · upskilling · transformative"); passive voice; guilt/urgency; "click here" or "Submit".
- On-brand: *"12 minutes. That's all Module 3 needs. You've got this."* Off-brand: *"Don't miss out on our AI-powered adaptive learning experience!"*

---

## 8. The dashboard lesson (p43–46) — target vs. drift

The brand kit ships two reference dashboards on purpose:

- **On-system (Ebbad / Priya build):** warm-white background, 80/15/5 ratio, signal tints used correctly (blue "Structured" tag, orange "On-demand" tag, purple "Ask Prism" card), Inter headings, proper card surfaces. **This is the target.**
- **Off-system (custom "Simon" build):** dark decorative gradient panels dominate, orange does structural/decorative work instead of acting as an accent, generic-SaaS feel. **This is the cautionary example.**

When applying this system to the existing build, the custom dashboard is what needs to move —
toward the on-system version. "If your page can't be built from these parts alone, it's the page that needs to change — not the system." (p43)

---

## 9. Guardrails checklist (p47) — run before shipping

Six things Prism is **not**. A screen fails review if it reads as any of these:

- [ ] **Feature-led** — copy leads with what the product does, not what the user gets.
- [ ] **Cold or clinical** — sterile, no warmth.
- [ ] **Loud or attention-seeking** — exclamation marks, hype, shouting.
- [ ] **Generic SaaS** — refracted light, warm neutrals, and the Inter system are owned; guard them.
- [ ] **Rainbow or decorative** — colour used for decoration rather than semantic meaning.
- [ ] **A social-media brand** — this is a focused learning product, not a content-marketing machine.

Plus the quick technical pass: no hardcoded hex/px · only two radii · only two shadows · signal colours
are accents only · focus ring visible on every interactive element · `prefers-reduced-motion` respected.
