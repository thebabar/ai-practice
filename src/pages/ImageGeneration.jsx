import { useState, useEffect, useRef, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  PencilSimpleIcon, TextAaIcon, WindIcon, ArrowsClockwiseIcon, ImageIcon,
  PlayIcon, StopIcon, ArrowRightIcon, ArrowLeftIcon,
} from '@phosphor-icons/react'

const PIPELINE_ICON = {
  pencil: PencilSimpleIcon,
  text: TextAaIcon,
  wind: WindIcon,
  cycle: ArrowsClockwiseIcon,
  image: ImageIcon,
}
const PipelineIcon = ({ name, ...rest }) => {
  const C = PIPELINE_ICON[name]
  return C ? <C {...rest} /> : null
}

// ─── constants ───────────────────────────────────────────────────────────────
const GRID_SIZE = 20
const TOTAL_STEPS = 24
const SESSION_SIZE = 6

// ─── quiz data ───────────────────────────────────────────────────────────────
const QUIZ = [
  // EASY
  { id: 0, difficulty: 'easy',
    q: 'What is the purpose of a "negative prompt" in image generation?',
    opts: ['Speed up image generation', 'Tell the model what to avoid', 'Increase image resolution', 'Choose the color palette'],
    correct: 1,
    explanation: 'Negative prompts let you specify elements you do NOT want in the image — e.g., "blurry, watermark, deformed hands" — guiding the model away from those features during denoising.' },
  { id: 1, difficulty: 'easy',
    q: 'What does CFG Scale (guidance scale) control in image generation?',
    opts: ['Image resolution', 'Number of colors used', 'How closely the output follows the text prompt', 'The size of the neural network'],
    correct: 2,
    explanation: 'CFG (Classifier-Free Guidance) Scale controls prompt adherence. Low values give creative freedom; high values force strict prompt following — but too high causes distortion.' },
  { id: 2, difficulty: 'easy',
    q: 'In diffusion models, what happens during "forward diffusion"?',
    opts: ['A new image is generated from a prompt', 'Noise is progressively added to an image', 'Text is converted into embeddings', 'The image is decoded from latent space'],
    correct: 1,
    explanation: 'Forward diffusion (the training process) gradually adds Gaussian noise to an image over many timesteps until it becomes pure random static. The model learns to reverse this.' },
  { id: 3, difficulty: 'easy',
    q: 'What are "steps" in image generation?',
    opts: ['The number of words in the prompt', 'The image resolution levels', 'The number of denoising iterations', 'The number of training epochs'],
    correct: 2,
    explanation: 'Steps refer to how many denoising iterations the model runs. More steps generally improve quality (up to a point), but take longer. Most modern samplers converge well at 20–50 steps.' },
  // MEDIUM
  { id: 4, difficulty: 'medium',
    q: 'What role does CLIP play in text-to-image models like Stable Diffusion?',
    opts: ['Generates the final image pixels', 'Adds noise during training', 'Encodes text prompts into embeddings the model understands', 'Decodes the latent representation to pixels'],
    correct: 2,
    explanation: 'CLIP (Contrastive Language–Image Pretraining) encodes text into a vector space aligned with images. The U-Net denoiser is conditioned on these embeddings to steer the generation.' },
  { id: 5, difficulty: 'medium',
    q: 'What is "latent space" in diffusion models?',
    opts: ['The physical GPU memory used during inference', 'A compressed representation where diffusion and denoising happen', 'The space between pixels in an image', 'A type of neural network layer'],
    correct: 1,
    explanation: 'Latent diffusion models compress images ~8× with a VAE before running diffusion in this smaller space. This makes generation much faster while preserving most visual detail.' },
  { id: 6, difficulty: 'medium',
    q: 'What is the key advantage of DDIM over DDPM sampling?',
    opts: ['Higher image quality at any step count', 'Better color accuracy', 'Good results with far fewer steps', 'Supports higher output resolutions'],
    correct: 2,
    explanation: 'DDIM (Denoising Diffusion Implicit Models) is near-deterministic and can skip steps, producing reasonable images at 20–50 steps vs 1000 for DDPM. Same seed → same image.' },
  { id: 7, difficulty: 'medium',
    q: 'What typically happens when CFG scale is set very high (e.g., 20+)?',
    opts: ['Images become more photorealistic', 'Generation becomes much faster', 'Images may become oversaturated or distorted', 'The model ignores the prompt completely'],
    correct: 2,
    explanation: 'Very high CFG values over-amplify the difference between conditional and unconditional predictions, causing extreme color saturation, distortion, and unnatural artifacts.' },
  // HARD
  { id: 8, difficulty: 'hard',
    q: 'What is the role of the U-Net architecture in a diffusion model?',
    opts: ['Encodes text prompts into embeddings', 'Predicts and removes noise at each denoising step', 'Decodes latent vectors into final pixel images', 'Classifies generated image quality'],
    correct: 1,
    explanation: 'The U-Net takes the noisy latent, the timestep, and text conditioning as input, then predicts the noise to subtract. Its encoder-decoder structure with skip connections handles multi-scale denoising.' },
  { id: 9, difficulty: 'hard',
    q: 'What does LoRA (Low-Rank Adaptation) do in image generation?',
    opts: ['Reduces denoising steps needed', 'Increases CFG scale automatically', 'Adds small trainable adapter weights to fine-tune a style or concept', 'Encodes images into latent space'],
    correct: 2,
    explanation: 'LoRA inserts low-rank weight matrices into the attention layers of the U-Net. Training only these small adapters (not the full model) efficiently fine-tunes a specific style or concept.' },
  { id: 10, difficulty: 'hard',
    q: 'What distinguishes latent diffusion from pixel-space diffusion?',
    opts: ['Latent diffusion runs faster by operating in a compressed representation', 'Latent diffusion produces lower quality images', 'Pixel-space diffusion is always faster', 'Latent diffusion can only generate small images'],
    correct: 0,
    explanation: 'Latent diffusion (e.g., Stable Diffusion) uses a VAE to compress images before applying diffusion in this smaller latent space — dramatically reducing computation while preserving visual fidelity.' },
  { id: 11, difficulty: 'hard',
    q: 'What is classifier-free guidance (CFG) technically doing during inference?',
    opts: ['Using a separate classifier to score generated images', 'Interpolating between conditional and unconditional predictions to strengthen prompt adherence', 'Automatically selecting the best style prompt', 'Guiding generation based on human feedback'],
    correct: 1,
    explanation: 'CFG blends two forward passes — one with your text (conditional) and one without (unconditional). The formula: output = uncond + scale × (cond − uncond). Higher scale pushes further toward the conditional direction.' },
]

