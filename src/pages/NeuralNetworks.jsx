import { useState, useEffect, useRef, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  PlayIcon, PauseIcon, ArrowCounterClockwiseIcon, ArrowRightIcon, ArrowLeftIcon,
} from '@phosphor-icons/react'

const css = `
/* ── NeuralNetworks rebound to Prism tokens.
 *  Forward pass = blue (structured, predictable); backward / error
 *  flow = orange (correction); positive activations = blue, negative
 *  weights = text-tertiary; feedback palette for quiz. ────────── */

.nn-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); overflow-x: hidden; }

.nn-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .nn-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.nn-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.nn-hero > * { position: relative; }
.nn-eyebrow {
  font: var(--text-weight-label) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--blue-300);
  margin-bottom: var(--spacing-3);
}
.nn-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-3);
}
.nn-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 540px;
  margin: 0 auto;
  opacity: 0.85;
}

.nn-tabs-row {
  display: flex;
  justify-content: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-6);
  background: var(--surface-base);
}

.nn-panel { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }

.nn-section-title {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.nn-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
  max-width: 720px;
}

.nn-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-e2);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}
.nn-card-plain {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}

.nn-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  background: var(--orange-500);
  border: 1px solid var(--orange-500);
  color: #fff;
  font: 600 var(--text-size-body)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.nn-btn:hover { background: #D45C10; border-color: #D45C10; }
.nn-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.nn-btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.nn-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  font: 600 var(--text-size-body)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  margin-left: var(--spacing-2);
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.nn-btn-ghost:hover { background: var(--surface-2); border-color: var(--border-strong); }
.nn-btn-ghost:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

.nn-chip,
.nn-fn-btn,
.nn-lr-btn {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.nn-chip { border-radius: 100px; }
.nn-chip:hover:not(.active),
.nn-fn-btn:hover:not(.active),
.nn-lr-btn:hover:not(.active) {
  background: var(--surface-2);
  border-color: var(--border-strong);
  color: var(--text-primary);
}
.nn-chip.active,
.nn-fn-btn.active,
.nn-lr-btn.active {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--surface-base);
}
.nn-chip:focus-visible,
.nn-fn-btn:focus-visible,
.nn-lr-btn:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.nn-stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--spacing-3); margin: var(--spacing-5) 0; }
.nn-stat-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  text-align: center;
}
.nn-stat-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-2);
}
.nn-stat-value {
  font: var(--text-weight-label) var(--text-size-body)/1.4 var(--font-primary);
  color: var(--text-primary);
}
.nn-bar-bg { background: var(--surface-3); border-radius: 3px; overflow: hidden; height: 6px; margin-top: 4px; }
.nn-bar { height: 100%; border-radius: 3px; background: var(--blue-500); transition: width var(--duration-deliberate) var(--ease-standard); }

.nn-step-desc {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-5);
  min-height: 56px;
}

.nn-formula-box {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-h3);
  color: var(--text-primary);
  text-align: center;
  letter-spacing: 0.05em;
  margin: var(--spacing-4) 0;
}

.nn-gd-stats {
  display: flex;
  gap: var(--spacing-6);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-secondary);
  margin-top: var(--spacing-3);
  flex-wrap: wrap;
}
.nn-gd-stat-val { color: var(--text-primary); font-weight: 600; }

/* Quiz */
.nn-quiz-wrap { max-width: 720px; margin: 0 auto; }
.nn-quiz-progress { display: flex; align-items: center; gap: var(--spacing-3); margin-bottom: var(--spacing-6); }
.nn-quiz-progress-bar-bg { flex: 1; height: 4px; background: var(--surface-3); border-radius: 2px; overflow: hidden; }
.nn-quiz-progress-bar {
  height: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  transition: width var(--duration-standard) var(--ease-standard);
}
.nn-quiz-progress-label {
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  white-space: nowrap;
}
.nn-diff-badge {
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
.nn-diff-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.nn-diff-badge.easy   { color: var(--color-success); border-color: var(--color-success); }
.nn-diff-badge.medium { color: var(--color-warning); border-color: var(--color-warning); }
.nn-diff-badge.hard   { color: var(--color-info);    border-color: var(--color-info); }
.nn-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-5);
}
.nn-quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); margin-bottom: var(--spacing-5); }
.nn-quiz-opt {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  text-align: left;
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.nn-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.nn-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.nn-quiz-opt:disabled { cursor: default; }
.nn-quiz-opt.correct { border-color: var(--color-success); }
.nn-quiz-opt.wrong   { border-color: var(--color-error); }
.nn-quiz-opt.neutral { opacity: 0.55; }
.nn-quiz-explanation {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-5);
}
.nn-quiz-explanation strong { color: var(--text-primary); }
.nn-quiz-done { text-align: center; padding: var(--spacing-7) 0; }
.nn-quiz-done-score {
  font: var(--text-weight-h1) var(--text-size-h1)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.nn-quiz-done-label {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}
`

// ── Network architecture ──────────────────────────────────────────────────────
const NODE_POS = {
  i0: { x: 80,  y: 90  },
  i1: { x: 80,  y: 190 },
  h0: { x: 250, y: 55  },
  h1: { x: 250, y: 140 },
  h2: { x: 250, y: 225 },
  o0: { x: 420, y: 105 },
  o1: { x: 420, y: 175 },
}
const INPUT_IDS  = ['i0','i1']
const HIDDEN_IDS = ['h0','h1','h2']
const OUTPUT_IDS = ['o0','o1']
const ALL_IDS    = [...INPUT_IDS, ...HIDDEN_IDS, ...OUTPUT_IDS]

const EDGES = [
  { from:'i0', to:'h0', w: 0.8  }, { from:'i0', to:'h1', w:-0.5 },
  { from:'i0', to:'h2', w: 0.3  }, { from:'i1', to:'h0', w:-0.4 },
  { from:'i1', to:'h1', w: 0.9  }, { from:'i1', to:'h2', w:-0.7 },
  { from:'h0', to:'o0', w: 0.6  }, { from:'h0', to:'o1', w:-0.3 },
  { from:'h1', to:'o0', w:-0.4  }, { from:'h1', to:'o1', w: 0.7 },
  { from:'h2', to:'o0', w: 0.5  }, { from:'h2', to:'o1', w:-0.6 },
]

