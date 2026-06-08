import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import {
  ChartLineUpIcon, CalculatorIcon, CoinsIcon, ClockIcon,
  WarningCircleIcon, TrendUpIcon, ArrowRightIcon,
  CopyIcon, CheckIcon, ArrowCounterClockwiseIcon, InfoIcon,
} from '@phosphor-icons/react'

/* ────────────────────────────────────────────────────────────
 * AI ROI calculator — legacy dark theme (#050810, IBM Plex,
 * amber accent #fbbf24). Live-computed; inputs persist to
 * localStorage. No LLM call, no network — Tier 1.
 * ────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'ai-roi-inputs'
const ACCENT = '#fbbf24'

const MODEL_OPTIONS = [
  { id: 'opus',   label: 'Opus 4.8',   input: 5, output: 25 },
  { id: 'sonnet', label: 'Sonnet 4.6', input: 3, output: 15 },
  { id: 'haiku',  label: 'Haiku 4.5',  input: 1, output: 5  },
]

const DEFAULTS = {
  seats: 25,
  tasksPerWeek: 5,
  minutesSaved: 30,
  loadedHourly: 60,
  costMode: 'seat',
  perSeatCost: 30,
  modelId: 'sonnet',
  pricing: {
    opus:   { input: 5, output: 25 },
    sonnet: { input: 3, output: 15 },
    haiku:  { input: 1, output: 5 },
  },
  inTokens: 4000,
  outTokens: 1000,
  caching: false,
  batch: false,
  setupCost: 5000,
  overhead: 20,
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.roi-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Sans', sans-serif; overflow-x: hidden; }

/* Hero */
.roi-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.roi-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 720px; height: 320px;
  background: radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.10) 0%, transparent 70%);
  pointer-events: none;
}
.roi-eyebrow { position: relative; font-size: 13px; letter-spacing: 0.22em; color: ${ACCENT}; text-transform: uppercase; margin-bottom: 14px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
.roi-title { position: relative; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin: 0 0 12px; }
.roi-subtitle { position: relative; font-size: 16px; color: #94a3b8; max-width: 620px; margin: 0 auto; line-height: 1.7; }

/* Tabs */
.roi-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 24px 16px 32px; }
.roi-tab {
  background: transparent;
  border: 1px solid #1e2a3e;
  color: #94a3b8;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.06em;
  padding: 9px 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s;
}
.roi-tab:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
.roi-tab[aria-selected="true"] {
  background: rgba(251,191,36,0.12);
  border-color: ${ACCENT};
  color: ${ACCENT};
  font-weight: 600;
}

/* Shell + section headings */
.roi-shell { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }
.roi-section-title { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 6px; }
.roi-section-sub { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px; max-width: 720px; }
.roi-eyebrow-sm {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${ACCENT};
  font-weight: 600;
  margin-bottom: 10px;
}

/* Card */
.roi-card {
  background: #0a0e18;
  border: 1px solid #1e2a3e;
  border-radius: 12px;
  padding: 22px 24px;
}
.roi-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.roi-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
@media (max-width: 760px) { .roi-grid-2 { grid-template-columns: 1fr; } }

/* Fields */
.roi-fieldset { display: flex; flex-direction: column; gap: 14px; }
.roi-field { display: flex; flex-direction: column; gap: 6px; }
.roi-field-label { font-size: 13px; font-weight: 600; color: #e0e8f0; }
.roi-field-helper { font-size: 12px; color: #6a7e98; line-height: 1.5; }
.roi-input {
  width: 100%;
  box-sizing: border-box;
  background: #050810;
  border: 1px solid #1e2a3e;
  border-radius: 6px;
  color: #e0e8f0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.16s;
}
.roi-input:focus { border-color: ${ACCENT}; box-shadow: 0 0 0 3px rgba(251,191,36,0.20); }
.roi-select {
  width: 100%;
  box-sizing: border-box;
  background: #050810;
  border: 1px solid #1e2a3e;
  border-radius: 6px;
  color: #e0e8f0;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  padding: 9px 12px;
  cursor: pointer;
  outline: none;
}
.roi-select:focus { border-color: ${ACCENT}; }

/* Toggle */
.roi-toggle {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: #050810;
  border: 1px solid #1e2a3e;
  border-radius: 8px;
}
.roi-toggle-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.16s;
}
.roi-toggle-btn[aria-pressed="true"] {
  background: rgba(251,191,36,0.16);
  color: ${ACCENT};
}

/* Checkbox row */
.roi-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #e0e8f0;
}
.roi-check input { accent-color: ${ACCENT}; width: 14px; height: 14px; }
.roi-check-row { display: flex; gap: 18px; flex-wrap: wrap; }

/* Slider */
.roi-slider-wrap { display: flex; flex-direction: column; gap: 6px; }
.roi-slider-top { display: flex; justify-content: space-between; align-items: baseline; }
.roi-slider-val {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  color: ${ACCENT};
  font-weight: 600;
}
.roi-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: #1e2a3e;
  border-radius: 2px;
  cursor: pointer;
  outline: none;
  padding: 0;
  margin: 6px 0;
}
.roi-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${ACCENT};
  border: 0;
  cursor: pointer;
}
.roi-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${ACCENT};
  border: 0;
  cursor: pointer;
}
.roi-slider:focus-visible { outline: 3px solid rgba(251,191,36,0.40); outline-offset: 4px; border-radius: 4px; }