// ─── adaptive quiz ────────────────────────────────────────────────────────────
const DIFFICULTY_ORDER = ['easy', 'medium', 'hard']

function bumpDifficulty(current, correct) {
  const idx = DIFFICULTY_ORDER.indexOf(current)
  return correct
    ? DIFFICULTY_ORDER[Math.min(idx + 1, 2)]
    : DIFFICULTY_ORDER[Math.max(idx - 1, 0)]
}

function pickQuestion(targetDiff, usedIds) {
  let pool = QUIZ.filter(q => q.difficulty === targetDiff && !usedIds.has(q.id))
  if (!pool.length) {
    const idx = DIFFICULTY_ORDER.indexOf(targetDiff)
    for (const alt of [DIFFICULTY_ORDER[idx + 1], DIFFICULTY_ORDER[idx - 1]].filter(Boolean)) {
      pool = QUIZ.filter(q => q.difficulty === alt && !usedIds.has(q.id))
      if (pool.length) break
    }
  }
  if (!pool.length) pool = QUIZ.filter(q => q.difficulty === targetDiff)
  return pool[Math.floor(Math.random() * pool.length)]
}

// ─── pixel helpers ────────────────────────────────────────────────────────────
function makeBase() {
  const G = GRID_SIZE
  const pixels = []
  for (let y = 0; y < G; y++) {
    for (let x = 0; x < G; x++) {
      const cx = G / 2, cy = G * 0.35
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const yFrac = y / G
      if (dist < 3.2) {
        pixels.push([255, 228, 70])
      } else if (dist < 5.5) {
        const t = (dist - 3.2) / 2.3
        pixels.push([
          Math.round(255 * (1 - t) + 70 * t),
          Math.round(228 * (1 - t) + 110 * t),
          Math.round(70 * (1 - t) + 180 * t),
        ])
      } else if (yFrac < 0.58) {
        const t = yFrac / 0.58
        pixels.push([Math.round(18 + t * 55), Math.round(35 + t * 85), Math.round(130 + t * 65)])
      } else {
        const t = (yFrac - 0.58) / 0.42
        pixels.push([Math.round(25 + t * 15), Math.round(65 - t * 35), 20])
      }
    }
  }
  return pixels
}

function makeNoise() {
  let s = 54321
  const pixels = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    s = (s * 1664525 + 1013904223) >>> 0; const r = s % 256
    s = (s * 1664525 + 1013904223) >>> 0; const g = s % 256
    s = (s * 1664525 + 1013904223) >>> 0; const b = s % 256
    pixels.push([r, g, b])
  }
  return pixels
}

function lerpPixels(a, b, t) {
  return a.map((pa, i) => [
    Math.round(pa[0] + (b[i][0] - pa[0]) * t),
    Math.round(pa[1] + (b[i][1] - pa[1]) * t),
    Math.round(pa[2] + (b[i][2] - pa[2]) * t),
  ])
}

// ─── prompt data ──────────────────────────────────────────────────────────────
const SUBJECTS = ['a glowing forest', 'a cyberpunk city', 'an astronaut on Mars', 'a cozy library', 'a dragon over mountains']
const STYLES = ['digital art', 'pencil sketch', 'watercolor', 'photorealistic', 'anime', 'pixel art']

const IMG = {
  // cozy library — style only
  'library|photorealistic':                    '/images/image-gen/style-photo.webp',
  'library|watercolor':                        '/images/image-gen/style-watercolor.webp',
  'library|anime':                             '/images/image-gen/style-anime.webp',
  'library|pencil sketch':                     '/images/image-gen/style-pencil.webp',
  'library|pixel art':                         '/images/image-gen/style-pixelart-light-amber.webp',
  // cozy library — photorealistic + lighting
  'library|photorealistic|golden hour':        '/images/image-gen/style-photo-light-golden.webp',
  'library|photorealistic|dramatic shadows':   '/images/image-gen/style-photo-light-dramatic.webp',
  'library|photorealistic|neon lights':        '/images/image-gen/style-photo-light-neon.webp',
  'library|photorealistic|studio lighting':    '/images/image-gen/style-photo-light-studio.webp',
  // cozy library — digital art + lighting
  'library|digital art':                        '/images/image-gen/style-digital-light-golden.webp',
  'library|digital art|golden hour':           '/images/image-gen/style-digital-light-golden.webp',
  'library|digital art|dramatic shadows':      '/images/image-gen/style-digital-light-dramatic.webp',
  'library|digital art|neon lights':           '/images/image-gen/style-digital-light-neon.webp',
  'library|digital art|studio lighting':       '/images/image-gen/style-digital-light-studio.webp',
  // glowing forest — photorealistic + lighting
  'forest|photorealistic|golden hour':         '/images/image-gen/forest-photo-light-golden.webp',
  'forest|photorealistic|soft diffused light': '/images/image-gen/forest-photo-light-diffused.webp',
  // glowing forest — watercolor + lighting
  'forest|watercolor|golden hour':             '/images/image-gen/forest-watercolor-light-golden.webp',
  'forest|watercolor|soft diffused light':     '/images/image-gen/forest-watercolor-light-diffused.webp',
}