// ── Forward pass examples ─────────────────────────────────────────────────────
const EXAMPLES = [
  { label:'Hot & Round', inputs:[0.9, 0.8], hidden:[0.78, 0.92, 0.0], outputs:[0.81, 0.19], predicted:'Class A', confidence:'81%' },
  { label:'Cold & Flat',  inputs:[0.1, 0.2], hidden:[0.0, 0.17, 0.0], outputs:[0.38, 0.62], predicted:'Class B', confidence:'62%' },
  { label:'Warm & Tall',  inputs:[0.6, 0.5], hidden:[0.44, 0.72, 0.0], outputs:[0.61, 0.39], predicted:'Class A', confidence:'61%' },
  { label:'Ambiguous',    inputs:[0.5, 0.5], hidden:[0.37, 0.67, 0.0], outputs:[0.52, 0.48], predicted:'Class A', confidence:'52%' },
]

// ── Activation functions ──────────────────────────────────────────────────────
const ACT_FNS = {
  relu:      { fn: x => Math.max(0, x),            formula:'max(0, x)',     use:'Hidden layers (default)', yMin:-0.5, yMax:4.2 },
  sigmoid:   { fn: x => 1/(1+Math.exp(-x)),         formula:'1/(1+e⁻ˣ)',    use:'Binary output layers',    yMin:-0.1, yMax:1.1 },
  tanh:      { fn: x => Math.tanh(x),               formula:'tanh(x)',       use:'Hidden layers (RNNs)',     yMin:-1.2, yMax:1.2 },
  leakyrelu: { fn: x => x >= 0 ? x : 0.1*x,        formula:'max(0.1x, x)', use:'Avoids dying ReLU',        yMin:-0.5, yMax:4.2 },
}
const ACT_KEYS = ['relu','sigmoid','tanh','leakyrelu']
const ACT_LABELS = { relu:'ReLU', sigmoid:'Sigmoid', tanh:'Tanh', leakyrelu:'Leaky ReLU' }

// ── Gradient descent ──────────────────────────────────────────────────────────
const LR_PRESETS = [
  { label: 'Too small · 0.05', lr: 0.05, color: 'var(--blue-500)' },
  { label: 'Just right · 0.3', lr: 0.3,  color: 'var(--color-success)' },
  { label: 'Too large · 0.9',  lr: 0.9,  color: 'var(--color-error)' },
]
function gdLoss(w) { return Math.pow(w - 2, 2) + 0.5 }
function gdGradient(w) { return 2 * (w - 2) }

// ── Quiz ──────────────────────────────────────────────────────────────────────
const DIFFICULTY_ORDER = ['easy','medium','hard']
const SESSION_SIZE = 6

function bumpDifficulty(current, correct) {
  const idx = DIFFICULTY_ORDER.indexOf(current)
  return correct ? DIFFICULTY_ORDER[Math.min(idx+1,2)] : DIFFICULTY_ORDER[Math.max(idx-1,0)]
}

function pickQuestion(targetDiff, usedIds, pool) {
  let candidates = pool.filter(q => q.difficulty === targetDiff && !usedIds.has(q.id))
  if (!candidates.length) {
    const idx = DIFFICULTY_ORDER.indexOf(targetDiff)
    for (const alt of [DIFFICULTY_ORDER[idx+1], DIFFICULTY_ORDER[idx-1]].filter(Boolean)) {
      candidates = pool.filter(q => q.difficulty === alt && !usedIds.has(q.id))
      if (candidates.length) break
    }
  }
  if (!candidates.length) candidates = pool.filter(q => q.difficulty === targetDiff)
  return candidates[Math.floor(Math.random() * candidates.length)]
}

