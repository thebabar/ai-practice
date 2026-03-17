import '@xyflow/react/dist/style.css'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  Handle,
  Position,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from '@xyflow/react'

// ─────────────────────────────────────────────────────────────────────────────
// Pure helper functions (module-level, no JSX)
// ─────────────────────────────────────────────────────────────────────────────

const WHY_REASONS = [
  { value: 'judgment',    label: 'Requires judgment / intuition',           implication: 'AI can assist but human judgment is essential' },
  { value: 'compliance',  label: 'Legal or compliance requirement',          implication: 'Human likely required permanently — AI can assist but not replace' },
  { value: 'relationship',label: 'Customer relationship / empathy',          implication: 'Human touch is the value — consider AI for prep work only' },
  { value: 'creative',    label: 'Creative or strategic work',               implication: 'AI can generate options, human makes the final call' },
  { value: 'not-yet',     label: 'Not automated yet (opportunity!)',         implication: 'Strong automation candidate — evaluate data and tool requirements' },
  { value: 'habit',       label: 'Habit — never been questioned (opportunity!)', implication: 'Highest opportunity — this step has never been scrutinized for automation' },
]

function getImplication(whyHuman) {
  return WHY_REASONS.find(r => r.value === whyHuman)?.implication || ''
}

function getWhyLabel(whyHuman) {
  return WHY_REASONS.find(r => r.value === whyHuman)?.label || whyHuman
}

function getReadinessDot(whyHuman, automatable) {
  if (!whyHuman || !automatable) return { color: '#3a4a6a', label: 'Not assessed' }
  if (automatable === 'no' || whyHuman === 'compliance' || whyHuman === 'relationship')
    return { color: '#ef4444', label: 'Keep Human' }
  if (automatable === 'maybe' || (automatable === 'yes' && whyHuman === 'creative'))
    return { color: '#eab308', label: 'Partial' }
  if (automatable === 'yes' && (whyHuman === 'not-yet' || whyHuman === 'habit'))
    return { color: '#10b981', label: 'Strong Candidate' }
  return { color: '#eab308', label: 'Partial' }
}

function getAutomatabilityScore(automatable) {
  if (automatable === 'yes') return 100
  if (automatable === 'maybe') return 50
  return 0
}