function subjectKey(s) {
  if (s?.includes('forest'))  return 'forest'
  if (s?.includes('library')) return 'library'
  return null
}

function getExampleImage(subject, style, lighting) {
  const sk = subjectKey(subject)
  if (!sk || !style) return null
  const withLighting = lighting ? IMG[`${sk}|${style}|${lighting}`] : null
  if (withLighting) return { src: withLighting, lightingMatched: true }
  const withStyle = IMG[`${sk}|${style}`]
  if (withStyle) return { src: withStyle, lightingMatched: false }
  return null
}
const LIGHTINGS = ['golden hour', 'studio lighting', 'dramatic shadows', 'soft diffused light', 'neon lights']
const QUALITIES = ['8k uhd', 'highly detailed', 'masterpiece', 'award-winning photography', 'sharp focus']
const NEGATIVES_LIST = ['blurry', 'low quality', 'distorted', 'watermark', 'text', 'duplicate', 'deformed hands', 'overexposed']

// ─── CFG data ─────────────────────────────────────────────────────────────────
// CFG ramp reads low → high adherence: blue (loose, exploratory) →
// success (sweet spot) → orange (over-literal) → error (distorted).
const CFG_BANDS = [
  { range: [1, 3],   label: 'Highly creative', color: 'var(--blue-500)',     desc: 'The model loosely interprets your prompt, often producing dreamlike or unexpected results. Good for exploration and happy accidents.' },
  { range: [4, 6],   label: 'Creative balance', color: 'var(--blue-300)',    desc: 'Follows the prompt with artistic freedom. Good for stylised outputs with room to surprise. Try this for artistic styles.' },
  { range: [7, 11],  label: 'Standard range',  color: 'var(--color-success)', desc: 'Strong prompt adherence while maintaining visual coherence. The sweet spot for most use cases — start here.' },
  { range: [12, 15], label: 'High adherence',  color: 'var(--orange-500)',   desc: 'Very literal prompt interpretation. Maximum control but less variety. Minor artefacts may start appearing.' },
  { range: [16, 20], label: 'Over-guided',     color: 'var(--color-error)',  desc: 'Overly literal — produces distorted colours, extreme contrasts, and unnatural artefacts. Generally avoid.' },
]
function getCfgBand(v) { return CFG_BANDS.find(b => v >= b.range[0] && v <= b.range[1]) || CFG_BANDS[2] }

// ─── sampler data ─────────────────────────────────────────────────────────────
const SAMPLERS = [
  { name: 'DDPM',      speed: 1, quality: 5, stepsMin: 500, stepsTypical: 1000, desc: 'The original diffusion sampler. Extremely slow (1000 steps) but high quality. Rarely used for inference today.' },
  { name: 'DDIM',      speed: 3, quality: 4, stepsMin: 20,  stepsTypical: 40,   desc: 'Deterministic and much faster. Same seed always gives same result. Great baseline sampler.' },
  { name: 'DPM++ 2M',  speed: 5, quality: 5, stepsMin: 15,  stepsTypical: 25,   desc: 'Modern community standard. Excellent quality/speed tradeoff. Default choice in most UIs.' },
  { name: 'Euler a',   speed: 4, quality: 4, stepsMin: 20,  stepsTypical: 30,   desc: 'Ancestral sampler — slightly random each step. Great for artistic and expressive outputs.' },
  { name: 'LMS',       speed: 4, quality: 3, stepsMin: 20,  stepsTypical: 30,   desc: 'Linear multistep — smooth gradients, good for landscapes and clean imagery.' },
]