const QUIZ = [
  { id:0, difficulty:'easy', q:'What does a single artificial neuron compute?', opts:['It stores one piece of training data','It computes a weighted sum of inputs, adds a bias, then applies an activation function','It randomly selects one input to pass forward','It counts how many times it has fired'], correct:1, explanation:'A neuron computes z = Σ(wᵢ·xᵢ) + b, then applies an activation function f(z). The weights determine how much each input contributes, the bias shifts the result, and the activation introduces non-linearity.' },
  { id:1, difficulty:'easy', q:'Why do neural networks use non-linear activation functions like ReLU?', opts:['To make training faster by skipping some neurons','Without non-linearity, stacking layers is equivalent to a single linear transformation — the network cannot learn complex patterns','Non-linear functions use less memory','They prevent the network from memorizing training data'], correct:1, explanation:'If every layer applied only a linear transformation, any depth of composition is still just one linear function. Non-linear activations break this — each layer can learn qualitatively new patterns, enabling the network to approximate arbitrarily complex functions.' },
  { id:2, difficulty:'easy', q:'What does the loss function measure during training?', opts:['The number of neurons that fired','How wrong the network\'s prediction is compared to the true label','The time taken to compute a forward pass','The total number of parameters in the network'], correct:1, explanation:'The loss function quantifies prediction error. A high loss means the network\'s output is far from the correct answer. Training minimizes this loss across all examples by adjusting weights via gradient descent.' },
  { id:3, difficulty:'easy', q:'In a neural network with input, hidden, and output layers — what do hidden layers do?', opts:['They store training data','They transform data into increasingly abstract representations','They compute the final output directly from inputs','They set the learning rate'], correct:1, explanation:'Hidden layers learn intermediate representations. Earlier layers detect simple patterns (edges in images), later layers detect combinations (shapes, objects). This hierarchical feature learning is the core power of deep networks.' },
  { id:4, difficulty:'medium', q:'During a forward pass, activations flow left to right. Which statement is correct?', opts:['Each layer\'s output depends on all future layers','Each layer receives the previous layer\'s activations, applies weights and bias, then passes results forward','All layers compute outputs simultaneously','The forward pass only runs during inference, not training'], correct:1, explanation:'The forward pass is strictly sequential: layer 1 computes from inputs, layer 2 takes those outputs as inputs, etc. During training, these activations are cached because backpropagation needs them to compute gradients.' },
  { id:5, difficulty:'medium', q:'Backpropagation uses the chain rule. What does this enable?', opts:['Gradients skip layers for efficiency','The loss gradient with respect to early-layer weights is computed by multiplying gradients backward through each layer','It chains together multiple training datasets','It creates recurrent connections between layers'], correct:1, explanation:'Chain rule: ∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w. In a deep network, this product flows backward layer by layer. Each layer\'s gradient depends on the next layer\'s gradient — this propagation of error signals is what "backpropagation" means.' },
  { id:6, difficulty:'medium', q:'You\'re training a network and the loss oscillates wildly, sometimes increasing. Most likely cause?', opts:['The network has too few layers','The learning rate is too high — weight updates overshoot the minimum','The batch size is too small','The activation function is ReLU instead of Sigmoid'], correct:1, explanation:'A learning rate that\'s too high causes gradient descent to overshoot. Instead of stepping downhill, updates are so large the optimizer jumps past the minimum and lands higher on the other side. Reducing learning rate by 10× is typically the first fix.' },
  { id:7, difficulty:'medium', q:'A network achieves 99% training accuracy but 61% test accuracy. What is this?', opts:['Underfitting — the network is too simple','Overfitting — the network memorized training examples rather than learning generalizable patterns','Convergence — optimal performance','Regularization — the network is properly constrained'], correct:1, explanation:'Overfitting occurs when a network\'s capacity allows it to memorize training labels rather than learning the underlying distribution. The gap between training and test accuracy is the key signal. Common remedies: dropout, weight decay, early stopping, more data.' },
  { id:8, difficulty:'hard', q:'A 20-layer network using Sigmoid activations trains extremely slowly and early layers barely update. What is happening?', opts:['The learning rate is too small for deep networks','The vanishing gradient problem — Sigmoid\'s derivative is at most 0.25, and multiplying ~0.25 across 20 layers gives gradients near 10⁻¹² in early layers','The network has too many neurons per layer','The batch size is too large'], correct:1, explanation:'Sigmoid\'s max derivative is 0.25. Backpropagating through 20 layers: 0.25²⁰ ≈ 10⁻¹². Gradients this small cause no meaningful weight updates in early layers. ReLU\'s derivative is 1 for positive inputs, preventing exponential decay — this was central to making deep learning practical.' },
  { id:9, difficulty:'hard', q:'Why is mini-batch gradient descent preferred over pure stochastic (single-example) GD in practice?', opts:['Mini-batch uses less memory than SGD','Mini-batch estimates gradients with less noise than SGD while being computationally efficient — and GPU hardware is optimized for batch matrix operations','Mini-batch converges to a better minimum','Mini-batch avoids the need for backpropagation'], correct:1, explanation:'SGD\'s single-example gradients are very noisy. Full-batch GD is stable but slow and memory-intensive. Mini-batch balances both: stable gradient estimates, GPU-friendly matrix operations, and the ability to fit modern datasets in memory.' },
  { id:10, difficulty:'hard', q:'The Universal Approximation Theorem says a single hidden layer can approximate any function. Why do we use deep networks?', opts:['The theorem is wrong — only deep networks can approximate functions','A single wide layer can approximate any function but may need exponentially many neurons; depth achieves the same with exponentially fewer parameters','The theorem only applies to classification tasks','Deep networks train faster than wide shallow ones'], correct:1, explanation:'The UAT guarantees existence but not efficiency. "Wide enough" for complex functions can mean astronomically many neurons. Deep networks reuse and recombine lower-level representations, achieving the same expressive power with far fewer parameters. Depth is computationally efficient.' },
  { id:11, difficulty:'hard', q:'If all weights in a network are initialized to zero, what critical problem occurs?', opts:['The network trains fine but slowly','Symmetry breaking fails — all neurons in a layer compute identical outputs and receive identical gradients, so they all learn the same thing and remain redundant forever','The loss function becomes negative','Backpropagation cannot compute gradients for zero weights'], correct:1, explanation:'With identical weights, every neuron in a layer receives identical inputs, produces identical outputs, and gets identical gradients — they are perfectly symmetric and remain so throughout training. The network behaves as if it has one neuron per layer regardless of stated width. Random initialization (Xavier/He) breaks this symmetry.' },
]

const TABS = ['Overview', 'Forward pass', 'Activations', 'Backprop', 'Gradient descent', 'Quiz']