function generateReport(nodes) {
  const allHuman = nodes.filter(n => n.type === 'humanTask')
  const analyzed = allHuman.filter(n => n.data.whyHuman && n.data.automatable)
  const scored = analyzed.map(n => {
    const d = n.data
    const score = getAutomatabilityScore(d.automatable)
    const freqMult = d.frequency === 'daily' ? 5 : d.frequency === 'weekly' ? 1 : 0.25
    const weeklyMins = (d.timeMinutes || 0) * freqMult
    const dot = getReadinessDot(d.whyHuman, d.automatable)
    return {
      id: n.id,
      label: d.label || 'Unnamed task',
      whyHuman: d.whyHuman,
      automatable: d.automatable,
      score,
      timeMinutes: d.timeMinutes || 0,
      frequency: d.frequency,
      weeklyMins,
      dot,
      implication: getImplication(d.whyHuman),
    }
  })
  const completed = scored.filter(t => t.score > 0)
  const overallScore = analyzed.length > 0
    ? Math.round(scored.reduce((s, t) => s + t.score, 0) / analyzed.length)
    : 0
  const totalWeeklySavings = completed.reduce((s, t) => s + t.weeklyMins, 0)
  return {
    allTasks: scored,
    totalNodes: nodes.length,
    analyzedCount: analyzed.length,
    overallScore,
    totalWeeklySavings: Math.round(totalWeeklySavings),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Node Components
// ─────────────────────────────────────────────────────────────────────────────

function TriggerNode({ id, data }) {
  const { updateNodeData } = useReactFlow()
  return (
    <div
      className="wf-node"
      style={{ border: '1.5px solid rgba(16,185,129,0.4)', minWidth: 180 }}
    >
      <div
        className="wf-node-header"
        style={{ background: 'rgba(16,185,129,0.15)' }}
      >
        <span className="wf-node-icon">▶</span>
        <input
          className="wf-node-label"
          value={data.label || ''}
          onChange={e => updateNodeData(id, { label: e.target.value })}
          placeholder="Trigger label..."
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#10b981', border: 'none', width: 8, height: 8 }}
      />
    </div>
  )
}

function HumanTaskNode({ id, data }) {
  const { updateNodeData } = useReactFlow()
  const expanded = data.expanded || false
  const dot = getReadinessDot(data.whyHuman, data.automatable)
  const implication = getImplication(data.whyHuman)

  return (
    <div
      className="wf-node"
      style={{ border: '1.5px solid rgba(59,130,246,0.4)', minWidth: 220 }}
    >
      <div
        className="wf-node-header"
        style={{ background: 'rgba(59,130,246,0.15)' }}
      >
        <span className="wf-node-icon">👤</span>
        <input
          className="wf-node-label"
          value={data.label || ''}
          onChange={e => updateNodeData(id, { label: e.target.value })}
          placeholder="Human task..."
        />
        {/* Readiness dot — always visible */}
        <span
          title={dot.label}
          style={{
            width: 9, height: 9, borderRadius: '50%',
            background: dot.color,
            flexShrink: 0,
            boxShadow: `0 0 5px ${dot.color}80`,
          }}
        />
        <button
          onClick={() => updateNodeData(id, { expanded: !expanded })}
          style={{ background: 'none', border: 'none', color: '#4a6a8a', cursor: 'pointer', fontSize: 12, padding: '0 2px', flexShrink: 0 }}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <div className="wf-node-body">
          <div className="wf-quest">
            <div>
              <div className="wf-quest-label">Why is a human needed?</div>
              <select
                value={data.whyHuman || ''}
                onChange={e => updateNodeData(id, { whyHuman: e.target.value })}
              >
                <option value="">Select reason...</option>
                {WHY_REASONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {implication && (
                <div style={{ fontSize: 11, color: '#4a6a8a', marginTop: 5, lineHeight: 1.5, fontStyle: 'italic', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {implication}
                </div>
              )}
            </div>

            <div>
              <div className="wf-quest-label">Could AI handle this?</div>
              <div className="wf-pill-group">
                {['yes', 'maybe', 'no'].map(v => (
                  <button
                    key={v}
                    className={`wf-pill${data.automatable === v ? ` active-${v}` : ''}`}
                    onClick={() => updateNodeData(id, { automatable: v })}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="wf-quest-label">Time per task (mins)</div>
              <input
                type="number"
                value={data.timeMinutes || ''}
                min={1}
                onChange={e => updateNodeData(id, { timeMinutes: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <div className="wf-quest-label">Frequency</div>
              <div className="wf-pill-group">
                {['daily', 'weekly', 'monthly'].map(f => (
                  <button
                    key={f}
                    className={`wf-pill${data.frequency === f ? ' active-freq' : ''}`}
                    onClick={() => updateNodeData(id, { frequency: f })}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6', border: 'none', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6', border: 'none', width: 8, height: 8 }} />
    </div>
  )
}

function AITaskNode({ id, data }) {
  const { updateNodeData } = useReactFlow()
  return (
    <div
      className="wf-node"
      style={{ border: '1.5px solid rgba(249,115,22,0.4)', minWidth: 180 }}
    >
      <div
        className="wf-node-header"
        style={{ background: 'rgba(249,115,22,0.15)' }}
      >
        <span className="wf-node-icon">⚡</span>
        <input
          className="wf-node-label"
          value={data.label || ''}
          onChange={e => updateNodeData(id, { label: e.target.value })}
          placeholder="AI task..."
        />
      </div>
      <div className="wf-node-body">
        <input
          value={data.model || ''}
          onChange={e => updateNodeData(id, { model: e.target.value })}
          placeholder="e.g. GPT-4, Claude"
          style={{
            width: '100%',
            background: '#06080e',
            border: '1px solid #1e2a3a',
            borderRadius: 6,
            color: '#b0c8e0',
            fontSize: 12,
            padding: '5px 8px',
            outline: 'none',
            fontFamily: "'IBM Plex Mono', monospace",
            boxSizing: 'border-box',
          }}
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#f97316', border: 'none', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#f97316', border: 'none', width: 8, height: 8 }}
      />
    </div>
  )
}

function DecisionNode({ id, data }) {
  const { updateNodeData } = useReactFlow()
  return (
    <div style={{ width: 130, height: 130, position: 'relative' }}>
      <div
        style={{
          width: 92,
          height: 92,
          background: 'rgba(234,179,8,0.15)',
          border: '2px solid rgba(234,179,8,0.5)',
          borderRadius: 10,
          transform: 'rotate(45deg)',
          position: 'absolute',
          top: 19,
          left: 19,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <span style={{ fontSize: 16 }}>◆</span>
        <input
          value={data.label || ''}
          onChange={e => updateNodeData(id, { label: e.target.value })}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            textAlign: 'center',
            fontSize: 11,
            color: '#eab308',
            fontFamily: "'IBM Plex Mono', monospace",
            width: 90,
          }}
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#eab308', border: 'none', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        style={{ background: '#10b981', border: 'none', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ background: '#ef4444', border: 'none', width: 8, height: 8 }}
      />
    </div>
  )
}

function ExceptionNode({ id, data }) {
  const { updateNodeData } = useReactFlow()
  return (
    <div
      className="wf-node"
      style={{ border: '1.5px solid rgba(239,68,68,0.4)', minWidth: 180 }}
    >
      <div
        className="wf-node-header"
        style={{ background: 'rgba(239,68,68,0.15)' }}
      >
        <span className="wf-node-icon">⚠</span>
        <input
          className="wf-node-label"
          value={data.label || ''}
          onChange={e => updateNodeData(id, { label: e.target.value })}
          placeholder="Exception label..."
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#ef4444', border: 'none', width: 8, height: 8 }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Edge
// ─────────────────────────────────────────────────────────────────────────────

function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
  selected,
}) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const updateLabel = useCallback(
    (val) => {
      setEdges(eds =>
        eds.map(e => (e.id === id ? { ...e, data: { ...e.data, label: val } } : e))
      )
    },
    [id, setEdges]
  )

  const deleteEdge = useCallback(
    () => setEdges(eds => eds.filter(e => e.id !== id)),
    [id, setEdges]
  )

  const label = data?.label || ''

  return (
    <>
      {/* Wide invisible hit-target so the edge is easy to click */}
      <path d={edgePath} fill="none" stroke="transparent" strokeWidth={20} />
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, stroke: selected ? '#60a5fa' : (style?.stroke || '#3a4a6a') }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
          className="nodrag nopan"
        >
          <input
            value={label}
            onChange={e => updateLabel(e.target.value)}
            placeholder="label"
            style={{
              background: '#0d1628',
              border: `1px solid ${selected ? '#60a5fa' : '#1e2a3a'}`,
              borderRadius: 4,
              color: '#7a9bbf',
              fontSize: 10,
              fontFamily: "'IBM Plex Mono', monospace",
              padding: '2px 6px',
              outline: 'none',
              width: label ? Math.max(44, label.length * 7 + 12) : 36,
              textAlign: 'center',
              cursor: 'text',
            }}
          />
          <button
            onClick={deleteEdge}
            title="Delete connection"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 4,
              color: '#ef4444',
              fontSize: 11,
              lineHeight: 1,
              cursor: 'pointer',
              padding: '2px 5px',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Node / Edge type maps — MUST be outside component to avoid re-renders
// ─────────────────────────────────────────────────────────────────────────────

const NODE_TYPES = {
  trigger: TriggerNode,
  humanTask: HumanTaskNode,
  aiTask: AITaskNode,
  decision: DecisionNode,
  exception: ExceptionNode,
}

const EDGE_TYPES = {
  labeled: LabeledEdge,
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar palette data
// ─────────────────────────────────────────────────────────────────────────────

const PALETTE = [
  { type: 'trigger',   label: 'Trigger',    icon: '▶',  color: '#10b981', desc: 'Start of workflow' },
  { type: 'humanTask', label: 'Human Task', icon: '👤', color: '#3b82f6', desc: 'Requires a person' },
  { type: 'aiTask',    label: 'AI Task',    icon: '⚡', color: '#f97316', desc: 'Automated by AI' },
  { type: 'decision',  label: 'Decision',   icon: '◆',  color: '#eab308', desc: 'Branch condition' },
  { type: 'exception', label: 'Exception',  icon: '⚠',  color: '#ef4444', desc: 'Error / escalation' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Initial nodes
// ─────────────────────────────────────────────────────────────────────────────

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 80, y: 180 },
    data: { label: 'Start Process' },
  },
  {
    id: '2',
    type: 'humanTask',
    position: { x: 300, y: 180 },
    data: {
      label: 'Review Request',
      whyHuman: '',
      automatable: '',
      timeMinutes: 15,
      frequency: 'daily',
      expanded: false,
    },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 540, y: 160 },
    data: { label: 'Approved?' },
  },
  {
    id: '4',
    type: 'aiTask',
    position: { x: 720, y: 100 },
    data: { label: 'Process Automatically', model: 'GPT-4o' },
  },
  {
    id: '5',
    type: 'exception',
    position: { x: 720, y: 260 },
    data: { label: 'Escalate to Manager' },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.wf-root { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: #0d0f18; color: #e0e8f0; position: relative; }

/* Toolbar */
.wf-toolbar { height: 48px; background: #080a12; border-bottom: 1px solid #1a1f2e; display: flex; align-items: center; padding: 0 16px; gap: 16px; flex-shrink: 0; }
.wf-toolbar-logo { display: flex; align-items: center; gap: 8px; font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 600; color: #e0e8f0; text-decoration: none; }
.wf-toolbar-logo-icon { width: 28px; height: 28px; background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.3); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.wf-toolbar-center { flex: 1; display: flex; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #3a4a6a; }
.wf-btn { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.06em; padding: 6px 14px; border-radius: 6px; border: 1px solid; cursor: pointer; transition: all 0.15s; background: none; text-transform: uppercase; }
.wf-btn-primary { color: #f97316; border-color: rgba(249,115,22,0.4); }
.wf-btn-primary:hover:not(:disabled) { background: rgba(249,115,22,0.1); }
.wf-btn-primary:disabled { opacity: 0.35; cursor: default; }
.wf-btn-ghost { color: #4a6a8a; border-color: #1a2a3a; }
.wf-btn-ghost:hover { color: #b0c8e0; border-color: #2a3a5a; }

/* Canvas row */
.wf-canvas-row { display: flex; flex: 1; overflow: hidden; }

/* Sidebar */
.wf-sidebar { width: 240px; flex-shrink: 0; background: #0a0c14; border-right: 1px solid #1a1f2e; display: flex; flex-direction: column; padding: 16px 12px; gap: 8px; overflow-y: auto; }
.wf-sidebar-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #7a9bbf; padding: 0 4px 8px; border-bottom: 1px solid #1a1f2e; margin-bottom: 4px; }
.wf-palette-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; border: 1px solid #1a1f2e; background: #0d0f18; cursor: grab; transition: all 0.15s; border-left: 3px solid var(--node-color); user-select: none; }
.wf-palette-item:hover { background: #131620; border-color: var(--node-color); transform: translateX(2px); }
.wf-palette-item:active { cursor: grabbing; }
.wf-palette-icon { font-size: 18px; flex-shrink: 0; width: 24px; text-align: center; }
.wf-palette-label { font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 600; color: #b0c8e0; }
.wf-palette-desc { font-size: 11px; color: #3a4a6a; margin-top: 1px; }
.wf-sidebar-hint { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #4a6a8a; line-height: 1.6; padding: 8px 4px; }
.wf-sidebar-divider { height: 1px; background: #1a1f2e; margin: 4px 0; }

/* React Flow Controls overrides */
.react-flow__controls { background: #0a0c14 !important; border: 1px solid #2a3a5a !important; border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important; }
.react-flow__controls-button { background: #0d0f18 !important; border-bottom: 1px solid #1a2a3a !important; fill: #7a9bbf !important; }
.react-flow__controls-button:hover { background: #131620 !important; fill: #b0c8e0 !important; }
.react-flow__controls-button svg { fill: inherit !important; }

/* Node styles */
.wf-node { border-radius: 10px; min-width: 180px; font-family: 'IBM Plex Sans', sans-serif; box-shadow: 0 4px 24px rgba(0,0,0,0.4); background: #0d0f18; }
.wf-node-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px 10px 0 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.wf-node-icon { font-size: 16px; flex-shrink: 0; }
.wf-node-label { flex: 1; font-size: 13px; font-weight: 600; color: #e0e8f0; background: transparent; border: none; outline: none; min-width: 0; font-family: 'IBM Plex Sans', sans-serif; }
.wf-node-body { padding: 10px 14px; background: #0d1628; border-radius: 0 0 10px 10px; }
.wf-node-badge { font-size: 10px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 7px; border-radius: 100px; font-weight: 600; flex-shrink: 0; }

/* Questionnaire */
.wf-quest { display: flex; flex-direction: column; gap: 10px; padding-top: 8px; }
.wf-quest-label { font-size: 11px; color: #4a6a8a; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; font-family: 'IBM Plex Mono', monospace; }
.wf-quest select { width: 100%; background: #06080e; border: 1px solid #1e2a3a; border-radius: 6px; color: #b0c8e0; font-size: 13px; padding: 6px 10px; outline: none; font-family: 'IBM Plex Sans', sans-serif; }
.wf-pill-group { display: flex; gap: 5px; flex-wrap: wrap; }
.wf-pill { font-size: 11px; font-family: 'IBM Plex Mono', monospace; padding: 4px 10px; border-radius: 100px; border: 1px solid #1e2a3a; background: transparent; color: #4a6a8a; cursor: pointer; transition: all 0.15s; }
.wf-pill.active-yes { background: rgba(16,185,129,0.15); border-color: #10b981; color: #10b981; }
.wf-pill.active-maybe { background: rgba(234,179,8,0.15); border-color: #eab308; color: #eab308; }
.wf-pill.active-no { background: rgba(239,68,68,0.12); border-color: #ef4444; color: #ef4444; }
.wf-pill.active-freq { background: rgba(59,130,246,0.12); border-color: #3b82f6; color: #3b82f6; }
.wf-quest input[type=number] { width: 70px; background: #06080e; border: 1px solid #1e2a3a; border-radius: 6px; color: #b0c8e0; font-size: 13px; padding: 5px 8px; outline: none; font-family: 'IBM Plex Mono', monospace; }

/* Report panel — bottom slide-up */
.wf-report { position: absolute; bottom: 0; left: 0; right: 0; height: 56vh; background: #0a0c14; border-top: 1px solid #2a3a5a; display: flex; flex-direction: column; z-index: 100; box-shadow: 0 -8px 40px rgba(0,0,0,0.6); }
.wf-report-header { padding: 12px 24px; border-bottom: 1px solid #1a1f2e; display: flex; align-items: center; gap: 12px; flex-shrink: 0; background: #080a12; }
.wf-report-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; color: #e0e8f0; flex: 1; }
.wf-report-body { padding: 0 24px 24px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; flex: 1; }
/* Summary strip */
.wf-report-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px 0; flex-shrink: 0; }
.wf-stat-box { background: #0d0f18; border: 1px solid #1a1f2e; border-radius: 10px; padding: 14px 16px; text-align: center; }
.wf-stat-num { font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
.wf-stat-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #3a4a6a; }
/* Section title */
.wf-report-section-title { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #3a4a6a; margin-bottom: 10px; border-bottom: 1px solid #1a1f2e; padding-bottom: 6px; }
/* Task rows */
.wf-task-row { display: grid; grid-template-columns: 1fr 140px 80px 70px 80px; gap: 8px; align-items: center; padding: 10px 12px; background: #0d0f18; border: 1px solid #1a1f2e; border-radius: 8px; margin-bottom: 6px; }
.wf-task-name { font-size: 13px; font-weight: 600; color: #b0c8e0; }
.wf-task-reason { font-size: 11px; color: #4a6a8a; font-family: 'IBM Plex Mono', monospace; line-height: 1.4; }
.wf-task-implication { font-size: 11px; color: #4a6080; font-style: italic; line-height: 1.4; grid-column: 1 / -1; margin-top: 2px; }
.wf-task-meta { font-size: 11px; color: #3a4a6a; font-family: 'IBM Plex Mono', monospace; text-align: center; }
.wf-readiness-badge { font-size: 10px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; padding: 3px 8px; border-radius: 100px; font-weight: 600; text-align: center; white-space: nowrap; }
/* Rec items */
.wf-rec-item { font-size: 13px; color: #7a9bbf; line-height: 1.7; padding: 8px 0; border-bottom: 1px solid #1a1f2e; display: flex; gap: 10px; }
.wf-rec-item:last-child { border-bottom: none; }
.wf-rec-num { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #f97316; flex-shrink: 0; font-weight: 700; padding-top: 2px; }

/* React Flow overrides */
.react-flow__node { cursor: default; }
.react-flow__handle { z-index: 10; }
`

// ─────────────────────────────────────────────────────────────────────────────
// Report Panel Component
// ─────────────────────────────────────────────────────────────────────────────

function ReportPanel({ nodes, onClose }) {
  const { allTasks, totalNodes, analyzedCount, overallScore, totalWeeklySavings } = generateReport(nodes)

  const scoreColor = overallScore >= 70 ? '#10b981' : overallScore >= 40 ? '#eab308' : '#ef4444'
  const scoreLabel = overallScore >= 70 ? 'High — automation-ready' : overallScore >= 40 ? 'Moderate — partial automation' : 'Low — mostly manual'

  // Recommended next steps from node data
  const steps = []
  allTasks.forEach(t => {
    if ((t.whyHuman === 'habit' || t.whyHuman === 'not-yet') && t.automatable === 'yes')
      steps.push(`Evaluate "${t.label}" for full automation — no compliance or judgment blockers identified`)
    else if (t.automatable === 'maybe')
      steps.push(`Consider AI-assisted "${t.label}" — human review recommended before full automation`)
    else if (t.automatable === 'no' && t.whyHuman === 'compliance')
      steps.push(`"${t.label}" requires human sign-off — explore AI for preparation steps only`)
  })

  const automationTasks = allTasks.filter(t => t.score > 0)

  return (
    <div className="wf-report">
      {/* Header */}
      <div className="wf-report-header">
        <span className="wf-report-title">AI Readiness Report</span>
        <button
          onClick={() => window.print()}
          style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.35)', color: '#f97316', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}
        >
          Export PDF
        </button>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#4a6a8a', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}
        >
          ×
        </button>
      </div>

      <div className="wf-report-body">
        {/* Summary stats strip */}
        <div className="wf-report-stats">
          <div className="wf-stat-box">
            <div className="wf-stat-num" style={{ color: '#b0c8e0' }}>{totalNodes}</div>
            <div className="wf-stat-label">Total Nodes</div>
          </div>
          <div className="wf-stat-box">
            <div className="wf-stat-num" style={{ color: '#3b82f6' }}>{analyzedCount}</div>
            <div className="wf-stat-label">Human Tasks Analyzed</div>
          </div>
          <div className="wf-stat-box">
            <div className="wf-stat-num" style={{ color: scoreColor }}>{analyzedCount > 0 ? `${overallScore}%` : '—'}</div>
            <div className="wf-stat-label">AI Readiness Score</div>
            {analyzedCount > 0 && <div style={{ fontSize: 10, color: scoreColor, marginTop: 3, fontFamily: "'IBM Plex Mono',monospace" }}>{scoreLabel}</div>}
          </div>
        </div>

        {/* Task list */}
        {allTasks.length > 0 && (
          <div>
            <div className="wf-report-section-title">Human Task Analysis</div>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 80px 70px 80px', gap: 8, padding: '0 12px 6px', fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2a3a5a' }}>
              <span>Task</span><span>Why Human</span><span style={{ textAlign: 'center' }}>AI?</span><span style={{ textAlign: 'center' }}>Time</span><span style={{ textAlign: 'center' }}>Readiness</span>
            </div>
            {allTasks.map(t => {
              const autoColor = t.automatable === 'yes' ? '#10b981' : t.automatable === 'maybe' ? '#eab308' : '#ef4444'
              return (
                <div key={t.id} className="wf-task-row">
                  <div>
                    <div className="wf-task-name">{t.label}</div>
                  </div>
                  <div className="wf-task-reason">{getWhyLabel(t.whyHuman)}</div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", padding: '3px 8px', borderRadius: 100, fontWeight: 600, background: `${autoColor}18`, color: autoColor, border: `1px solid ${autoColor}` }}>
                      {t.automatable.charAt(0).toUpperCase() + t.automatable.slice(1)}
                    </span>
                  </div>
                  <div className="wf-task-meta">{t.timeMinutes}m / {t.frequency}</div>
                  <div style={{ textAlign: 'center' }}>
                    <span className="wf-readiness-badge" style={{ background: `${t.dot.color}18`, color: t.dot.color, border: `1px solid ${t.dot.color}` }}>
                      {t.dot.label}
                    </span>
                  </div>
                  <div className="wf-task-implication">{t.implication}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Time savings */}
        {automationTasks.length > 0 && (
          <div>
            <div className="wf-report-section-title">Estimated Time Savings</div>
            {automationTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1a1f2e', fontSize: 13 }}>
                <span style={{ color: '#7a9bbf' }}>{t.label}</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: '#10b981' }}>
                  {t.weeklyMins >= 60
                    ? `${(t.weeklyMins / 60).toFixed(1)} hrs/week`
                    : `${t.weeklyMins} min/week`}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 0', fontSize: 14, fontWeight: 700 }}>
              <span style={{ color: '#e0e8f0' }}>Total weekly savings</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#10b981' }}>
                {totalWeeklySavings >= 60
                  ? `${(totalWeeklySavings / 60).toFixed(1)} hours`
                  : `${totalWeeklySavings} min`}
              </span>
            </div>
          </div>
        )}

        {/* Recommended next steps */}
        {steps.length > 0 && (
          <div>
            <div className="wf-report-section-title">Recommended Next Steps</div>
            {steps.map((s, i) => (
              <div key={i} className="wf-rec-item">
                <span className="wf-rec-num">{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {allTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#3a4a6a', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13 }}>
            Open a Human Task node and fill in the questionnaire to see analysis here.
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main inner component (inside ReactFlowProvider)
// ─────────────────────────────────────────────────────────────────────────────

function WorkflowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showReport, setShowReport] = useState(false)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const onConnect = useCallback(
    params => {
      setEdges(eds =>
        addEdge(
          {
            ...params,
            type: 'labeled',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3a4a6a' },
            style: { stroke: '#3a4a6a', strokeWidth: 2 },
            data: { label: '' },
          },
          eds
        )
      )
    },
    [setEdges]
  )

  const onReconnect = useCallback(
    (oldEdge, newConnection) =>
      setEdges(eds => reconnectEdge(oldEdge, newConnection, eds)),
    [setEdges]
  )

  const onDragOver = useCallback(event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    event => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type || !reactFlowInstance) return
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const defaultData = {
        trigger:   { label: 'Trigger' },
        humanTask: { label: 'Human Task', whyHuman: '', automatable: '', timeMinutes: 10, frequency: 'daily', expanded: false },
        aiTask:    { label: 'AI Task', model: '' },
        decision:  { label: 'Condition?' },
        exception: { label: 'Exception' },
      }
      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { ...(defaultData[type] || { label: type }) },
      }
      setNodes(nds => [...nds, newNode])
    },
    [reactFlowInstance, setNodes]
  )

  const clearCanvas = useCallback(() => {
    setNodes([])
    setEdges([])
    setShowReport(false)
  }, [setNodes, setEdges])

  const humanTaskNodes = nodes.filter(n => n.type === 'humanTask')
  const humanTasksWithData = humanTaskNodes.filter(
    n => n.data.automatable && n.data.automatable !== ''
  )
  const reportEnabled = humanTasksWithData.length > 0

  const aiCandidates = humanTasksWithData.filter(
    n => n.data.automatable === 'yes' || n.data.automatable === 'maybe'
  ).length

  return (
    <div className="wf-root">
      <style>{css}</style>

      {/* Toolbar */}
      <div className="wf-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: '#4a6a8a', textDecoration: 'none', border: '1px solid #1a2a3a', borderRadius: 6, padding: '5px 10px', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#b0c8e0'; e.currentTarget.style.borderColor = '#2a3a5a' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4a6a8a'; e.currentTarget.style.borderColor = '#1a2a3a' }}
          >
            ← Home
          </Link>
          <div className="wf-toolbar-logo">
            <div className="wf-toolbar-logo-icon">⬡</div>
            Workflow Canvas
          </div>
        </div>

        <div className="wf-toolbar-center">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} connection{edges.length !== 1 ? 's' : ''}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {humanTaskNodes.length > 0 && (
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: '#7a9bbf', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, padding: '5px 12px' }}>
              👤 {humanTaskNodes.length} human task{humanTaskNodes.length !== 1 ? 's' : ''}
              {aiCandidates > 0 && <span style={{ color: '#10b981', marginLeft: 8 }}>· {aiCandidates} candidate{aiCandidates !== 1 ? 's' : ''}</span>}
            </span>
          )}
          <button
            className="wf-btn wf-btn-primary"
            disabled={!reportEnabled}
            onClick={() => setShowReport(true)}
            style={{ fontSize: 13, padding: '7px 18px' }}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Canvas row */}
      <div className="wf-canvas-row">
        {/* Sidebar */}
        <div className="wf-sidebar">
          <div className="wf-sidebar-title">Nodes</div>

          {PALETTE.map(item => (
            <div
              key={item.type}
              className="wf-palette-item"
              style={{ '--node-color': item.color }}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', item.type)
                e.dataTransfer.effectAllowed = 'move'
              }}
            >
              <span className="wf-palette-icon">{item.icon}</span>
              <div>
                <div className="wf-palette-label">{item.label}</div>
                <div className="wf-palette-desc">{item.desc}</div>
              </div>
            </div>
          ))}

          <div className="wf-sidebar-divider" />

          <button
            className="wf-btn wf-btn-ghost"
            onClick={clearCanvas}
            style={{ width: '100%', marginTop: 4 }}
          >
            Clear Canvas
          </button>

          <div className="wf-sidebar-hint">
            Drag nodes onto canvas · Connect by dragging from a handle · Click × on a connection to delete it · Drag a connection endpoint to re-route it · Delete/Backspace removes selected nodes
          </div>
        </div>

        {/* React Flow canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
          deleteKeyCode={['Delete', 'Backspace']}
          edgesReconnectable
          onReconnect={onReconnect}
          reconnectRadius={20}
          style={{ flex: 1, background: '#0d0f18' }}
        >
          <Background color="#1e2a3a" gap={24} size={1} />
          <Controls
            style={{
              background: '#0a0c14',
              border: '1px solid #1e2a3a',
              borderRadius: 8,
            }}
          />
          <MiniMap
            style={{
              background: '#0a0c14',
              border: '1px solid #1e2a3a',
              borderRadius: 8,
            }}
            nodeColor={n =>
              ({ trigger: '#10b981', humanTask: '#3b82f6', aiTask: '#f97316', decision: '#eab308', exception: '#ef4444' }[n.type] || '#4a6080')
            }
          />
        </ReactFlow>

      </div>

      {/* Report panel — overlays bottom of canvas */}
      {showReport && (
        <ReportPanel nodes={nodes} onClose={() => setShowReport(false)} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — wrapped in ReactFlowProvider
// ─────────────────────────────────────────────────────────────────────────────

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  )
}