// ─── styles ───────────────────────────────────────────────────────────────────
const css = `
/* ── ImageGeneration migrated to Prism tokens.
 *  Per §5.3 — text → embed → noise → denoise → image. The pipeline reads
 *  blue (structured transformation); CFG semantic ramp expresses
 *  low→high adherence. Pink page identity dropped. ──────────── */

.ig-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); }

.ig-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .ig-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.ig-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.ig-hero > * { position: relative; }
.ig-hero-tag {
  display: inline-block;
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--blue-300);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  padding: 4px 14px;
  border-radius: 100px;
  margin-bottom: var(--spacing-4);
}
.ig-hero h1 {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin: 0 0 var(--spacing-3);
}
.ig-hero p {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 580px;
  margin: 0 auto;
  opacity: 0.85;
}

.ig-tabs-row {
  display: flex;
  justify-content: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-6);
  background: var(--surface-base);
  overflow-x: auto;
}

.ig-content { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }
.ig-section-title {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-2);
}
.ig-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-6);
  max-width: 720px;
}

/* Pipeline */
.ig-pipeline { display: flex; align-items: stretch; overflow-x: auto; padding-bottom: var(--spacing-1); margin-bottom: var(--spacing-7); }
.ig-pipeline-step {
  flex: 1;
  min-width: 130px;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4) var(--spacing-3);
  text-align: center;
}
.ig-pipeline-icon {
  display: inline-flex;
  margin-bottom: var(--spacing-2);
  color: var(--blue-500);
}
.ig-pipeline-label {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-1);
}
.ig-pipeline-name {
  font: var(--text-weight-label) var(--text-size-caption)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.ig-pipeline-desc {
  font: var(--text-weight-body) var(--text-size-meta)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.ig-pipeline-arrow {
  color: var(--text-tertiary);
  padding: 0 var(--spacing-1);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.ig-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-3); margin-bottom: var(--spacing-6); }
.ig-stat-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  text-align: center;
}
.ig-stat-num {
  font: var(--text-weight-h1) var(--text-size-h2)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin-bottom: 4px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
}
.ig-stat-lbl {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
  letter-spacing: 0.05em;
}

.ig-model-chip {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-secondary);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-1) var(--spacing-3);
}

/* Diffusion */
.ig-diff-grid {
  display: grid;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-default);
}
.ig-diff-controls { display: flex; align-items: center; gap: var(--spacing-2); margin: var(--spacing-3) 0; flex-wrap: wrap; }
.ig-diff-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font: 600 var(--text-size-body)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
  background: transparent;
}
.ig-diff-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ig-diff-btn.fwd  { color: #fff; background: var(--orange-500); border-color: var(--orange-500); }
.ig-diff-btn.fwd:hover  { background: #D45C10; border-color: #D45C10; }
.ig-diff-btn.rev  { color: #fff; background: var(--blue-500); border-color: var(--blue-500); }
.ig-diff-btn.rev:hover  { background: #2B6DCC; border-color: #2B6DCC; }
.ig-diff-btn.stop { color: var(--color-error); border-color: var(--color-error); }
.ig-diff-btn.stop:hover { background: var(--surface-2); }
.ig-diff-step-label {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-secondary);
  margin-left: auto;
}
.ig-diff-progress {
  height: 4px;
  background: var(--surface-3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: var(--spacing-1);
}
.ig-diff-progress-fill {
  height: 100%;
  background: var(--text-primary);
  transition: width 0.08s linear;
  border-radius: 2px;
}

/* Prompt */
.ig-prompt-display {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-primary);
  line-height: 1.8;
  margin-bottom: var(--spacing-5);
  min-height: 56px;
  white-space: pre-wrap;
}
.ig-prompt-cat-title {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-2);
}
.ig-prompt-chips { display: flex; flex-wrap: wrap; gap: var(--spacing-2); margin-bottom: var(--spacing-4); }
.ig-prompt-chip {
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: 100px;
  padding: var(--spacing-1) var(--spacing-3);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.ig-prompt-chip:hover { background: var(--surface-2); border-color: var(--border-strong); color: var(--text-primary); }
.ig-prompt-chip:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
/* Selected chips: subject + quality use Prism signal palette; style /
 * lighting / negative reuse neutral fill + signal border for clarity. */
.ig-prompt-chip.sel-s,
.ig-prompt-chip.sel-q { background: var(--text-primary); border-color: var(--text-primary); color: var(--surface-base); }
.ig-prompt-chip.sel-st { background: var(--blue-50);   border-color: var(--blue-500);   color: var(--blue-500); }
.ig-prompt-chip.sel-l  { background: var(--orange-50); border-color: var(--orange-500); color: var(--orange-500); }
.ig-prompt-chip.sel-n  { background: var(--surface-1); border-color: var(--color-error); color: var(--color-error); }

/* CFG */
.ig-cfg-value {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: var(--spacing-1);
}
.ig-cfg-slider {
  width: 100%;
  margin: var(--spacing-3) 0;
  accent-color: var(--blue-500);
}
.ig-cfg-slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-meta);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-5);
}
.ig-cfg-band {
  border-radius: var(--radius-md);
  padding: var(--spacing-4) var(--spacing-5);
  border: 1px solid;
  margin-bottom: var(--spacing-5);
  background: var(--surface-1);
}
.ig-cfg-spectrum { display: flex; border-radius: var(--radius-sm); overflow: hidden; height: 8px; margin-bottom: var(--spacing-1); }

/* Samplers */
.ig-samplers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: var(--spacing-3); margin-bottom: var(--spacing-6); }
.ig-sampler-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.ig-sampler-card:hover { background: var(--surface-2); border-color: var(--border-strong); }
.ig-sampler-card:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ig-sampler-card.active { background: var(--blue-50); border-color: var(--blue-500); box-shadow: var(--shadow-e1); }
.ig-sampler-name {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.ig-sampler-desc {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3);
}
.ig-bar-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-size-meta);
  color: var(--text-tertiary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  margin-bottom: 5px;
}
.ig-bar-bg { flex: 1; height: 5px; background: var(--surface-3); border-radius: 3px; overflow: hidden; }
.ig-bar-fill { height: 100%; border-radius: 3px; transition: width var(--duration-deliberate) var(--ease-standard); }

/* Quiz */
.ig-quiz-wrap { max-width: 720px; margin: 0 auto; }
.ig-diff-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid;
  background: var(--surface-1);
  margin-bottom: var(--spacing-3);
}
.ig-diff-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.ig-diff-badge.easy   { color: var(--color-success); border-color: var(--color-success); }
.ig-diff-badge.medium { color: var(--color-warning); border-color: var(--color-warning); }
.ig-diff-badge.hard   { color: var(--color-info);    border-color: var(--color-info); }
.ig-quiz-progress { height: 4px; background: var(--surface-3); border-radius: 2px; margin-bottom: var(--spacing-5); overflow: hidden; }
.ig-quiz-progress-fill {
  height: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  transition: width var(--duration-standard) var(--ease-standard);
}
.ig-quiz-counter {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-2);
}
.ig-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-5);
}
.ig-quiz-opt {
  width: 100%;
  text-align: left;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  margin-bottom: var(--spacing-2);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.ig-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.ig-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ig-quiz-opt.correct { border-color: var(--color-success); }
.ig-quiz-opt.wrong   { border-color: var(--color-error); }
.ig-quiz-explanation {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  margin-top: var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.ig-quiz-next {
  margin-top: var(--spacing-5);
  padding: var(--spacing-2) var(--spacing-5);
  background: var(--orange-500);
  border: 1px solid var(--orange-500);
  color: #fff;
  border-radius: var(--radius-md);
  font: 600 var(--text-size-body)/1 var(--font-primary);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.ig-quiz-next:hover { background: #D45C10; border-color: #D45C10; }
.ig-quiz-next:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ig-quiz-done { text-align: center; padding: var(--spacing-7) var(--spacing-4); }
.ig-quiz-score {
  font: var(--text-weight-h1) var(--text-size-h1)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
}
.ig-quiz-score-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}
.ig-quiz-retake {
  padding: var(--spacing-2) var(--spacing-5);
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font: 600 var(--text-size-body)/1 var(--font-primary);
  cursor: pointer;
}
.ig-quiz-retake:hover { background: var(--surface-2); border-color: var(--border-strong); }

@media (max-width: 600px) {
  .ig-pipeline { flex-direction: column; }
  .ig-pipeline-arrow { transform: rotate(90deg); padding: var(--spacing-1) 0; align-self: center; }
  .ig-stats-row { grid-template-columns: 1fr 1fr; }
}
`