export default function NeuralNetworks() {
  const [tab, setTab] = useState(0)

  // ── Tab 1: Forward pass state ──────────────────────────────────────────────
  const [fwdExample, setFwdExample] = useState(0)
  const [animStep, setAnimStep] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const animRef = useRef(null)

  // ── Tab 2: Activations state ───────────────────────────────────────────────
  const [activeFn, setActiveFn] = useState('relu')
  const [inputVal, setInputVal] = useState(1.0)

  // ── Tab 3: Backprop state ──────────────────────────────────────────────────
  const [bpStep, setBpStep] = useState(-1)
  const [bpRunning, setBpRunning] = useState(false)
  const bpRef = useRef(null)

  // ── Tab 4: Gradient descent state ─────────────────────────────────────────
  const [lrIdx, setLrIdx] = useState(1)
  const [wPos, setWPos] = useState(-2.0)
  const [history, setHistory] = useState([{w:-2.0, loss:gdLoss(-2.0)}])
  const [isRunning, setIsRunning] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const wRef = useRef(-2.0)
  const gdRef = useRef(null)

  // ── Tab 5: Quiz state ──────────────────────────────────────────────────────
  const nextDiffRef = useRef('easy')
  const [currentQ, setCurrentQ] = useState(null)
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [usedIds, setUsedIds] = useState(new Set())

  useEffect(() => {
    const q = pickQuestion('easy', new Set(), QUIZ)
    setCurrentQ(q)
    setUsedIds(new Set([q.id]))
  }, [])

  // ── NetworkSVG helper ──────────────────────────────────────────────────────
  function NetworkSVG({ animStep, direction = 'forward', exampleIdx = 0 }) {
    const ex = EXAMPLES[exampleIdx]
    const nodeValues = {
      i0: ex.inputs[0], i1: ex.inputs[1],
      h0: ex.hidden[0], h1: ex.hidden[1], h2: ex.hidden[2],
      o0: ex.outputs[0], o1: ex.outputs[1],
    }

    function nodeLayer(id) {
      if (INPUT_IDS.includes(id)) return 0
      if (HIDDEN_IDS.includes(id)) return 1
      return 2
    }

    function nodeActive(id) {
      if (direction === 'forward') {
        const layer = nodeLayer(id)
        return animStep >= layer
      } else {
        const layer = nodeLayer(id)
        const reverseLayer = 2 - layer
        return animStep >= reverseLayer
      }
    }

    function edgeActive(edge) {
      if (direction === 'forward') {
        return animStep >= nodeLayer(edge.from) && animStep >= nodeLayer(edge.to)
      } else {
        return animStep >= (2 - nodeLayer(edge.to)) && animStep >= (2 - nodeLayer(edge.from))
      }
    }

    // Forward sweep reads blue (structured), backward sweep orange (correction).
    const accentColor = direction === 'forward' ? '#3B7DD8' : '#E8641A'
    const negColor = '#8A7E72'

    return (
      <svg viewBox="0 0 500 280" style={{ width: '100%', maxWidth: 500, display: 'block', margin: '0 auto' }}>
        <text x="80"  y="22" textAnchor="middle" fill="#8A7E72" fontSize="12" fontFamily="IBM Plex Mono">Input</text>
        <text x="250" y="22" textAnchor="middle" fill="#8A7E72" fontSize="12" fontFamily="IBM Plex Mono">Hidden</text>
        <text x="420" y="22" textAnchor="middle" fill="#8A7E72" fontSize="12" fontFamily="IBM Plex Mono">Output</text>

        {EDGES.map(e => {
          const from = NODE_POS[e.from], to = NODE_POS[e.to]
          const active = edgeActive(e)
          const positive = e.w > 0
          return (
            <line key={`${e.from}-${e.to}`}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={active ? (positive ? accentColor : negColor) : '#D1C7B8'}
              strokeWidth={active ? Math.abs(e.w) * 4 + 1 : 1}
              opacity={active ? 0.85 : 0.35}
              style={{ transition: 'stroke 0.4s, stroke-width 0.4s, opacity 0.4s' }}
            />
          )
        })}

        {ALL_IDS.map(id => {
          const pos = NODE_POS[id]
          const active = nodeActive(id)
          const val = nodeValues[id]
          // Active fill blends accent into the value's intensity.
          const fillRgba = direction === 'forward'
            ? `rgba(59,125,216,${0.10 + val * 0.55})`
            : `rgba(232,100,26,${0.10 + val * 0.55})`
          return (
            <g key={id}>
              <circle cx={pos.x} cy={pos.y} r={22}
                fill={active ? fillRgba : '#FDFBF8'}
                stroke={active ? accentColor : '#D1C7B8'}
                strokeWidth={active ? 2 : 1}
                style={{ transition: 'fill 0.4s, stroke 0.4s' }}
              />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={active ? '#fff' : '#8A7E72'} fontSize="11" fontFamily="IBM Plex Mono"
                style={{ transition: 'fill 0.4s' }}>
                {active ? val.toFixed(2) : '?'}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  // ── Forward pass controls ──────────────────────────────────────────────────
  function runForwardPass() {
    if (isAnimating) return
    clearTimeout(animRef.current)
    setIsAnimating(true)
    setAnimStep(0)
    animRef.current = setTimeout(() => {
      setAnimStep(1)
      animRef.current = setTimeout(() => {
        setAnimStep(2)
        setIsAnimating(false)
      }, 700)
    }, 700)
  }

  function resetForward() {
    clearTimeout(animRef.current)
    setAnimStep(-1)
    setIsAnimating(false)
  }

  // ── Activation curve helpers ───────────────────────────────────────────────
  function buildCurve(fnKey) {
    const { fn, yMin, yMax } = ACT_FNS[fnKey]
    const W = 400, H = 180
    const xDomain = [-4, 4]
    return Array.from({length:100}, (_, i) => {
      const x = xDomain[0] + (i/99) * (xDomain[1]-xDomain[0])
      const y = fn(x)
      const svgX = (i/99) * W
      const svgY = H - ((y - yMin) / (yMax - yMin)) * H
      return `${svgX},${Math.max(0, Math.min(H, svgY))}`
    }).join(' ')
  }

  function xToSvgX(x) { return ((x - (-4)) / 8) * 400 }
  function yToSvgY(fnKey, y) {
    const { yMin, yMax } = ACT_FNS[fnKey]
    return 180 - ((y - yMin) / (yMax - yMin)) * 180
  }

  // ── Backprop controls ──────────────────────────────────────────────────────
  function runBackprop() {
    if (bpRunning) return
    clearTimeout(bpRef.current)
    setBpRunning(true)
    setBpStep(0)
    bpRef.current = setTimeout(() => {
      setBpStep(1)
      bpRef.current = setTimeout(() => {
        setBpStep(2)
        setBpRunning(false)
      }, 700)
    }, 700)
  }

  function resetBackprop() {
    clearTimeout(bpRef.current)
    setBpStep(-1)
    setBpRunning(false)
  }

  // ── Gradient descent controls ──────────────────────────────────────────────
  function startDescent() {
    setIsRunning(true)
    gdRef.current = setInterval(() => {
      setWPos(prev => {
        const lr = LR_PRESETS[lrIdx].lr
        const grad = gdGradient(prev)
        const next = prev - lr * grad
        wRef.current = next
        setHistory(h => [...h.slice(-20), {w:next, loss:gdLoss(next)}])
        setStepCount(s => s+1)
        if (Math.abs(grad) < 0.01 || Math.abs(next) > 8) {
          clearInterval(gdRef.current)
          setIsRunning(false)
        }
        return next
      })
    }, 400)
  }

  function stopDescent() {
    clearInterval(gdRef.current)
    setIsRunning(false)
  }

  function resetDescent() {
    clearInterval(gdRef.current)
    setIsRunning(false)
    setWPos(-2.0)
    wRef.current = -2.0
    setHistory([{w:-2.0, loss:gdLoss(-2.0)}])
    setStepCount(0)
  }

  function wToX(w) { return 40 + ((w-(-3))/10) * 420 }
  function lToY(l) { return 170 - ((l-0.5)/25) * 160 }

  // ── Quiz handlers ──────────────────────────────────────────────────────────
  function handleQuiz(idx) {
    if (chosen !== null) return
    setChosen(idx)
    const correct = idx === currentQ.correct
    if (correct) setScore(s => s+1)
    const newDiff = bumpDifficulty(currentQ.difficulty, correct)
    nextDiffRef.current = newDiff
    setDifficulty(newDiff)
  }

  function nextQ() {
    if (qNum+1 >= SESSION_SIZE) { setDone(true); return }
    const next = pickQuestion(nextDiffRef.current, usedIds, QUIZ)
    setUsedIds(prev => new Set([...prev, next.id]))
    setCurrentQ(next)
    setQNum(n => n+1)
    setChosen(null)
  }

  function retake() {
    nextDiffRef.current = 'easy'
    const q = pickQuestion('easy', new Set(), QUIZ)
    setCurrentQ(q); setUsedIds(new Set([q.id]))
    setQNum(0); setChosen(null); setScore(0); setDone(false); setDifficulty('easy')
  }

  const curvePoints = useMemo(() => buildCurve(activeFn), [activeFn])
  const dotX = xToSvgX(inputVal)
  const dotY = yToSvgY(activeFn, ACT_FNS[activeFn].fn(inputVal))

  // Parabola points for gradient descent
  const parabolaPoints = useMemo(() => {
    return Array.from({length:100}, (_, i) => {
      const w = -3 + (i/99)*10
      return `${wToX(w)},${lToY(gdLoss(w))}`
    }).join(' ')
  }, [])

  return (
    <div className="nn-root">
      <style>{css}</style>
      <NavBar />

      <header className="nn-hero">
        <div className="nn-eyebrow">Deep learning · Lesson 5</div>
        <h1 className="nn-title">Neural networks</h1>
        <p className="nn-subtitle">Watch signals flow through layers, see how activations fire, and understand how back-propagation trains every weight.</p>
      </header>

      <div className="nn-tabs-row">
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

      {/* ── Panel ────────────────────────────────────────────────────────── */}
      <div className="nn-panel">

        {/* ── Tab 0: Overview ──────────────────────────────────────────────── */}
        {tab === 0 && (
          <div>
            <div className="nn-section-title">What is a neural network?</div>
            <p className="nn-section-sub">A neural network is a stack of layers, each made of simple computing units called neurons. Each neuron takes in numbers, multiplies them by learned weights, adds a bias, and squashes the result through a non-linear function.</p>

            <div className="nn-card" style={{ marginBottom: 'var(--spacing-6)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>Anatomy of a single neuron</div>
              <svg viewBox="0 0 480 160" style={{ width: '100%', maxWidth: 480, display: 'block', margin: '0 auto' }}>
                {[
                  { y: 38, label: 'x₁', wLabel: 'w₁' },
                  { y: 80, label: 'x₂', wLabel: 'w₂' },
                  { y: 122, label: 'x₃', wLabel: 'w₃' },
                ].map(({ y, label, wLabel }) => (
                  <g key={label}>
                    <line x1="30" y1={y} x2="165" y2={y} stroke="#3B7DD8" strokeWidth="1.5" strokeOpacity="0.6" markerEnd="url(#nn-arrow)" />
                    <text x="14" y={y + 4} textAnchor="middle" fill="#3B7DD8" fontSize="13" fontFamily="IBM Plex Mono">{label}</text>
                    <text x="100" y={y - 6} textAnchor="middle" fill="#564C44" fontSize="11" fontFamily="IBM Plex Mono">{wLabel}</text>
                  </g>
                ))}
                <defs>
                  <marker id="nn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 2L8 5L2 8" fill="none" stroke="#3B7DD8" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                  <marker id="nn-arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 2L8 5L2 8" fill="none" stroke="#65E99E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <circle cx="200" cy="80" r="38" fill="rgba(59,125,216,0.1)" stroke="#3B7DD8" strokeWidth="2"/>
                <text x="200" y="76" textAnchor="middle" fill="#1A1714" fontSize="11" fontFamily="IBM Plex Mono">z = Σwᵢxᵢ</text>
                <text x="200" y="90" textAnchor="middle" fill="#1A1714" fontSize="11" fontFamily="IBM Plex Mono">+ b</text>
                <line x1="238" y1="80" x2="310" y2="80" stroke="#65E99E" strokeWidth="2" markerEnd="url(#nn-arrow2)" />
                <rect x="316" y="62" width="60" height="36" rx="6" fill="rgba(101,233,158,0.12)" stroke="#65E99E" strokeWidth="1.5"/>
                <text x="346" y="84" textAnchor="middle" fill="#1A1714" fontSize="13" fontFamily="IBM Plex Mono">f(z)</text>
                <line x1="376" y1="80" x2="440" y2="80" stroke="#65E99E" strokeWidth="2" markerEnd="url(#nn-arrow2)" />
                <text x="455" y="84" textAnchor="middle" fill="#1A1714" fontSize="13" fontFamily="IBM Plex Mono">out</text>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
              <div className="nn-card-plain">
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>What it's inspired by</div>
                <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>Biological neurons fire when their combined input exceeds a threshold. The artificial neuron mimics this — weights model synaptic strength, the bias sets the threshold, and the activation function models whether the neuron fires.</p>
              </div>
              <div className="nn-card-plain">
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>What it actually computes</div>
                <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)', color: 'var(--blue-500)', marginBottom: 'var(--spacing-2)' }}>z = w₁x₁ + w₂x₂ + w₃x₃ + b</div>
                <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)', color: 'var(--color-success)', marginBottom: 'var(--spacing-2)' }}>output = f(z)</div>
                <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>Where f is a non-linear function like ReLU or Sigmoid. Without f, any number of layers collapses to a single linear transformation.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
              {[
                { title: 'Input layer',     tint: 'var(--blue-500)',      desc: 'Receives raw features — pixel values, numerical measurements, or token embeddings. No computation; data enters here.' },
                { title: 'Hidden layer(s)', tint: 'var(--text-primary)',  desc: "Each layer transforms the previous layer's output into a new representation. Earlier layers detect simple patterns; deeper layers combine them into complex features." },
                { title: 'Output layer',    tint: 'var(--color-success)', desc: 'Produces the final prediction — a class probability (Softmax), a continuous value (regression), or a binary decision (Sigmoid). Activation matches the task.' },
              ].map(({ title, tint, desc }) => (
                <div key={title} style={{ background: 'var(--surface-1)', border: `1px solid ${tint}`, borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: tint, marginBottom: 'var(--spacing-2)' }}>{title}</div>
                  <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="nn-card">
              <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>Why depth matters</div>
              <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>
                A single-layer network can only draw linear boundaries. Add one hidden layer and you can approximate any continuous function (Universal Approximation Theorem) — but you may need an exponential number of neurons. Deep networks solve this efficiently: each layer builds on the last, learning increasingly abstract representations with far fewer parameters. A 50-layer network beats a 1-layer network on image recognition not because of more parameters, but because of hierarchical composition.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 1: Forward Pass ───────────────────────────────────────────── */}
        {tab === 1 && (
          <div>
            <div className="nn-section-title">Forward pass</div>
            <p className="nn-section-sub">During inference and training, data flows left to right through the network. Each layer transforms its inputs into activations that become the next layer's inputs.</p>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-5)' }}>
              {EXAMPLES.map((ex, i) => (
                <button key={ex.label} className={`nn-chip${fwdExample === i ? ' active' : ''}`}
                  onClick={() => { setFwdExample(i); resetForward() }}>
                  {ex.label}
                </button>
              ))}
            </div>

            <div className="nn-card-plain" style={{ marginBottom: 'var(--spacing-4)' }}>
              <NetworkSVG animStep={animStep} direction="forward" exampleIdx={fwdExample} />
            </div>

            <div style={{ marginBottom: 'var(--spacing-5)' }}>
              <button className="nn-btn" disabled={isAnimating} onClick={runForwardPass}>
                <PlayIcon size={14} weight="fill" /> Run forward pass
              </button>
              <button className="nn-btn-ghost" onClick={resetForward}>
                <ArrowCounterClockwiseIcon size={14} weight="bold" /> Reset
              </button>
            </div>

            {/* Data panel */}
            {animStep >= 0 && (
              <div className="nn-stat-grid">
                <div className="nn-stat-card">
                  <div className="nn-stat-label">Input x₁</div>
                  <div className="nn-stat-value">{EXAMPLES[fwdExample].inputs[0].toFixed(2)}</div>
                  <div className="nn-bar-bg"><div className="nn-bar" style={{ width:`${EXAMPLES[fwdExample].inputs[0]*100}%` }} /></div>
                </div>
                <div className="nn-stat-card">
                  <div className="nn-stat-label">Input x₂</div>
                  <div className="nn-stat-value">{EXAMPLES[fwdExample].inputs[1].toFixed(2)}</div>
                  <div className="nn-bar-bg"><div className="nn-bar" style={{ width:`${EXAMPLES[fwdExample].inputs[1]*100}%` }} /></div>
                </div>
                {animStep >= 1 && EXAMPLES[fwdExample].hidden.map((h, i) => (
                  <div className="nn-stat-card" key={i}>
                    <div className="nn-stat-label">Hidden h{i}</div>
                    <div className="nn-stat-value">{h.toFixed(2)}</div>
                    <div className="nn-bar-bg"><div className="nn-bar" style={{ width:`${h*100}%` }} /></div>
                  </div>
                ))}
                {animStep >= 2 && (
                  <>
                    <div className="nn-stat-card">
                      <div className="nn-stat-label">Class A</div>
                      <div className="nn-stat-value">{(EXAMPLES[fwdExample].outputs[0] * 100).toFixed(0)}%</div>
                      <div className="nn-bar-bg"><div className="nn-bar" style={{ width: `${EXAMPLES[fwdExample].outputs[0] * 100}%`, background: 'var(--color-success)' }} /></div>
                    </div>
                    <div className="nn-stat-card">
                      <div className="nn-stat-label">Class B</div>
                      <div className="nn-stat-value">{(EXAMPLES[fwdExample].outputs[1] * 100).toFixed(0)}%</div>
                      <div className="nn-bar-bg"><div className="nn-bar" style={{ width: `${EXAMPLES[fwdExample].outputs[1] * 100}%`, background: 'var(--text-tertiary)' }} /></div>
                    </div>
                  </>
                )}
              </div>
            )}

            {animStep >= 2 && (
              <div className="nn-card" style={{ marginTop: 'var(--spacing-3)' }}>
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  Prediction: {EXAMPLES[fwdExample].predicted} · {EXAMPLES[fwdExample].confidence} confidence
                </div>
                <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>
                  Positive weights (blue edges) amplify signals. Negative weights (muted edges) inhibit them. The output layer applies softmax to convert raw scores into probabilities that sum to 1.
                </p>
              </div>
            )}

            {animStep === -1 && (
              <div className="nn-card-plain">
                <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>
                  Select an example above, then click <strong style={{ color: 'var(--text-primary)' }}>Run forward pass</strong> to watch activations propagate through the network layer by layer. Blue edges carry positive weights; muted edges carry negative weights.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Activations ───────────────────────────────────────────── */}
        {tab === 2 && (
          <div>
            <div className="nn-section-title">Activation functions</div>
            <p className="nn-section-sub">Activation functions introduce non-linearity. Without them, any deep network collapses to a single linear transformation — no matter how many layers. Move the slider to see how each function responds to different inputs.</p>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-5)' }}>
              {ACT_KEYS.map(k => (
                <button key={k} className={`nn-fn-btn${activeFn === k ? ' active' : ''}`} onClick={() => setActiveFn(k)}>
                  {ACT_LABELS[k]}
                </button>
              ))}
            </div>

            <div className="nn-card-plain" style={{ marginBottom: 'var(--spacing-4)' }}>
              <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 400, display: 'block', margin: '0 auto' }}>
                <line x1="200" y1="0" x2="200" y2="180" stroke="#D1C7B8" strokeWidth="1" />
                <line x1="0" y1={yToSvgY(activeFn, 0)} x2="400" y2={yToSvgY(activeFn, 0)} stroke="#D1C7B8" strokeWidth="1" />
                <polyline points={curvePoints} fill="none" stroke="#3B7DD8" strokeWidth="2.5" />
                <line x1={dotX} y1="0" x2={dotX} y2="180" stroke="#3B7DD8" strokeWidth="1" strokeDasharray="4,3" opacity="0.55" />
                <circle cx={dotX} cy={Math.max(4, Math.min(176, dotY))} r="5" fill="#3B7DD8" style={{ transition: 'cx 0.15s, cy 0.15s' }} />
                {[-4, -2, 0, 2, 4].map(v => (
                  <text key={v} x={xToSvgX(v)} y="178" textAnchor="middle" fill="#8A7E72" fontSize="10" fontFamily="IBM Plex Mono">{v}</text>
                ))}
              </svg>
            </div>

            <div style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-h3)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-3)' }}>
              f({inputVal.toFixed(1)}) = {ACT_FNS[activeFn].fn(inputVal).toFixed(4)}
            </div>

            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <input
                type="range" min="-4" max="4" step="0.1" value={inputVal}
                onChange={e => setInputVal(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--blue-500)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-size-meta)', color: 'var(--text-tertiary)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', marginTop: 'var(--spacing-1)' }}>
                <span>-4</span><span>0</span><span>4</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-3)' }}>
              {ACT_KEYS.map(k => {
                const af = ACT_FNS[k]
                const pros = { relu: 'No vanishing gradient for positives', sigmoid: 'Output bounded [0,1]', tanh: 'Zero-centred output', leakyrelu: 'Fixes dying ReLU problem' }
                const cons = { relu: 'Dying ReLU for negative inputs', sigmoid: 'Vanishing gradient, slow', tanh: 'Still vanishes for large inputs', leakyrelu: 'α must be tuned' }
                return (
                  <div key={k} className={k === activeFn ? 'nn-card' : 'nn-card-plain'} style={{ marginBottom: 0 }}>
                    <div style={{ font: 'var(--text-weight-label) var(--text-size-caption)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>{ACT_LABELS[k]}</div>
                    <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-meta)', color: 'var(--blue-500)', marginBottom: 'var(--spacing-1)' }}>{af.formula}</div>
                    <div style={{ font: 'var(--text-weight-body) var(--text-size-meta)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>{af.use}</div>
                    <div style={{ font: 'var(--text-weight-body) var(--text-size-meta)/var(--text-lh-body) var(--font-primary)', color: 'var(--color-success)', marginBottom: 2 }}>+ {pros[k]}</div>
                    <div style={{ font: 'var(--text-weight-body) var(--text-size-meta)/var(--text-lh-body) var(--font-primary)', color: 'var(--color-error)' }}>− {cons[k]}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Tab 3: Backprop ──────────────────────────────────────────────── */}
        {tab === 3 && (
          <div>
            <div className="nn-section-title">Back-propagation</div>
            <p className="nn-section-sub">After a forward pass, the network knows how wrong it was. Backprop uses the chain rule to compute how much each weight contributed to that error — then adjusts every weight accordingly.</p>

            <div className="nn-step-desc">
              {bpStep === -1 && "Click 'Run backprop' to see error signals flow backward."}
              {bpStep === 0 && "Step 1 — compute output error: compare prediction to target label."}
              {bpStep === 1 && "Step 2 — propagate error to hidden layer via chain rule: ∂L/∂h = ∂L/∂o · ∂o/∂h."}
              {bpStep === 2 && "Step 3 — propagate to input weights. Every weight now has a gradient and can be updated."}
            </div>

            <div className="nn-card-plain" style={{ marginBottom: 'var(--spacing-4)' }}>
              <NetworkSVG animStep={bpStep} direction="backward" exampleIdx={0} />
            </div>

            <div style={{ marginBottom: 'var(--spacing-5)' }}>
              <button className="nn-btn" disabled={bpRunning} onClick={runBackprop}>
                <ArrowLeftIcon size={14} weight="bold" /> Run backprop
              </button>
              <button className="nn-btn-ghost" onClick={resetBackprop}>
                <ArrowCounterClockwiseIcon size={14} weight="bold" /> Reset
              </button>
            </div>

            <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>The chain rule</div>
            <div className="nn-formula-box">
              <span style={{ color: 'var(--color-error)' }}>∂L/∂w</span>
              {' = '}
              <span style={{ color: bpStep >= 0 ? 'var(--orange-500)' : 'var(--text-tertiary)' }}>∂L/∂a</span>
              {' · '}
              <span style={{ color: bpStep >= 1 ? 'var(--blue-500)' : 'var(--text-tertiary)' }}>∂a/∂z</span>
              {' · '}
              <span style={{ color: bpStep >= 2 ? 'var(--color-success)' : 'var(--text-tertiary)' }}>∂z/∂w</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <div className="nn-card-plain">
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--orange-500)', marginBottom: 'var(--spacing-1)' }}>∂L/∂a — Loss gradient</div>
                <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>How much did this neuron's output contribute to the total loss? Computed at the output layer first.</p>
              </div>
              <div className="nn-card-plain">
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--blue-500)', marginBottom: 'var(--spacing-1)' }}>∂a/∂z — Activation gradient</div>
                <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>The derivative of the activation function. For ReLU: 1 if z &gt; 0, else 0. This is where vanishing gradients can occur with Sigmoid.</p>
              </div>
              <div className="nn-card-plain">
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--color-success)', marginBottom: 'var(--spacing-1)' }}>∂z/∂w — Weight gradient</div>
                <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>Simply the input value xᵢ. The gradient with respect to weight wᵢ equals the activation from the previous layer.</p>
              </div>
              <div className="nn-card-plain">
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--color-error)', marginBottom: 'var(--spacing-1)' }}>Weight update</div>
                <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>w ← w − η · ∂L/∂w</div>
                <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>η (eta) is the learning rate. Too large overshoots; too small converges slowly.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 4: Gradient Descent ───────────────────────────────────────── */}
        {tab === 4 && (
          <div>
            <div className="nn-section-title">Gradient descent</div>
            <p className="nn-section-sub">Training minimises a loss function by repeatedly stepping in the direction of steepest descent. The learning rate controls step size — and getting it right is critical.</p>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-5)' }}>
              {LR_PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  className={`nn-lr-btn${lrIdx === i ? ' active' : ''}`}
                  onClick={() => { setLrIdx(i); resetDescent() }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="nn-card-plain" style={{ marginBottom: 'var(--spacing-4)' }}>
              <svg viewBox="0 0 500 200" style={{ width: '100%', maxWidth: 500, display: 'block', margin: '0 auto' }}>
                <line x1="40" y1="10" x2="40" y2="180" stroke="#D1C7B8" strokeWidth="1.5" />
                <line x1="40" y1="180" x2="470" y2="180" stroke="#D1C7B8" strokeWidth="1.5" />
                <text x="255" y="198" textAnchor="middle" fill="#8A7E72" fontSize="11" fontFamily="IBM Plex Mono">weight w</text>
                <text x="18" y="95" textAnchor="middle" fill="#8A7E72" fontSize="11" fontFamily="IBM Plex Mono" transform="rotate(-90,18,95)">Loss</text>
                <line x1={wToX(2)} y1="10" x2={wToX(2)} y2="180" stroke="#8A7E72" strokeWidth="1" strokeDasharray="4,3" />
                <text x={wToX(2)} y="8" textAnchor="middle" fill="#8A7E72" fontSize="10" fontFamily="IBM Plex Mono">min</text>
                <polyline points={parabolaPoints} fill="none" stroke="#3B7DD8" strokeWidth="2" opacity="0.7" />
                {history.slice(-15).map((h, i) => (
                  <circle key={i} cx={wToX(h.w)} cy={lToY(h.loss)} r="3"
                    fill={LR_PRESETS[lrIdx].color} opacity={0.2 + (i / 15) * 0.4} />
                ))}
                <circle cx={wToX(wPos)} cy={lToY(gdLoss(wPos))} r="7"
                  fill={LR_PRESETS[lrIdx].color}
                  style={{ transition: 'cx 0.35s, cy 0.35s' }}
                />
              </svg>
            </div>

            <div className="nn-gd-stats">
              <span>w = <span className="nn-gd-stat-val">{wPos.toFixed(3)}</span></span>
              <span>Loss = <span className="nn-gd-stat-val">{gdLoss(wPos).toFixed(3)}</span></span>
              <span>Steps: <span className="nn-gd-stat-val">{stepCount}</span></span>
            </div>

            <div style={{ marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
              {!isRunning
                ? <button className="nn-btn" onClick={startDescent} disabled={Math.abs(gdGradient(wPos)) < 0.01}>
                    <PlayIcon size={14} weight="fill" /> Start
                  </button>
                : <button className="nn-btn" onClick={stopDescent}>
                    <PauseIcon size={14} weight="fill" /> Stop
                  </button>
              }
              <button className="nn-btn-ghost" onClick={resetDescent}>
                <ArrowCounterClockwiseIcon size={14} weight="bold" /> Reset
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-3)' }}>
              {[
                { label: 'Too small',  tint: 'var(--blue-500)',      desc: 'Takes many tiny steps toward the minimum. Converges but slowly. May get stuck in local minima or saddle points.' },
                { label: 'Just right', tint: 'var(--color-success)', desc: 'Efficient convergence. Reaches the minimum in a reasonable number of steps without overshooting.' },
                { label: 'Too large',  tint: 'var(--color-error)',   desc: 'Overshoots the minimum on every step. Loss may oscillate or even diverge. The ball bounces past the bottom.' },
              ].map(({ label, tint, desc }) => (
                <div key={label} style={{ background: 'var(--surface-1)', border: `1px solid ${tint}`, borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: tint, marginBottom: 'var(--spacing-1)' }}>{label}</div>
                  <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 5: Quiz ──────────────────────────────────────────────────── */}
        {tab === 5 && (
          <div className="nn-quiz-wrap">
            {done ? (
              <div className="nn-quiz-done">
                <div className="nn-quiz-done-score">{score}/{SESSION_SIZE}</div>
                <div className="nn-quiz-done-label">
                  {score === SESSION_SIZE ? 'You know your neural networks.' :
                   score >= SESSION_SIZE * 0.7 ? 'Solid understanding.' :
                   score >= SESSION_SIZE * 0.5 ? 'Good run. Worth a quick re-read of the tabs you skipped.' :
                   'These take a couple of passes to click. Revisit a tab, then retake.'}
                </div>
                <button className="nn-btn" onClick={retake}>Retake quiz</button>
              </div>
            ) : currentQ ? (
              <div>
                <div className="nn-quiz-progress">
                  <div className="nn-quiz-progress-bar-bg">
                    <div className="nn-quiz-progress-bar" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} />
                  </div>
                  <div className="nn-quiz-progress-label">Question {qNum + 1} of {SESSION_SIZE}</div>
                </div>

                <div className={`nn-diff-badge ${difficulty}`}>{difficulty}</div>

                <div className="nn-quiz-q">{currentQ.q}</div>

                <div className="nn-quiz-opts" role="radiogroup">
                  {currentQ.opts.map((opt, i) => {
                    let cls = 'nn-quiz-opt'
                    if (chosen !== null) {
                      if (i === currentQ.correct) cls += ' correct'
                      else if (i === chosen && chosen !== currentQ.correct) cls += ' wrong'
                      else cls += ' neutral'
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
                  <div className="nn-quiz-explanation">
                    <strong>{chosen === currentQ.correct ? 'Correct.' : 'Not quite.'}</strong> {currentQ.explanation}
                  </div>
                )}

                {chosen !== null && (
                  <button className="nn-btn" onClick={nextQ}>
                    {qNum + 1 >= SESSION_SIZE ? 'See results' : 'Next question'}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  )
}