/* Cost-mode block */
.roi-mode-block { display: flex; flex-direction: column; gap: 12px; }

/* Pricing table */
.roi-price-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.roi-price-table th, .roi-price-table td {
  text-align: left;
  padding: 9px 10px;
  border-bottom: 1px solid #1e2a3e;
}
.roi-price-table th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6a7e98;
  font-weight: 600;
}
.roi-price-table td:first-child { color: #e0e8f0; font-weight: 600; }
.roi-price-table tr:last-child td { border-bottom: 0; }
.roi-price-input {
  width: 80px;
  background: #050810;
  border: 1px solid #1e2a3e;
  border-radius: 4px;
  color: #e0e8f0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  padding: 4px 8px;
  outline: none;
}
.roi-price-input:focus { border-color: ${ACCENT}; }

/* Results panel (Tab 1) */
.roi-results { display: flex; flex-direction: column; gap: 18px; }
.roi-result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.roi-result-box {
  background: #050810;
  border: 1px solid #1e2a3e;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.roi-result-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6a7e98;
  font-weight: 600;
}
.roi-result-val {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 20px;
  color: #fff;
  font-weight: 600;
}
.roi-result-box--net { border-color: ${ACCENT}; }
.roi-result-box--net .roi-result-val { color: ${ACCENT}; }
.roi-result-box--neg { border-color: #f87171; }
.roi-result-box--neg .roi-result-val { color: #f87171; }

/* Value vs cost bar */
.roi-vsbar {
  background: #050810;
  border: 1px solid #1e2a3e;
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.roi-vsbar-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6a7e98;
  font-weight: 600;
}
.roi-vsbar-row { display: flex; align-items: center; gap: 10px; }
.roi-vsbar-key { width: 96px; font-size: 12px; color: #94a3b8; }
.roi-vsbar-track { flex: 1; height: 10px; background: #1e2a3e; border-radius: 5px; overflow: hidden; }
.roi-vsbar-fill { height: 100%; border-radius: 5px; transition: width 0.3s; }
.roi-vsbar-fill--val { background: #34d399; }
.roi-vsbar-fill--cost { background: ${ACCENT}; }
.roi-vsbar-amt {
  width: 110px;
  text-align: right;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: #e0e8f0;
}

/* Reset link */
.roi-reset {
  background: transparent;
  border: 0;
  color: #6a7e98;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.roi-reset:hover { color: ${ACCENT}; }

/* Tab 2 — token primer */
.roi-primer { display: flex; flex-direction: column; gap: 14px; }
.roi-primer-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 14px;
  align-items: start;
}
.roi-primer-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: ${ACCENT};
  font-weight: 600;
  padding-top: 2px;
}
.roi-primer-body { font-size: 14px; color: #c0d0e0; line-height: 1.6; }

/* Tab 3 — considerations */
.roi-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.roi-list li {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 8px;
  font-size: 14px;
  color: #c0d0e0;
  line-height: 1.5;
}
.roi-list li::before {
  content: '';
  width: 6px; height: 6px;
  margin-top: 8px;
  border-radius: 50%;
  background: ${ACCENT};
}
.roi-list--green li::before { background: #34d399; }
.roi-honest {
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.32);
  border-radius: 6px;
  padding: 11px 14px;
  font-size: 13px;
  color: #e0e8f0;
  font-style: italic;
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.roi-honest-icon { color: ${ACCENT}; flex-shrink: 0; margin-top: 1px; }

/* Cross-link */
.roi-crosslink {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${ACCENT};
  text-decoration: none;
  margin-top: 8px;
}
.roi-crosslink:hover { text-decoration: underline; text-underline-offset: 3px; }

/* Tab 4 — summary */
.roi-summary-card {
  background: #0a0e18;
  border: 1px solid ${ACCENT};
  border-radius: 12px;
  padding: 24px 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.roi-summary-text {
  font-size: 16px;
  color: #e0e8f0;
  line-height: 1.7;
  margin: 0;
}
.roi-summary-text strong {
  color: ${ACCENT};
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
}
.roi-not-captured {
  background: #050810;
  border: 1px solid #1e2a3e;
  border-radius: 8px;
  padding: 14px 16px;
}
.roi-not-captured-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6a7e98;
  font-weight: 600;
  margin-bottom: 8px;
}
.roi-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${ACCENT};
  border: 1px solid ${ACCENT};
  color: #050810;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 9px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: filter 0.16s;
  align-self: flex-start;
}
.roi-copy-btn:hover { filter: brightness(1.05); }
.roi-copy-btn:focus-visible { outline: 3px solid rgba(251,191,36,0.40); outline-offset: 2px; }
.roi-copy-btn--copied { background: #34d399; border-color: #34d399; color: #02110a; }

/* Block helpers */
.roi-block { display: flex; flex-direction: column; gap: 16px; }
.roi-divider { height: 1px; background: #1e2a3e; margin: 4px 0; }
.roi-cost-readouts {
  display: flex; gap: 18px; flex-wrap: wrap;
  margin-top: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: #c0d0e0;
}
.roi-cost-readouts strong { color: ${ACCENT}; font-weight: 600; }
`

/* ── Helpers ───────────────────────────────────────────────── */

function loadInputs() {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const stored = JSON.parse(raw)
    return { ...DEFAULTS, ...stored, pricing: { ...DEFAULTS.pricing, ...(stored.pricing || {}) } }
  } catch {
    return DEFAULTS
  }
}
function saveInputs(inputs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)) } catch { /* ignore */ }
}

const fmtMoney = (n) => {
  if (!Number.isFinite(n)) return '—'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (abs >= 1000) return `${sign}$${Math.round(abs).toLocaleString()}`
  return `${sign}$${Math.round(abs)}`
}
const fmtMoneyExact = (n) => Number.isFinite(n) ? `$${Math.round(n).toLocaleString()}` : '—'
const fmtPct = (n) => Number.isFinite(n) ? `${Math.round(n)}%` : '—'
const fmtNum1 = (n) => Number.isFinite(n) ? n.toFixed(1) : '—'
const fmtInt  = (n) => Number.isFinite(n) ? Math.round(n).toLocaleString() : '—'

/* ── Page ──────────────────────────────────────────────────── */

const TABS = [
  { id: 1, label: 'ROI calculator' },
  { id: 2, label: 'Token economics' },
  { id: 3, label: 'Key considerations' },
  { id: 4, label: 'Summary' },
]

export default function AiRoi() {
  const [activeTab, setActiveTab] = useState(1)
  const [inputs, setInputs] = useState(loadInputs)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'AI ROI calculator — AI Visual Lab'
  }, [])
  useEffect(() => { saveInputs(inputs) }, [inputs])

  function set(field, value) { setInputs(prev => ({ ...prev, [field]: value })) }
  function setPricing(modelId, key, value) {
    setInputs(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [modelId]: { ...prev.pricing[modelId], [key]: Number(value) || 0 },
      },
    }))
  }
  function reset() { setInputs(DEFAULTS) }

  /* ── Compute outputs ── */
  const calc = useMemo(() => {
    const seats = Math.max(0, Number(inputs.seats) || 0)
    const tasksPerWeek = Math.max(0, Number(inputs.tasksPerWeek) || 0)
    const minutesSaved = Math.max(0, Number(inputs.minutesSaved) || 0)
    const loadedHourly = Math.max(0, Number(inputs.loadedHourly) || 0)
    const overheadPct = Math.min(50, Math.max(0, Number(inputs.overhead) || 0)) / 100
    const setupCost = Math.max(0, Number(inputs.setupCost) || 0)

    const tasksPerMonth = seats * tasksPerWeek * 4.33
    const grossHours = tasksPerMonth * (minutesSaved / 60)
    const netHours = grossHours * (1 - overheadPct)
    const laborValue = netHours * loadedHourly

    // AI cost
    let aiCost = 0
    let costPerTask = 0
    const model = inputs.pricing[inputs.modelId] || DEFAULTS.pricing.sonnet
    const inTok = Math.max(0, Number(inputs.inTokens) || 0)
    const outTok = Math.max(0, Number(inputs.outTokens) || 0)
    if (inputs.costMode === 'seat') {
      aiCost = seats * Math.max(0, Number(inputs.perSeatCost) || 0)
    } else {
      const inputCost  = (inTok / 1e6) * model.input * (inputs.caching ? 0.10 : 1)
      const outputCost = (outTok / 1e6) * model.output
      costPerTask = inputCost + outputCost
      if (inputs.batch) costPerTask *= 0.5
      aiCost = tasksPerMonth * costPerTask
    }

    const netMonthly = laborValue - aiCost
    const monthlyROI = aiCost > 0 ? (netMonthly / aiCost) * 100 : (laborValue > 0 ? Infinity : 0)
    const paybackMonths = netMonthly > 0 ? setupCost / netMonthly : Infinity
    const annualNet = netMonthly * 12 - setupCost

    return {
      tasksPerMonth, grossHours, netHours, laborValue,
      aiCost, costPerTask, netMonthly, monthlyROI, paybackMonths, annualNet,
    }
  }, [inputs])

  const modelLabel = MODEL_OPTIONS.find(m => m.id === inputs.modelId)?.label || 'Sonnet 4.6'
  const costSourceLabel = inputs.costMode === 'seat' ? 'subscription' : modelLabel

  /* ── Summary text (Tab 4) ── */
  const summaryText = useMemo(() => {
    const tpm = fmtInt(calc.tasksPerMonth)
    const hrs = fmtNum1(calc.netHours)
    const lv  = fmtMoneyExact(calc.laborValue)
    const ai  = fmtMoneyExact(calc.aiCost)
    const net = fmtMoneyExact(calc.netMonthly)
    const roi = Number.isFinite(calc.monthlyROI) ? `${Math.round(calc.monthlyROI)}%` : '∞%'
    const setup = fmtMoneyExact(inputs.setupCost)
    const payback = Number.isFinite(calc.paybackMonths)
      ? `${calc.paybackMonths.toFixed(1)} months`
      : 'n/a'
    const annual = fmtMoneyExact(calc.annualNet)
    return (
`At ${fmtInt(inputs.seats)} seats automating ${fmtInt(inputs.tasksPerWeek)} tasks/week (~${tpm}/mo), your team saves ~${hrs} hrs/mo worth ~${lv}. Against ~${ai}/mo in AI cost (${costSourceLabel}), that's a net ~${net}/mo — about ${roi} ROI, paying back the ${setup} setup in ~${payback} (~${annual}/yr).`
    )
  }, [inputs, calc, costSourceLabel])

  function copySummary() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => { /* ignore */ })
  }

  return (
    <div className="roi-root">
      <style>{css}</style>
      <NavBar />

      <section className="roi-hero">
        <div className="roi-eyebrow">Executive AI</div>
        <h1 className="roi-title">AI ROI calculator</h1>
        <p className="roi-subtitle">Model the real dollars-and-cents case for AI — and see what a naive estimate leaves out.</p>
      </section>

      <div className="roi-tabs" role="tablist" aria-label="AI ROI sections">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === activeTab}
            className="roi-tab"
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="roi-shell">
        {/* ── TAB 1 — ROI calculator ── */}
        {activeTab === 1 && (
          <div className="roi-block">
            <div className="roi-grid-2">
              {/* Value side */}
              <div className="roi-card">
                <div className="roi-eyebrow-sm">Value side</div>
                <h2 className="roi-section-title">Hours saved × labor cost</h2>
                <p className="roi-section-sub">The benefit, before any AI cost.</p>
                <div className="roi-fieldset">
                  <NumberField label="Seats adopting AI" value={inputs.seats} onChange={v => set('seats', v)} min={0} max={100000} />
                  <NumberField label="Tasks automated per user per week" value={inputs.tasksPerWeek} onChange={v => set('tasksPerWeek', v)} min={0} max={1000} />
                  <NumberField label="Avg time saved per task (minutes)" value={inputs.minutesSaved} onChange={v => set('minutesSaved', v)} min={0} max={600} />
                  <NumberField label="Loaded hourly labor cost ($)" value={inputs.loadedHourly} onChange={v => set('loadedHourly', v)} min={0} max={1000} />
                </div>
              </div>

              {/* Cost side */}
              <div className="roi-card">
                <div className="roi-eyebrow-sm">Cost side</div>
                <h2 className="roi-section-title">How you pay for AI</h2>
                <p className="roi-section-sub">Subscription seats or per-token usage. Switch to compare.</p>
                <div className="roi-mode-block">
                  <div className="roi-toggle" role="group" aria-label="Cost mode">
                    <button
                      type="button"
                      className="roi-toggle-btn"
                      aria-pressed={inputs.costMode === 'seat'}
                      onClick={() => set('costMode', 'seat')}
                    >
                      Seat-based
                    </button>
                    <button
                      type="button"
                      className="roi-toggle-btn"
                      aria-pressed={inputs.costMode === 'usage'}
                      onClick={() => set('costMode', 'usage')}
                    >
                      Usage-based
                    </button>
                  </div>

                  {inputs.costMode === 'seat' && (
                    <NumberField
                      label="Cost per seat / month ($)"
                      value={inputs.perSeatCost}
                      onChange={v => set('perSeatCost', v)}
                      helper="Use your plan's actual per-seat cost."
                      min={0}
                      max={10000}
                    />
                  )}

                  {inputs.costMode === 'usage' && (
                    <div className="roi-fieldset">
                      <div className="roi-field">
                        <label className="roi-field-label" htmlFor="roi-model">Model</label>
                        <select
                          id="roi-model"
                          className="roi-select"
                          value={inputs.modelId}
                          onChange={e => set('modelId', e.target.value)}
                        >
                          {MODEL_OPTIONS.map(m => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                          ))}
                        </select>
                        <span className="roi-field-helper">Edit any price in the Token economics tab. Defaults are per million tokens, as of June 2026.</span>
                      </div>
                      <div className="roi-grid-3">
                        <NumberField label="Avg input tokens per task" value={inputs.inTokens} onChange={v => set('inTokens', v)} min={0} max={10000000} />
                        <NumberField label="Avg output tokens per task" value={inputs.outTokens} onChange={v => set('outTokens', v)} min={0} max={10000000} />
                      </div>
                      <div className="roi-check-row">
                        <label className="roi-check">
                          <input type="checkbox" checked={inputs.caching} onChange={e => set('caching', e.target.checked)} />
                          Prompt caching (−90% on input)
                        </label>
                        <label className="roi-check">
                          <input type="checkbox" checked={inputs.batch} onChange={e => set('batch', e.target.checked)} />
                          Batch API (−50% all)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Adjustments */}
            <div className="roi-card">
              <div className="roi-eyebrow-sm">Adjustments</div>
              <h2 className="roi-section-title">Setup cost and review overhead</h2>
              <p className="roi-section-sub">One-time investments and the time you spend checking AI output.</p>
              <div className="roi-grid-2">
                <NumberField
                  label="One-time setup / training cost ($)"
                  value={inputs.setupCost}
                  onChange={v => set('setupCost', v)}
                  min={0}
                  max={100000000}
                />
                <Slider
                  label="Review / editing overhead"
                  value={inputs.overhead}
                  onChange={v => set('overhead', v)}
                  min={0}
                  max={50}
                  step={1}
                  unit="%"
                  helper="AI output needs checking — see Key considerations."
                />
              </div>
            </div>

            {/* Results */}
            <div className="roi-card">
              <div className="roi-eyebrow-sm">Live results</div>
              <h2 className="roi-section-title">What the inputs add up to</h2>
              <p className="roi-section-sub">Recomputes as you type.</p>
              <div className="roi-results">
                <div className="roi-result-grid">
                  <ResultBox label="Tasks / month"  value={fmtInt(calc.tasksPerMonth)} />
                  <ResultBox label="Net hours / mo" value={fmtNum1(calc.netHours)} />
                  <ResultBox label="Labor value / mo" value={fmtMoney(calc.laborValue)} />
                  <ResultBox label="AI cost / mo"  value={fmtMoney(calc.aiCost)} />
                  <ResultBox
                    label="Net / month"
                    value={fmtMoney(calc.netMonthly)}
                    variant={calc.netMonthly >= 0 ? 'net' : 'neg'}
                  />
                  <ResultBox
                    label="Monthly ROI"
                    value={Number.isFinite(calc.monthlyROI) ? fmtPct(calc.monthlyROI) : '∞'}
                    variant={calc.netMonthly >= 0 ? 'net' : 'neg'}
                  />
                  <ResultBox
                    label="Payback"
                    value={Number.isFinite(calc.paybackMonths) ? `${calc.paybackMonths.toFixed(1)} mo` : 'n/a'}
                  />
                  <ResultBox
                    label="Annual net"
                    value={fmtMoney(calc.annualNet)}
                    variant={calc.annualNet >= 0 ? 'net' : 'neg'}
                  />
                </div>

                <div className="roi-vsbar" aria-label="Value vs cost">
                  <div className="roi-vsbar-title">Value vs cost — monthly</div>
                  <ValueBarRow
                    label="Labor value"
                    amount={calc.laborValue}
                    max={Math.max(calc.laborValue, calc.aiCost, 1)}
                    variant="val"
                  />
                  <ValueBarRow
                    label="AI cost"
                    amount={calc.aiCost}
                    max={Math.max(calc.laborValue, calc.aiCost, 1)}
                    variant="cost"
                  />
                </div>

                <button type="button" className="roi-reset" onClick={reset}>
                  <ArrowCounterClockwiseIcon size={12} weight="bold" />
                  Reset to defaults
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2 — Token economics ── */}
        {activeTab === 2 && (
          <div className="roi-block">
            <div className="roi-card">
              <div className="roi-eyebrow-sm">Primer</div>
              <h2 className="roi-section-title">Tokens are the unit you pay in</h2>
              <p className="roi-section-sub">Cost is rate × tokens, charged twice — once for input, once for output.</p>
              <div className="roi-primer">
                <div className="roi-primer-row">
                  <span className="roi-primer-tag">INPUT</span>
                  <div className="roi-primer-body">Everything you send the model: your prompt, the system instructions, the file or context you pasted. Big context windows make these add up fast.</div>
                </div>
                <div className="roi-primer-row">
                  <span className="roi-primer-tag">OUTPUT</span>
                  <div className="roi-primer-body">What the model writes back. Output tokens cost ~5× input tokens — output is where the spend concentrates.</div>
                </div>
                <div className="roi-primer-row">
                  <span className="roi-primer-tag">FORMULA</span>
                  <div className="roi-primer-body">cost / task = (input ÷ 1M × input rate) + (output ÷ 1M × output rate). Prompt caching takes 90% off the input portion; the Batch API takes 50% off the total.</div>
                </div>
              </div>
            </div>

            <div className="roi-card">
              <div className="roi-eyebrow-sm">Pricing — editable</div>
              <h2 className="roi-section-title">Per-model rates</h2>
              <p className="roi-section-sub">Prices are per million tokens, as of June 2026. Edit any cell so the calculator stays accurate as prices move.</p>
              <table className="roi-price-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Input $ / MTok</th>
                    <th>Output $ / MTok</th>
                  </tr>
                </thead>
                <tbody>
                  {MODEL_OPTIONS.map(m => (
                    <tr key={m.id}>
                      <td>{m.label}</td>
                      <td>
                        <input
                          className="roi-price-input"
                          type="number"
                          min={0}
                          step={0.1}
                          value={inputs.pricing[m.id]?.input ?? m.input}
                          onChange={e => setPricing(m.id, 'input', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="roi-price-input"
                          type="number"
                          min={0}
                          step={0.1}
                          value={inputs.pricing[m.id]?.output ?? m.output}
                          onChange={e => setPricing(m.id, 'output', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="roi-divider" style={{ margin: '16px 0' }} />

              <div className="roi-eyebrow-sm">Live readouts</div>
              <p className="roi-section-sub" style={{ marginBottom: 10 }}>
                Based on Tab 1 — {fmtInt(inputs.inTokens)} input tokens, {fmtInt(inputs.outTokens)} output tokens per task on <strong style={{ color: ACCENT }}>{modelLabel}</strong>
                {inputs.caching && <> · caching on</>}
                {inputs.batch && <> · batch on</>}.
              </p>
              <div className="roi-cost-readouts">
                <span>Cost / task: <strong>${calc.costPerTask < 0.01 ? calc.costPerTask.toFixed(4) : calc.costPerTask.toFixed(3)}</strong></span>
                <span>Cost / month: <strong>{fmtMoney(calc.aiCost)}</strong></span>
              </div>

              <Link to="/token-optimization" className="roi-crosslink">
                See the mechanics on the Token Optimization page
                <ArrowRightIcon size={12} weight="bold" />
              </Link>
            </div>
          </div>
        )}

        {/* ── TAB 3 — Considerations ── */}
        {activeTab === 3 && (
          <div className="roi-block">
            <div className="roi-honest">
              <span className="roi-honest-icon"><InfoIcon size={16} weight="duotone" /></span>
              <span>A model is only as good as its assumptions — this one names its own blind spots.</span>
            </div>

            <div className="roi-grid-2">
              <div className="roi-card">
                <div className="roi-eyebrow-sm">Costs a naive estimate misses</div>
                <h2 className="roi-section-title">Where the bill actually lands</h2>
                <ul className="roi-list">
                  <li><strong>Review &amp; editing time.</strong> AI output needs checking — drives the overhead slider below.</li>
                  <li><strong>Prompt iteration and ramp-up.</strong> Teams spend real time getting the prompts right and learning the tool.</li>
                  <li><strong>Governance, security &amp; compliance.</strong> Policy work, audit logs, access controls — recurring overhead, not a one-off.</li>
                  <li><strong>Integration &amp; tooling.</strong> Connectors, vector stores, monitoring, evals — the plumbing around the model.</li>
                  <li><strong>Model and version upgrades.</strong> New models change behavior. Each upgrade re-opens testing.</li>
                  <li><strong>Change management.</strong> Roles shift, workflows rewrite, training repeats. People time, not just compute.</li>
                </ul>

                <div className="roi-divider" style={{ margin: '16px 0' }} />

                <Slider
                  label="Review / editing overhead"
                  value={inputs.overhead}
                  onChange={v => set('overhead', v)}
                  min={0}
                  max={50}
                  step={1}
                  unit="%"
                  helper="Shared with Tab 1 — moving it here changes the result there."
                />
              </div>

              <div className="roi-card">
                <div className="roi-eyebrow-sm">Upside that's hard to quantify</div>
                <h2 className="roi-section-title">What doesn't show up in cells</h2>
                <ul className="roi-list roi-list--green">
                  <li><strong>Faster time-to-decision.</strong> Cycles compress. Decisions land earlier in the quarter.</li>
                  <li><strong>Quality and consistency lift.</strong> Fewer drafts to converge; less variance across people doing the same task.</li>
                  <li><strong>Reduced burnout, more capacity.</strong> Time freed up for higher-value work, not just more output of the same.</li>
                  <li><strong>Fewer errors and risk reduction.</strong> Especially in routine review work where a checked draft beats a rushed one.</li>
                  <li><strong>Scaling without linear headcount.</strong> Growth without a proportional hire — the strategic case that the spreadsheet rarely models.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4 — Summary ── */}
        {activeTab === 4 && (
          <div className="roi-block">
            <div className="roi-summary-card">
              <div className="roi-eyebrow-sm">Forwardable summary</div>
              <p className="roi-summary-text">{summaryText}</p>
              <button
                type="button"
                className={`roi-copy-btn${copied ? ' roi-copy-btn--copied' : ''}`}
                onClick={copySummary}
              >
                {copied ? <CheckIcon size={14} weight="bold" /> : <CopyIcon size={14} weight="bold" />}
                {copied ? 'Copied' : 'Copy summary'}
              </button>
            </div>

            <div className="roi-not-captured">
              <div className="roi-not-captured-title">Not captured in this number</div>
              <ul className="roi-list">
                <li>Prompt iteration and team ramp-up time.</li>
                <li>Governance, security, and compliance overhead — recurring, not one-off.</li>
                <li>Integration and tooling around the model (connectors, monitoring, evals).</li>
                <li>Model and version upgrades — each one re-opens testing.</li>
                <li>Change-management cost: roles shifting, workflows rewriting, training repeating.</li>
                <li>Upside — faster decisions, quality lift, burnout relief, error reduction, sub-linear scaling.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ────────────────────────────────────────── */

function NumberField({ label, value, onChange, helper, min, max }) {
  return (
    <div className="roi-field">
      <label className="roi-field-label">{label}</label>
      <input
        className="roi-input"
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => {
          const raw = e.target.value
          if (raw === '') { onChange(0); return }
          const n = Number(raw)
          if (Number.isFinite(n)) onChange(n)
        }}
      />
      {helper && <span className="roi-field-helper">{helper}</span>}
    </div>
  )
}

function Slider({ label, value, onChange, min, max, step, unit, helper }) {
  return (
    <div className="roi-field">
      <div className="roi-slider-wrap">
        <div className="roi-slider-top">
          <span className="roi-field-label">{label}</span>
          <span className="roi-slider-val">{value}{unit || ''}</span>
        </div>
        <input
          className="roi-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        {helper && <span className="roi-field-helper">{helper}</span>}
      </div>
    </div>
  )
}

function ResultBox({ label, value, variant }) {
  const cls = variant === 'net' ? 'roi-result-box roi-result-box--net'
    : variant === 'neg' ? 'roi-result-box roi-result-box--neg'
    : 'roi-result-box'
  return (
    <div className={cls}>
      <span className="roi-result-label">{label}</span>
      <span className="roi-result-val">{value}</span>
    </div>
  )
}

function ValueBarRow({ label, amount, max, variant }) {
  const pct = max > 0 ? Math.min(100, (Math.abs(amount) / max) * 100) : 0
  const fillCls = variant === 'val' ? 'roi-vsbar-fill roi-vsbar-fill--val' : 'roi-vsbar-fill roi-vsbar-fill--cost'
  return (
    <div className="roi-vsbar-row">
      <span className="roi-vsbar-key">{label}</span>
      <div className="roi-vsbar-track">
        <div className={fillCls} style={{ width: `${pct}%` }} aria-hidden="true" />
      </div>
      <span className="roi-vsbar-amt">{fmtMoney(amount)}</span>
    </div>
  )
}