const TABS = ['How it works', 'Diffusion', 'Prompt craft', 'CFG scale', 'Samplers', 'Quiz']

export default function ImageGeneration() {
  const [tab, setTab] = useState(0)

  // ── Diffusion ──
  const basePixels = useRef(makeBase())
  const noisePixels = useRef(makeNoise())
  const [diffStep, setDiffStep] = useState(0)
  const [diffPlaying, setDiffPlaying] = useState(false)
  const diffDirRef = useRef('forward')
  const diffTimer = useRef(null)

  const pixels = useMemo(
    () => lerpPixels(basePixels.current, noisePixels.current, diffStep / TOTAL_STEPS),
    [diffStep]
  )

  useEffect(() => {
    if (!diffPlaying) { clearInterval(diffTimer.current); return }
    diffTimer.current = setInterval(() => {
      setDiffStep(prev => {
        const dir = diffDirRef.current
        if (dir === 'forward') {
          if (prev >= TOTAL_STEPS) { setDiffPlaying(false); return prev }
          return prev + 1
        } else {
          if (prev <= 0) { setDiffPlaying(false); return prev }
          return prev - 1
        }
      })
    }, 80)
    return () => clearInterval(diffTimer.current)
  }, [diffPlaying])

  function playForward() { diffDirRef.current = 'forward'; setDiffStep(0); setDiffPlaying(true) }
  function playReverse() { diffDirRef.current = 'reverse'; setDiffStep(TOTAL_STEPS); setDiffPlaying(true) }
  function stopDiff() { setDiffPlaying(false) }

  // ── Prompt ──
  const [subject, setSubject] = useState('a glowing forest')
  const [style, setStyle] = useState('digital art')
  const [lighting, setLighting] = useState(null)
  const [quality, setQuality] = useState(null)
  const [negSet, setNegSet] = useState(new Set())

  function toggleNeg(n) {
    setNegSet(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })
  }

  // ── CFG ──
  const [cfg, setCfg] = useState(7)
  const cfgBand = getCfgBand(cfg)

  // ── Samplers ──
  const [sampler, setSampler] = useState('DPM++ 2M')
  const [steps, setSteps] = useState(25)
  const selSampler = SAMPLERS.find(s => s.name === sampler) || SAMPLERS[2]

  // ── Quiz ──
  const nextDiffRef = useRef('easy')
  const [currentQ, setCurrentQ] = useState(null)
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [usedIds, setUsedIds] = useState(new Set())

  useEffect(() => {
    const q = pickQuestion('easy', new Set())
    setCurrentQ(q)
    setUsedIds(new Set([q.id]))
  }, [])

  function handleQuiz(idx) {
    if (chosen !== null) return
    setChosen(idx)
    const correct = idx === currentQ.correct
    if (correct) setScore(s => s + 1)
    const nd = bumpDifficulty(currentQ.difficulty, correct)
    nextDiffRef.current = nd; setDifficulty(nd)
  }

  function nextQ() {
    if (qNum + 1 >= SESSION_SIZE) { setDone(true); return }
    const next = pickQuestion(nextDiffRef.current, usedIds)
    setUsedIds(prev => new Set([...prev, next.id]))
    setCurrentQ(next); setQNum(n => n + 1); setChosen(null)
  }

  function retake() {
    nextDiffRef.current = 'easy'
    const q = pickQuestion('easy', new Set())
    setCurrentQ(q); setUsedIds(new Set([q.id]))
    setQNum(0); setChosen(null); setScore(0); setDone(false); setDifficulty('easy')
  }

  return (
    <div className="ig-root">
      <style>{css}</style>
      <NavBar />

      <header className="ig-hero">
        <div className="ig-hero-tag">Lesson 8 · Generative AI</div>
        <h1>How AI generates images</h1>
        <p>From a text prompt to a photorealistic image — explore diffusion models, prompt engineering, and the math behind visual AI generation.</p>
      </header>

      <div className="ig-tabs-row">
        <div className="prism-tabs" role="tablist" aria-label="Sections">
          {TABS.map((t, i) => (
            <button
              key={t}
              role="tab"
              className="prism-tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="ig-content">

        {/* ── Tab 0: How It Works ── */}
        {tab === 0 && (
          <>
            <h2 className="ig-section-title">From words to pixels</h2>
            <p className="ig-section-sub">Modern image generation uses diffusion — progressively removing noise from random static, guided by your text prompt through every step.</p>

            <div className="ig-pipeline">
              {[
                { iconKey: 'pencil', label: 'Input',  name: 'Text prompt',        desc: '"A glowing forest at dawn, digital art, golden hour."' },
                null,
                { iconKey: 'text',   label: 'Step 1', name: 'Text encoder (CLIP)', desc: 'Converts prompt into a vector embedding the model understands.' },
                null,
                { iconKey: 'wind',   label: 'Step 2', name: 'Latent noise',       desc: 'Starts from pure random noise in compressed latent space.' },
                null,
                { iconKey: 'cycle',  label: 'Step 3', name: 'U-Net denoiser',     desc: 'Iteratively removes noise over 20–50 steps, guided by the prompt.' },
                null,
                { iconKey: 'image',  label: 'Output', name: 'VAE decoder',        desc: 'Expands the denoised latent back to full image pixels.' },
              ].map((step, i) =>
                step === null
                  ? <div key={i} className="ig-pipeline-arrow"><ArrowRightIcon size={16} weight="bold" /></div>
                  : (
                    <div key={i} className="ig-pipeline-step">
                      <div className="ig-pipeline-icon"><PipelineIcon name={step.iconKey} size={26} weight="duotone" /></div>
                      <div className="ig-pipeline-label">{step.label}</div>
                      <div className="ig-pipeline-name">{step.name}</div>
                      <div className="ig-pipeline-desc">{step.desc}</div>
                    </div>
                  )
              )}
            </div>

            <div className="ig-stats-row">
              <div className="ig-stat-card">
                <div className="ig-stat-num">20–50</div>
                <div className="ig-stat-lbl">Denoising steps</div>
              </div>
              <div className="ig-stat-card">
                <div className="ig-stat-num">4–8s</div>
                <div className="ig-stat-lbl">Generation time (GPU)</div>
              </div>
              <div className="ig-stat-card">
                <div className="ig-stat-num">860M+</div>
                <div className="ig-stat-lbl">U-Net parameters</div>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-5)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-3)' }}>Popular models</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {['Stable Diffusion', 'DALL-E 3', 'Midjourney', 'Flux', 'Adobe Firefly', 'Imagen 3'].map(m => (
                  <div key={m} className="ig-model-chip">{m}</div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>Why "diffusion"?</div>
              <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
                The name comes from physics — like ink diffusing into water (hard to reverse), adding noise to an image is easy. The model learns to reverse that process, transforming random noise into structured, meaningful images guided by your prompt. Training on billions of image-text pairs teaches it what a "glowing forest" or "cyberpunk city" looks like.
              </div>
            </div>
          </>
        )}

        {/* ── Tab 1: Diffusion Process ── */}
        {tab === 1 && (
          <>
            <h2 className="ig-section-title">The diffusion process</h2>
            <p className="ig-section-sub">Forward diffusion destroys an image by adding noise. Reverse diffusion reconstructs it. The model learns this reverse process from billions of examples.</p>

            <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <div
                  className="ig-diff-grid"
                  style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 14px)`, gridTemplateRows: `repeat(${GRID_SIZE}, 14px)` }}
                >
                  {pixels.map((p, i) => (
                    <div key={i} style={{ width: 14, height: 14, background: `rgb(${p[0]},${p[1]},${p[2]})` }} />
                  ))}
                </div>

                <div className="ig-diff-controls">
                  <button className="ig-diff-btn fwd" onClick={playForward}>
                    <PlayIcon size={14} weight="fill" /> Add noise
                  </button>
                  <button className="ig-diff-btn rev" onClick={playReverse}>
                    <PlayIcon size={14} weight="fill" /> Remove noise
                  </button>
                  {diffPlaying && (
                    <button className="ig-diff-btn stop" onClick={stopDiff}>
                      <StopIcon size={14} weight="fill" /> Stop
                    </button>
                  )}
                  <span className="ig-diff-step-label">Step {diffStep} / {TOTAL_STEPS}</span>
                </div>

                <div className="ig-diff-progress">
                  <div className="ig-diff-progress-fill" style={{ width: `${(diffStep / TOTAL_STEPS) * 100}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-size-meta)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', color: 'var(--text-tertiary)' }}>
                  <span>Clean image</span><span>Pure noise</span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--orange-500)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)' }}>
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--orange-500)', marginBottom: 'var(--spacing-2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <ArrowRightIcon size={14} weight="bold" /> Add noise (training)
                  </div>
                  <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
                    During <strong style={{ color: 'var(--text-primary)' }}>training</strong>, the model sees images at every noise level. It learns to predict what noise was added at each timestep — like learning to recognise a painting buried under layers of static.
                  </div>
                </div>
                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--blue-500)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--blue-500)', marginBottom: 'var(--spacing-2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <ArrowLeftIcon size={14} weight="bold" /> Remove noise (generation)
                  </div>
                  <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
                    During <strong style={{ color: 'var(--text-primary)' }}>generation</strong>, the model starts from pure random noise and subtracts a little predicted noise at each step — guided by your text prompt via cross-attention. After ~25 steps, a coherent image emerges.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Tab 2: Prompt Craft ── */}
        {tab === 2 && (
          <>
            <h2 className="ig-section-title">Prompt engineering</h2>
            <p className="ig-section-sub">A prompt is more than a description — it's a recipe. Build one below by selecting ingredients from each category.</p>

            <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap', marginBottom: 'var(--spacing-3)' }}>
              {[
                { lbl: 'Subject',   tint: 'var(--text-primary)' },
                { lbl: 'Style',     tint: 'var(--blue-500)' },
                { lbl: 'Lighting',  tint: 'var(--orange-500)' },
                { lbl: 'Quality',   tint: 'var(--text-primary)' },
                { lbl: 'Negative',  tint: 'var(--color-error)' },
              ].map(({ lbl, tint }) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-size-caption)', color: 'var(--text-secondary)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: tint }} />
                  {lbl}
                </div>
              ))}
            </div>

            <div className="ig-prompt-display">
              {subject && <span style={{ color: 'var(--text-primary)' }}>{subject}</span>}
              {style && <span style={{ color: 'var(--blue-500)' }}>{`, ${style}`}</span>}
              {lighting && <span style={{ color: 'var(--orange-500)' }}>{`, ${lighting}`}</span>}
              {quality && <span style={{ color: 'var(--text-primary)' }}>{`, ${quality}`}</span>}
              {negSet.size > 0 && (
                <span style={{ color: 'var(--color-error)' }}>{`\nNegative: ${[...negSet].join(', ')}`}</span>
              )}
            </div>

            <div className="ig-prompt-cat-title">Subject</div>
            <div className="ig-prompt-chips">
              {SUBJECTS.map(s => (
                <button key={s} className={`ig-prompt-chip${subject === s ? ' sel-s' : ''}`} onClick={() => setSubject(s)}>{s}</button>
              ))}
            </div>

            <div className="ig-prompt-cat-title">Art style</div>
            <div className="ig-prompt-chips">
              {STYLES.map(s => (
                <button key={s} className={`ig-prompt-chip${style === s ? ' sel-st' : ''}`} onClick={() => setStyle(style === s ? null : s)}>{s}</button>
              ))}
            </div>

            <div className="ig-prompt-cat-title">Lighting</div>
            <div className="ig-prompt-chips">
              {LIGHTINGS.map(l => (
                <button key={l} className={`ig-prompt-chip${lighting === l ? ' sel-l' : ''}`} onClick={() => setLighting(lighting === l ? null : l)}>{l}</button>
              ))}
            </div>

            {(() => {
              const match = getExampleImage(subject, style, lighting)
              if (!match) return null
              const tint = match.lightingMatched ? 'var(--orange-500)' : 'var(--blue-500)'
              return (
                <div key={match.src} style={{ marginBottom: 'var(--spacing-5)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: `1px solid ${tint}` }}>
                  <img key={match.src} src={match.src} alt="example output" style={{ width: '100%', display: 'block' }} />
                  <div style={{ padding: 'var(--spacing-2) var(--spacing-4)', background: 'var(--surface-2)', fontSize: 'var(--text-size-caption)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', color: tint }}>
                    Example · <span style={{ color: 'var(--text-primary)' }}>{subject}</span> · <span style={{ color: 'var(--blue-500)' }}>{style}</span>
                    {match.lightingMatched && <> · <span style={{ color: 'var(--orange-500)' }}>{lighting}</span></>}
                  </div>
                </div>
              )
            })()}

            <div className="ig-prompt-cat-title">Quality boosters</div>
            <div className="ig-prompt-chips">
              {QUALITIES.map(q => (
                <button key={q} className={`ig-prompt-chip${quality === q ? ' sel-q' : ''}`} onClick={() => setQuality(quality === q ? null : q)}>{q}</button>
              ))}
            </div>

            <div className="ig-prompt-cat-title">Negative prompt</div>
            <div className="ig-prompt-chips">
              {NEGATIVES_LIST.map(n => (
                <button key={n} className={`ig-prompt-chip${negSet.has(n) ? ' sel-n' : ''}`} onClick={() => toggleNeg(n)}>{n}</button>
              ))}
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>Pro tips</div>
              <ul style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0, paddingLeft: 'var(--spacing-4)' }}>
                <li>Be specific — "a tabby cat on a red velvet chair" beats "a cat".</li>
                <li>Style and lighting have the largest impact on visual feel.</li>
                <li>Quality boosters like "masterpiece" shift the model toward fine-art training data.</li>
                <li>Negative prompts are essential — always include "blurry, low quality, watermark".</li>
              </ul>
            </div>
          </>
        )}

        {/* ── Tab 3: CFG Scale ── */}
        {tab === 3 && (
          <>
            <h2 className="ig-section-title">Guidance scale (CFG)</h2>
            <p className="ig-section-sub">CFG controls how strictly the model follows your prompt. Too low ignores the prompt; too high produces distorted artefacts. Most use cases live between 7 and 12.</p>

            <div style={{ maxWidth: 460, margin: '0 auto var(--spacing-6)' }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-1)' }}>
                <div className="ig-cfg-value" style={{ color: cfgBand.color }}>{cfg}</div>
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: cfgBand.color }}>{cfgBand.label}</div>
              </div>
              <input type="range" min={1} max={20} step={1} value={cfg}
                onChange={e => setCfg(+e.target.value)} className="ig-cfg-slider" />
              <div className="ig-cfg-slider-labels">
                <span>1 — Creative</span><span>10 — Balanced</span><span>20 — Literal</span>
              </div>
              <div className="ig-cfg-band" style={{ borderColor: cfgBand.color }}>
                <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>{cfgBand.desc}</div>
              </div>
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-5)', marginBottom: 'var(--spacing-4)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-3)' }}>CFG spectrum</div>
              <div className="ig-cfg-spectrum">
                {CFG_BANDS.map(b => (
                  <div key={b.label} style={{
                    flex: b.range[1] - b.range[0] + 1,
                    background: b.color,
                    opacity: cfg >= b.range[0] && cfg <= b.range[1] ? 1 : 0.22,
                    transition: 'opacity 0.2s',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-size-meta)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-1)' }}>
                <span>1</span><span>4</span><span>7</span><span>12</span><span>16</span><span>20</span>
              </div>
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-5)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>Under the hood</div>
              <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                At each denoising step, the U-Net runs <em>twice</em> — once with your prompt (conditional) and once without (unconditional). CFG scale amplifies the difference:
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)', background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-2) var(--spacing-4)', color: 'var(--orange-500)' }}>
                output = uncond + {cfg} × (cond − uncond)
              </div>
              <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-3)' }}>
                Higher values push further toward the conditional prediction — effective up to ~12, then instability sets in.
              </div>
            </div>
          </>
        )}

        {/* ── Tab 4: Samplers & Steps ── */}
        {tab === 4 && (
          <>
            <h2 className="ig-section-title">Sampling methods</h2>
            <p className="ig-section-sub">The sampler determines how the model steps from noise to image. Different algorithms offer different speed/quality trade-offs.</p>

            <div className="ig-samplers-grid">
              {SAMPLERS.map(s => (
                <button
                  key={s.name}
                  type="button"
                  className={`ig-sampler-card${sampler === s.name ? ' active' : ''}`}
                  onClick={() => setSampler(s.name)}
                  aria-pressed={sampler === s.name}
                >
                  <div className="ig-sampler-name">{s.name}</div>
                  <div className="ig-sampler-desc">{s.desc}</div>
                  <div className="ig-bar-row">
                    <span style={{ width: 50 }}>Speed</span>
                    <div className="ig-bar-bg"><div className="ig-bar-fill" style={{ width: `${s.speed * 20}%`, background: 'var(--color-success)' }} /></div>
                  </div>
                  <div className="ig-bar-row">
                    <span style={{ width: 50 }}>Quality</span>
                    <div className="ig-bar-bg"><div className="ig-bar-fill" style={{ width: `${s.quality * 20}%`, background: 'var(--blue-500)' }} /></div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-5)', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-3)' }}>
                Steps: <strong style={{ color: 'var(--text-primary)' }}>{steps}</strong>
                <span style={{ fontSize: 'var(--text-size-caption)', color: 'var(--text-tertiary)', marginLeft: 'var(--spacing-2)' }}>
                  ({selSampler.name} typical: {selSampler.stepsTypical})
                </span>
              </div>
              <input type="range" min={5} max={100} step={1} value={steps}
                onChange={e => setSteps(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--blue-500)', marginBottom: 'var(--spacing-2)' }} />
              <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
                {steps < selSampler.stepsMin
                  ? `Too few steps for ${sampler} — image will likely be noisy and incoherent.`
                  : steps <= selSampler.stepsTypical
                  ? `Good range — ${sampler} converges well around ${selSampler.stepsTypical} steps.`
                  : steps <= selSampler.stepsTypical * 2
                  ? `Diminishing returns — little quality gain beyond ${selSampler.stepsTypical} steps.`
                  : `Excessive — negligible benefit beyond ${selSampler.stepsTypical * 2} steps for ${sampler}.`}
              </div>
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>Which sampler should I use?</div>
              <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
                Start with <strong style={{ color: 'var(--text-primary)' }}>DPM++ 2M</strong> at 25 steps — the current community standard.
                Try <strong style={{ color: 'var(--text-primary)' }}>Euler a</strong> when you want more variation between generations.
                Use <strong style={{ color: 'var(--text-primary)' }}>DDIM</strong> when you need deterministic, reproducible outputs from the same seed.
              </div>
            </div>
          </>
        )}

        {/* ── Tab 5: Quiz ── */}
        {tab === 5 && (
          <div className="ig-quiz-wrap">
            <h2 className="ig-section-title">Quick quiz</h2>
            <p className="ig-section-sub">Six questions, adaptive difficulty — covers diffusion, prompting, CFG, and samplers.</p>

            {!done && currentQ && (
              <>
                <div className="ig-quiz-counter">Question {qNum + 1} of {SESSION_SIZE}</div>
                <div className="ig-quiz-progress">
                  <div className="ig-quiz-progress-fill" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} />
                </div>
                <span className={`ig-diff-badge ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
                <div className="ig-quiz-q">{currentQ.q}</div>
                <div role="radiogroup">
                  {currentQ.opts.map((opt, i) => {
                    let cls = 'ig-quiz-opt'
                    if (chosen !== null) {
                      if (i === currentQ.correct) cls += ' correct'
                      else if (i === chosen && chosen !== currentQ.correct) cls += ' wrong'
                    }
                    return (
                      <button
                        key={i}
                        className={cls}
                        disabled={chosen !== null}
                        role="radio"
                        aria-checked={chosen === i}
                        onClick={() => handleQuiz(i)}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {chosen !== null && (
                  <>
                    <div className="ig-quiz-explanation">{currentQ.explanation}</div>
                    <button className="ig-quiz-next" onClick={nextQ}>
                      {qNum + 1 >= SESSION_SIZE ? 'See results' : 'Next question'}
                    </button>
                  </>
                )}
              </>
            )}

            {done && (
              <div className="ig-quiz-done">
                <div className="ig-quiz-score">{score}/{SESSION_SIZE}</div>
                <div className="ig-quiz-score-sub">
                  {score >= SESSION_SIZE - 1 ? 'You understand image generation well.' :
                   score >= SESSION_SIZE / 2 ? 'Solid run. Worth a quick re-read of the tabs you skipped.' :
                   'These take a couple of passes to click. Revisit a tab, then retake.'}
                </div>
                <button className="ig-quiz-retake" onClick={retake}>Retake quiz</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
