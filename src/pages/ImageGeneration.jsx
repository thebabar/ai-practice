import { useState, useEffect, useRef, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'

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
const CFG_BANDS = [
  { range: [1, 3],   label: 'Highly Creative',  color: '#60a5fa', desc: 'The model loosely interprets your prompt, often producing dreamlike or unexpected results. Good for exploration and happy accidents.' },
  { range: [4, 6],   label: 'Creative Balance',  color: '#34d399', desc: 'Follows the prompt with artistic freedom. Good for stylized outputs with room to surprise. Try this for artistic styles.' },
  { range: [7, 11],  label: 'Standard Range',    color: '#fbbf24', desc: 'Strong prompt adherence while maintaining visual coherence. The sweet spot for most use cases — start here.' },
  { range: [12, 15], label: 'High Adherence',    color: '#f97316', desc: 'Very literal prompt interpretation. Maximum control but less variety. Minor artifacts may start appearing.' },
  { range: [16, 20], label: 'Over-guided',        color: '#f87171', desc: 'Overly literal — produces distorted colors, extreme contrasts, and unnatural artifacts. Generally avoid.' },
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
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .ig-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; }

  .ig-hero { max-width: 860px; margin: 0 auto; padding: 56px 28px 36px; text-align: center; }
  .ig-hero-tag { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #e879f9; background: rgba(232,121,249,0.1); border: 1px solid rgba(232,121,249,0.25); padding: 4px 14px; border-radius: 100px; margin-bottom: 20px; }
  .ig-hero h1 { font-size: 40px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 14px; color: #fff; }
  .ig-hero h1 span { color: #e879f9; }
  .ig-hero p { font-size: 16px; color: #7a9bbf; max-width: 580px; margin: 0 auto; line-height: 1.65; }

  .ig-tabs { display: flex; gap: 4px; max-width: 860px; margin: 0 auto; padding: 0 28px; border-bottom: 1px solid rgba(255,255,255,0.06); overflow-x: auto; }
  .ig-tab { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #4a6a8a; background: none; border: none; cursor: pointer; padding: 12px 16px; border-bottom: 2px solid transparent; transition: all 0.18s; white-space: nowrap; }
  .ig-tab:hover { color: #b0c8e0; }
  .ig-tab.active { color: #e879f9; border-bottom-color: #e879f9; }

  .ig-content { max-width: 860px; margin: 0 auto; padding: 36px 28px 80px; }
  .ig-section-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 8px; }
  .ig-section-sub { font-size: 15px; color: #7a9bbf; margin: 0 0 28px; line-height: 1.6; }

  /* Pipeline */
  .ig-pipeline { display: flex; align-items: stretch; overflow-x: auto; padding-bottom: 8px; margin-bottom: 32px; }
  .ig-pipeline-step { flex: 1; min-width: 120px; background: #0d1628; border: 1px solid #1e3048; border-radius: 12px; padding: 16px 12px; text-align: center; }
  .ig-pipeline-icon { font-size: 26px; margin-bottom: 8px; }
  .ig-pipeline-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #e879f9; margin-bottom: 6px; }
  .ig-pipeline-name { font-size: 13px; font-weight: 600; color: #e0e8f0; margin-bottom: 6px; }
  .ig-pipeline-desc { font-size: 11px; color: #7a9bbf; line-height: 1.5; }
  .ig-pipeline-arrow { color: rgba(232,121,249,0.4); font-size: 20px; padding: 0 6px; display: flex; align-items: center; flex-shrink: 0; }

  .ig-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
  .ig-stat-card { background: #0d1628; border: 1px solid #1e3048; border-radius: 12px; padding: 18px; text-align: center; }
  .ig-stat-num { font-size: 28px; font-weight: 800; color: #e879f9; margin-bottom: 4px; font-family: 'IBM Plex Mono', monospace; }
  .ig-stat-lbl { font-size: 12px; color: #7a9bbf; letter-spacing: 0.05em; }

  .ig-model-chip { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #b0c8e0; background: #0d1628; border: 1px solid #1e3048; border-radius: 6px; padding: 6px 14px; }

  /* Diffusion */
  .ig-diff-grid { display: grid; border-radius: 6px; overflow: hidden; border: 1px solid rgba(232,121,249,0.2); }
  .ig-diff-controls { display: flex; align-items: center; gap: 10px; margin: 14px 0 10px; flex-wrap: wrap; }
  .ig-diff-btn { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; padding: 7px 16px; border-radius: 7px; border: 1px solid; cursor: pointer; transition: all 0.18s; background: none; }
  .ig-diff-btn.fwd { color: #e879f9; border-color: rgba(232,121,249,0.4); }
  .ig-diff-btn.fwd:hover { background: rgba(232,121,249,0.08); }
  .ig-diff-btn.rev { color: #34d399; border-color: rgba(52,211,153,0.4); }
  .ig-diff-btn.rev:hover { background: rgba(52,211,153,0.08); }
  .ig-diff-btn.stop { color: #f87171; border-color: rgba(248,113,113,0.4); }
  .ig-diff-btn.stop:hover { background: rgba(248,113,113,0.08); }
  .ig-diff-step-label { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #7a9bbf; margin-left: auto; }
  .ig-diff-progress { height: 4px; background: #1e3048; border-radius: 2px; overflow: hidden; margin-bottom: 6px; }
  .ig-diff-progress-fill { height: 100%; background: #e879f9; transition: width 0.08s linear; border-radius: 2px; }

  /* Prompt */
  .ig-prompt-display { background: #050d1a; border: 1px solid rgba(232,121,249,0.3); border-radius: 10px; padding: 14px 18px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #e0e8f0; line-height: 1.8; margin-bottom: 22px; min-height: 56px; white-space: pre-wrap; }
  .ig-prompt-cat-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #4a6a8a; margin-bottom: 8px; }
  .ig-prompt-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .ig-prompt-chip { font-size: 13px; color: #7a9bbf; background: #0d1628; border: 1px solid #1e3048; border-radius: 20px; padding: 5px 14px; cursor: pointer; transition: all 0.15s; }
  .ig-prompt-chip:hover { border-color: rgba(232,121,249,0.4); color: #e0e8f0; }
  .ig-prompt-chip.sel-s { color: #e879f9; border-color: rgba(232,121,249,0.5); background: rgba(232,121,249,0.08); }
  .ig-prompt-chip.sel-st { color: #38bdf8; border-color: rgba(56,189,248,0.5); background: rgba(56,189,248,0.08); }
  .ig-prompt-chip.sel-l { color: #fbbf24; border-color: rgba(251,191,36,0.5); background: rgba(251,191,36,0.08); }
  .ig-prompt-chip.sel-q { color: #34d399; border-color: rgba(52,211,153,0.5); background: rgba(52,211,153,0.08); }
  .ig-prompt-chip.sel-n { color: #f87171; border-color: rgba(248,113,113,0.5); background: rgba(248,113,113,0.08); }

  /* CFG */
  .ig-cfg-value { font-family: 'IBM Plex Mono', monospace; font-size: 64px; font-weight: 700; line-height: 1; margin-bottom: 6px; }
  .ig-cfg-slider { width: 100%; margin: 14px 0; accent-color: #e879f9; }
  .ig-cfg-slider-labels { display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #4a6a8a; margin-bottom: 20px; }
  .ig-cfg-band { border-radius: 12px; padding: 18px 22px; border: 1px solid; margin-bottom: 20px; transition: all 0.2s; }
  .ig-cfg-spectrum { display: flex; border-radius: 6px; overflow: hidden; height: 8px; margin-bottom: 6px; }

  /* Samplers */
  .ig-samplers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .ig-sampler-card { background: #0d1628; border: 1px solid #1e3048; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.18s; }
  .ig-sampler-card:hover { border-color: rgba(232,121,249,0.3); }
  .ig-sampler-card.active { border-color: #e879f9; background: rgba(232,121,249,0.06); }
  .ig-sampler-name { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 500; color: #e879f9; margin-bottom: 6px; }
  .ig-sampler-desc { font-size: 12px; color: #7a9bbf; line-height: 1.5; margin-bottom: 10px; }
  .ig-bar-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #4a6a8a; font-family: 'IBM Plex Mono', monospace; margin-bottom: 5px; }
  .ig-bar-bg { flex: 1; height: 5px; background: #1e3048; border-radius: 3px; overflow: hidden; }
  .ig-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

  /* Quiz */
  .ig-quiz-wrap { max-width: 640px; margin: 0 auto; }
  .ig-diff-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; border: 1px solid; margin-bottom: 14px; font-weight: 500; }
  .ig-diff-badge.easy   { color: #34d399; border-color: rgba(52,211,153,0.35);  background: rgba(52,211,153,0.08); }
  .ig-diff-badge.medium { color: #fbbf24; border-color: rgba(251,191,36,0.35);  background: rgba(251,191,36,0.08); }
  .ig-diff-badge.hard   { color: #f87171; border-color: rgba(248,113,113,0.35); background: rgba(239,68,68,0.08); }
  .ig-quiz-progress { height: 4px; background: #1e3048; border-radius: 2px; margin-bottom: 22px; overflow: hidden; }
  .ig-quiz-progress-fill { height: 100%; background: #e879f9; border-radius: 2px; transition: width 0.3s; }
  .ig-quiz-counter { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #4a6a8a; margin-bottom: 10px; }
  .ig-quiz-q { font-size: 18px; font-weight: 600; color: #e0e8f0; margin-bottom: 20px; line-height: 1.5; }
  .ig-quiz-opt { width: 100%; text-align: left; background: #0d1628; border: 1px solid #1e3048; border-radius: 9px; padding: 13px 18px; margin-bottom: 10px; font-size: 15px; color: #b0c8e0; cursor: pointer; transition: all 0.15s; font-family: 'IBM Plex Sans', sans-serif; }
  .ig-quiz-opt:hover:not(:disabled) { border-color: rgba(232,121,249,0.4); color: #e0e8f0; }
  .ig-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
  .ig-quiz-opt.wrong   { border-color: #f87171; background: rgba(248,113,113,0.08); color: #f87171; }
  .ig-quiz-explanation { background: #0d1628; border-left: 3px solid #e879f9; border-radius: 0 8px 8px 0; padding: 14px 18px; margin-top: 16px; font-size: 14px; color: #b0c8e0; line-height: 1.6; }
  .ig-quiz-next { margin-top: 18px; padding: 11px 28px; background: #e879f9; color: #000; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif; }
  .ig-quiz-next:hover { background: #f0a0ff; }
  .ig-quiz-done { text-align: center; padding: 40px 20px; }
  .ig-quiz-score { font-size: 56px; font-weight: 800; color: #e879f9; margin-bottom: 8px; font-family: 'IBM Plex Mono', monospace; }
  .ig-quiz-score-sub { font-size: 16px; color: #7a9bbf; margin-bottom: 28px; }
  .ig-quiz-retake { padding: 11px 28px; background: none; border: 1px solid #e879f9; color: #e879f9; border-radius: 8px; font-size: 14px; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif; }
  .ig-quiz-retake:hover { background: rgba(232,121,249,0.08); }

  @media (max-width: 600px) {
    .ig-hero h1 { font-size: 28px; }
    .ig-pipeline { flex-direction: column; }
    .ig-pipeline-arrow { transform: rotate(90deg); padding: 4px 0; align-self: center; }
    .ig-stats-row { grid-template-columns: 1fr 1fr; }
  }
`

const TABS = ['How It Works', 'Diffusion', 'Prompt Craft', 'CFG Scale', 'Samplers', 'Quiz']

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

      {/* Hero */}
      <div className="ig-hero">
        <div className="ig-hero-tag">Lesson 8 · Generative AI</div>
        <h1>How AI <span>Generates Images</span></h1>
        <p>From a text prompt to a photorealistic image — explore diffusion models, prompt engineering, and the math behind visual AI generation.</p>
      </div>

      {/* Tabs */}
      <div className="ig-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`ig-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className="ig-content">

        {/* ── Tab 0: How It Works ── */}
        {tab === 0 && (
          <>
            <h2 className="ig-section-title">From Words to Pixels</h2>
            <p className="ig-section-sub">Modern image generation uses diffusion — progressively removing noise from random static, guided by your text prompt through every step.</p>

            <div className="ig-pipeline">
              {[
                { icon: '✏️', label: 'Input',  name: 'Text Prompt',        desc: '"A glowing forest at dawn, digital art, golden hour"' },
                null,
                { icon: '🔤', label: 'Step 1', name: 'Text Encoder (CLIP)',  desc: 'Converts prompt into a vector embedding the model understands' },
                null,
                { icon: '🌫️', label: 'Step 2', name: 'Latent Noise',        desc: 'Starts from pure random noise in compressed latent space' },
                null,
                { icon: '🔁', label: 'Step 3', name: 'U-Net Denoiser',       desc: 'Iteratively removes noise over 20–50 steps, guided by the prompt' },
                null,
                { icon: '🖼️', label: 'Output', name: 'VAE Decoder',          desc: 'Expands the denoised latent back to full image pixels' },
              ].map((step, i) =>
                step === null
                  ? <div key={i} className="ig-pipeline-arrow">→</div>
                  : (
                    <div key={i} className="ig-pipeline-step">
                      <div className="ig-pipeline-icon">{step.icon}</div>
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
                <div className="ig-stat-lbl">Denoising Steps</div>
              </div>
              <div className="ig-stat-card">
                <div className="ig-stat-num">4–8s</div>
                <div className="ig-stat-lbl">Generation Time (GPU)</div>
              </div>
              <div className="ig-stat-card">
                <div className="ig-stat-num">860M+</div>
                <div className="ig-stat-lbl">U-Net Parameters</div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e8f0', marginBottom: 12 }}>Popular Models</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {['Stable Diffusion', 'DALL-E 3', 'Midjourney', 'Flux', 'Adobe Firefly', 'Imagen 3'].map(m => (
                  <div key={m} className="ig-model-chip">{m}</div>
                ))}
              </div>
            </div>

            <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e8f0', marginBottom: 8 }}>Why "diffusion"?</div>
              <div style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.65 }}>
                The name comes from physics — like ink diffusing into water (hard to reverse), adding noise to an image is easy. The model learns to reverse that process, transforming random noise into structured, meaningful images guided by your prompt. Training on billions of image-text pairs teaches it what a "glowing forest" or "cyberpunk city" looks like.
              </div>
            </div>
          </>
        )}

        {/* ── Tab 1: Diffusion Process ── */}
        {tab === 1 && (
          <>
            <h2 className="ig-section-title">The Diffusion Process</h2>
            <p className="ig-section-sub">Forward diffusion destroys an image by adding noise. Reverse diffusion reconstructs it. The model learns this reverse process from billions of examples.</p>

            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
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
                  <button className="ig-diff-btn fwd" onClick={playForward}>▶ Add Noise</button>
                  <button className="ig-diff-btn rev" onClick={playReverse}>▶ Remove Noise</button>
                  {diffPlaying && <button className="ig-diff-btn stop" onClick={stopDiff}>■ Stop</button>}
                  <span className="ig-diff-step-label">Step {diffStep}/{TOTAL_STEPS}</span>
                </div>

                <div className="ig-diff-progress">
                  <div className="ig-diff-progress-fill" style={{ width: `${(diffStep / TOTAL_STEPS) * 100}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'IBM Plex Mono', color: '#4a6a8a' }}>
                  <span>Clean Image</span><span>Pure Noise</span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 12, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e879f9', marginBottom: 8 }}>→ Add Noise (Training)</div>
                  <div style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.65 }}>
                    During <strong style={{ color: '#b0c8e0' }}>training</strong>, the model sees images at every noise level. It learns to predict what noise was added at each timestep — like learning to recognize a painting buried under layers of static.
                  </div>
                </div>
                <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#34d399', marginBottom: 8 }}>← Remove Noise (Generation)</div>
                  <div style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.65 }}>
                    During <strong style={{ color: '#b0c8e0' }}>generation</strong>, the model starts from pure random noise and subtracts a little predicted noise at each step — guided by your text prompt via cross-attention. After ~25 steps, a coherent image emerges.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Tab 2: Prompt Craft ── */}
        {tab === 2 && (
          <>
            <h2 className="ig-section-title">Prompt Engineering</h2>
            <p className="ig-section-sub">A prompt is more than a description — it's a recipe. Build one below by selecting ingredients from each category.</p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
              {[['Subject', '#e879f9'], ['Style', '#38bdf8'], ['Lighting', '#fbbf24'], ['Quality', '#34d399'], ['Negative', '#f87171']].map(([lbl, color]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7a9bbf' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  {lbl}
                </div>
              ))}
            </div>

            <div className="ig-prompt-display">
              {subject && <span style={{ color: '#e879f9' }}>{subject}</span>}
              {style && <span style={{ color: '#38bdf8' }}>{`, ${style}`}</span>}
              {lighting && <span style={{ color: '#fbbf24' }}>{`, ${lighting}`}</span>}
              {quality && <span style={{ color: '#34d399' }}>{`, ${quality}`}</span>}
              {negSet.size > 0 && (
                <span style={{ color: '#f87171' }}>{`\nNegative: ${[...negSet].join(', ')}`}</span>
              )}
            </div>

            <div className="ig-prompt-cat-title">Subject</div>
            <div className="ig-prompt-chips">
              {SUBJECTS.map(s => (
                <button key={s} className={`ig-prompt-chip${subject === s ? ' sel-s' : ''}`} onClick={() => setSubject(s)}>{s}</button>
              ))}
            </div>

            <div className="ig-prompt-cat-title">Art Style</div>
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
              return (
                <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: `1px solid ${match.lightingMatched ? 'rgba(251,191,36,0.2)' : 'rgba(56,189,248,0.2)'}` }}>
                  <img src={match.src} alt="example output" style={{ width: '100%', display: 'block' }} />
                  <div style={{ padding: '8px 14px', background: '#0d1628', fontSize: 12, fontFamily: 'IBM Plex Mono', color: match.lightingMatched ? '#fbbf24' : '#38bdf8' }}>
                    Example · <span style={{ color: '#e879f9' }}>{subject}</span> · <span style={{ color: '#38bdf8' }}>{style}</span>
                    {match.lightingMatched && <> · <span style={{ color: '#e0e8f0' }}>{lighting}</span></>}
                  </div>
                </div>
              )
            })()}

            <div className="ig-prompt-cat-title">Quality Boosters</div>
            <div className="ig-prompt-chips">
              {QUALITIES.map(q => (
                <button key={q} className={`ig-prompt-chip${quality === q ? ' sel-q' : ''}`} onClick={() => setQuality(quality === q ? null : q)}>{q}</button>
              ))}
            </div>

            <div className="ig-prompt-cat-title">Negative Prompt</div>
            <div className="ig-prompt-chips">
              {NEGATIVES_LIST.map(n => (
                <button key={n} className={`ig-prompt-chip${negSet.has(n) ? ' sel-n' : ''}`} onClick={() => toggleNeg(n)}>{n}</button>
              ))}
            </div>

            <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e8f0', marginBottom: 8 }}>Pro Tips</div>
              <ul style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.75, margin: 0, paddingLeft: 18 }}>
                <li>Be specific — "a tabby cat on a red velvet chair" beats "a cat"</li>
                <li>Style + lighting have the largest impact on visual feel</li>
                <li>Quality boosters like "masterpiece" shift the model toward fine art training data</li>
                <li>Negative prompts are essential — always include "blurry, low quality, watermark"</li>
              </ul>
            </div>
          </>
        )}

        {/* ── Tab 3: CFG Scale ── */}
        {tab === 3 && (
          <>
            <h2 className="ig-section-title">Guidance Scale (CFG)</h2>
            <p className="ig-section-sub">CFG controls how strictly the model follows your prompt. Too low = ignores the prompt. Too high = distorted artifacts. Most use cases live between 7–12.</p>

            <div style={{ maxWidth: 460, margin: '0 auto 28px' }}>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div className="ig-cfg-value" style={{ color: cfgBand.color }}>{cfg}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: cfgBand.color }}>{cfgBand.label}</div>
              </div>
              <input type="range" min={1} max={20} step={1} value={cfg}
                onChange={e => setCfg(+e.target.value)} className="ig-cfg-slider" />
              <div className="ig-cfg-slider-labels">
                <span>1 — Creative</span><span>10 — Balanced</span><span>20 — Literal</span>
              </div>
              <div className="ig-cfg-band" style={{ borderColor: cfgBand.color + '44', background: cfgBand.color + '0d' }}>
                <div style={{ fontSize: 14, color: '#b0c8e0', lineHeight: 1.65 }}>{cfgBand.desc}</div>
              </div>
            </div>

            <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e8f0', marginBottom: 12 }}>CFG Spectrum</div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'IBM Plex Mono', color: '#4a6a8a', marginTop: 6 }}>
                <span>1</span><span>4</span><span>7</span><span>12</span><span>16</span><span>20</span>
              </div>
            </div>

            <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e8f0', marginBottom: 10 }}>Under the hood</div>
              <div style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.65, marginBottom: 12 }}>
                At each denoising step, the U-Net runs <em>twice</em> — once with your prompt (conditional) and once without (unconditional). CFG scale amplifies the difference:
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, background: '#050d1a', border: '1px solid #1e3048', borderRadius: 8, padding: '10px 16px', color: '#e879f9' }}>
                output = uncond + {cfg} × (cond − uncond)
              </div>
              <div style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.65, marginTop: 12 }}>
                Higher values push further toward the conditional prediction — effective up to ~12, then instability sets in.
              </div>
            </div>
          </>
        )}

        {/* ── Tab 4: Samplers & Steps ── */}
        {tab === 4 && (
          <>
            <h2 className="ig-section-title">Sampling Methods</h2>
            <p className="ig-section-sub">The sampler determines how the model steps from noise to image. Different algorithms offer different speed/quality trade-offs.</p>

            <div className="ig-samplers-grid">
              {SAMPLERS.map(s => (
                <div key={s.name} className={`ig-sampler-card${sampler === s.name ? ' active' : ''}`} onClick={() => setSampler(s.name)}>
                  <div className="ig-sampler-name">{s.name}</div>
                  <div className="ig-sampler-desc">{s.desc}</div>
                  <div className="ig-bar-row">
                    <span style={{ width: 46 }}>Speed</span>
                    <div className="ig-bar-bg"><div className="ig-bar-fill" style={{ width: `${s.speed * 20}%`, background: '#34d399' }} /></div>
                  </div>
                  <div className="ig-bar-row">
                    <span style={{ width: 46 }}>Quality</span>
                    <div className="ig-bar-bg"><div className="ig-bar-fill" style={{ width: `${s.quality * 20}%`, background: '#e879f9' }} /></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 12, padding: 22, marginBottom: 14 }}>
              <div style={{ fontSize: 14, color: '#e0e8f0', marginBottom: 12 }}>
                Steps: <strong style={{ color: '#e879f9' }}>{steps}</strong>
                <span style={{ fontSize: 12, color: '#4a6a8a', marginLeft: 10 }}>
                  ({selSampler.name} typical: {selSampler.stepsTypical})
                </span>
              </div>
              <input type="range" min={5} max={100} step={1} value={steps}
                onChange={e => setSteps(+e.target.value)}
                style={{ width: '100%', accentColor: '#e879f9', marginBottom: 10 }} />
              <div style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.5 }}>
                {steps < selSampler.stepsMin
                  ? `⚠️ Too few steps for ${sampler} — image will likely be noisy and incoherent.`
                  : steps <= selSampler.stepsTypical
                  ? `✓ Good range — ${sampler} converges well around ${selSampler.stepsTypical} steps.`
                  : steps <= selSampler.stepsTypical * 2
                  ? `↑ Diminishing returns — little quality gain beyond ${selSampler.stepsTypical} steps.`
                  : `⚠️ Excessive — negligible benefit beyond ${selSampler.stepsTypical * 2} steps for ${sampler}.`}
              </div>
            </div>

            <div style={{ background: '#0d1628', border: '1px solid #1e3048', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e8f0', marginBottom: 8 }}>Which sampler should I use?</div>
              <div style={{ fontSize: 13, color: '#7a9bbf', lineHeight: 1.65 }}>
                Start with <strong style={{ color: '#e879f9' }}>DPM++ 2M</strong> at 25 steps — the current community standard.
                Try <strong style={{ color: '#b0c8e0' }}>Euler a</strong> when you want more variation between generations.
                Use <strong style={{ color: '#b0c8e0' }}>DDIM</strong> when you need deterministic, reproducible outputs from the same seed.
              </div>
            </div>
          </>
        )}

        {/* ── Tab 5: Quiz ── */}
        {tab === 5 && (
          <div className="ig-quiz-wrap">
            <h2 className="ig-section-title">Quiz</h2>
            <p className="ig-section-sub">6 questions · adaptive difficulty · covers diffusion, prompting, CFG, and samplers.</p>

            {!done && currentQ && (
              <>
                <div className="ig-quiz-counter">Question {qNum + 1} / {SESSION_SIZE}</div>
                <div className="ig-quiz-progress">
                  <div className="ig-quiz-progress-fill" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} />
                </div>
                <span className={`ig-diff-badge ${currentQ.difficulty}`}>⬤ {currentQ.difficulty}</span>
                <div className="ig-quiz-q">{currentQ.q}</div>
                {currentQ.opts.map((opt, i) => {
                  let cls = 'ig-quiz-opt'
                  if (chosen !== null) {
                    if (i === currentQ.correct) cls += ' correct'
                    else if (i === chosen && chosen !== currentQ.correct) cls += ' wrong'
                  }
                  return (
                    <button key={i} className={cls} disabled={chosen !== null} onClick={() => handleQuiz(i)}>{opt}</button>
                  )
                })}
                {chosen !== null && (
                  <>
                    <div className="ig-quiz-explanation">{currentQ.explanation}</div>
                    <button className="ig-quiz-next" onClick={nextQ}>{qNum + 1 >= SESSION_SIZE ? 'See Score' : 'Next →'}</button>
                  </>
                )}
              </>
            )}

            {done && (
              <div className="ig-quiz-done">
                <div className="ig-quiz-score">{score}/{SESSION_SIZE}</div>
                <div className="ig-quiz-score-sub">
                  {score >= SESSION_SIZE - 1 ? 'Excellent! You understand image generation well.' :
                   score >= SESSION_SIZE / 2 ? 'Good work — revisit any tabs where you felt uncertain.' :
                   'Keep exploring — try the tabs again and retake the quiz.'}
                </div>
                <button className="ig-quiz-retake" onClick={retake}>↺ Retake Quiz</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
