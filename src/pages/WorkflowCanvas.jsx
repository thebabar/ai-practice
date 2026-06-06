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
    return { color: '#ef4444', label: 'Keep human' }
  if (automatable === 'maybe' || (automatable === 'yes' && whyHuman === 'creative'))
    return { color: '#eab308', label: 'Partial' }
  if (automatable === 'yes' && (whyHuman === 'not-yet' || whyHuman === 'habit'))
    return { color: '#10b981', label: 'Strong candidate' }
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

// Workflow canvas uses the on-demand orange signal as its primary action accent.
const ACCENT = 'var(--signal-onDemand-500)'

const css = `
*, *::before, *::after { box-sizing: border-box; }

.wf-root { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: var(--surface-base); color: var(--text-primary); position: relative; font-family: var(--font-body); }

/* Toolbar */
.wf-toolbar { height: 54px; background: var(--surface-1); border-bottom: 1px solid var(--border-default); display: flex; align-items: center; padding: 0 20px; gap: 16px; flex-shrink: 0; }
.wf-toolbar-logo { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--text-primary); text-decoration: none; }
.wf-toolbar-logo-icon { width: 28px; height: 28px; background: var(--signal-onDemand-50); border: 1px solid var(--signal-onDemand-100); border-radius: var(--radius-chip); display: flex; align-items: center; justify-content: center; font-size: 14px; }
.wf-toolbar-center { flex: 1; display: flex; justify-content: center; font-family: var(--font-mono); font-size: 12px; color: var(--text-tertiary); }
.wf-btn { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.04em; padding: 6px 14px; border-radius: var(--radius-chip); border: 1px solid; cursor: pointer; transition: all 0.15s; background: none; font-weight: 600; }
.wf-btn-primary { background: ${ACCENT}; color: #fff; border-color: ${ACCENT}; }
.wf-btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
.wf-btn-primary:disabled { opacity: 0.35; cursor: default; }
.wf-btn-ghost { color: var(--text-secondary); border-color: var(--border-default); }
.wf-btn-ghost:hover { color: var(--text-primary); border-color: var(--border-strong); }

/* Canvas row */
.wf-canvas-row { display: flex; flex: 1; overflow: hidden; }

/* Sidebar */
.wf-sidebar { width: 240px; flex-shrink: 0; background: var(--surface-1); border-right: 1px solid var(--border-default); display: flex; flex-direction: column; padding: 16px 12px; gap: 8px; overflow-y: auto; }
.wf-sidebar-title { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-tertiary); padding: 0 4px 8px; border-bottom: 1px solid var(--border-default); margin-bottom: 4px; font-weight: 600; }
.wf-palette-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-chip); border: 1px solid var(--border-default); background: var(--surface-base); cursor: grab; transition: all 0.15s; border-left: 3px solid var(--node-color); user-select: none; }
.wf-palette-item:hover { background: var(--surface-2); border-color: var(--node-color); transform: translateX(2px); }
.wf-palette-item:active { cursor: grabbing; }
.wf-palette-icon { font-size: 18px; flex-shrink: 0; width: 24px; text-align: center; }
.wf-palette-label { font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--text-primary); }
.wf-palette-desc { font-size: 11px; color: var(--text-tertiary); margin-top: 1px; }
.wf-sidebar-hint { font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); line-height: 1.6; padding: 8px 4px; }
.wf-sidebar-divider { height: 1px; background: var(--border-default); margin: 4px 0; }

/* React Flow Controls overrides */
.react-flow__controls { background: var(--surface-1) !important; border: 1px solid var(--border-default) !important; border-radius: var(--radius-chip) !important; box-shadow: var(--shadow-card) !important; }
.react-flow__controls-button { background: var(--surface-base) !important; border-bottom: 1px solid var(--border-default) !important; fill: var(--text-secondary) !important; }
.react-flow__controls-button:hover { background: var(--surface-2) !important; fill: var(--text-primary) !important; }
.react-flow__controls-button svg { fill: inherit !important; }

/* Node styles */
.wf-node { border-radius: var(--radius-card); min-width: 180px; font-family: var(--font-display); box-shadow: var(--shadow-card); background: var(--surface-1); }
.wf-node-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--radius-card) var(--radius-card) 0 0; border-bottom: 1px solid var(--border-default); }
.wf-node-icon { font-size: 16px; flex-shrink: 0; }
.wf-node-label { flex: 1; font-size: 13px; font-weight: 600; color: var(--text-primary); background: transparent; border: none; outline: none; min-width: 0; font-family: var(--font-display); }
.wf-node-body { padding: 10px 14px; background: var(--surface-2); border-radius: 0 0 var(--radius-card) var(--radius-card); }
.wf-node-badge { font-size: 10px; font-family: var(--font-mono); letter-spacing: 0.06em; padding: 2px 7px; border-radius: 100px; font-weight: 600; flex-shrink: 0; }

/* Questionnaire */
.wf-quest { display: flex; flex-direction: column; gap: 10px; padding-top: 8px; }
.wf-quest-label { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; font-family: var(--font-mono); font-weight: 600; }
.wf-quest select { width: 100%; background: var(--surface-base); border: 1px solid var(--border-default); border-radius: var(--radius-chip); color: var(--text-primary); font-size: 13px; padding: 6px 10px; outline: none; font-family: var(--font-body); }
.wf-pill-group { display: flex; gap: 5px; flex-wrap: wrap; }
.wf-pill { font-size: 11px; font-family: var(--font-mono); padding: 4px 10px; border-radius: 100px; border: 1px solid var(--border-default); background: transparent; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
.wf-pill.active-yes { background: var(--color-success-bg); border-color: var(--color-success); color: var(--color-success); }
.wf-pill.active-maybe { background: var(--color-warning-bg); border-color: var(--color-warning); color: var(--color-warning); }
.wf-pill.active-no { background: var(--color-error-bg); border-color: var(--color-error); color: var(--color-error); }
.wf-pill.active-freq { background: var(--color-info-bg); border-color: var(--color-info); color: var(--color-info); }
.wf-quest input[type=number] { width: 70px; background: var(--surface-base); border: 1px solid var(--border-default); border-radius: var(--radius-chip); color: var(--text-primary); font-size: 13px; padding: 5px 8px; outline: none; font-family: var(--font-mono); }

/* Report panel — bottom slide-up */
.wf-report { position: absolute; bottom: 0; left: 0; right: 0; height: 56vh; background: var(--surface-1); border-top: 1px solid var(--border-strong); display: flex; flex-direction: column; z-index: 100; box-shadow: var(--shadow-elevated); }
.wf-report-header { padding: 12px 24px; border-bottom: 1px solid var(--border-default); display: flex; align-items: center; gap: 12px; flex-shrink: 0; background: var(--surface-base); }
.wf-report-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-primary); flex: 1; }
.wf-report-body { padding: 0 24px 24px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; flex: 1; }
/* Summary strip */
.wf-report-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px 0; flex-shrink: 0; }
.wf-stat-box { background: var(--surface-base); border: 1px solid var(--border-default); border-radius: var(--radius-card); padding: 14px 16px; text-align: center; }
.wf-stat-num { font-family: var(--font-display); font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
.wf-stat-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-tertiary); font-weight: 600; }
/* Section title */
.wf-report-section-title { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 10px; border-bottom: 1px solid var(--border-default); padding-bottom: 6px; font-weight: 600; }
/* Task rows */
.wf-task-row { display: grid; grid-template-columns: 1fr 140px 80px 70px 80px; gap: 8px; align-items: center; padding: 10px 12px; background: var(--surface-base); border: 1px solid var(--border-default); border-radius: var(--radius-chip); margin-bottom: 6px; }
.wf-task-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.wf-task-reason { font-size: 11px; color: var(--text-secondary); font-family: var(--font-mono); line-height: 1.4; }
.wf-task-implication { font-size: 11px; color: var(--text-tertiary); font-style: italic; line-height: 1.4; grid-column: 1 / -1; margin-top: 2px; }
.wf-task-meta { font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono); text-align: center; }
.wf-readiness-badge { font-size: 10px; font-family: var(--font-mono); letter-spacing: 0.04em; padding: 3px 8px; border-radius: 100px; font-weight: 600; text-align: center; white-space: nowrap; }
/* Rec items */
.wf-rec-item { font-size: 13px; color: var(--text-secondary); line-height: 1.7; padding: 8px 0; border-bottom: 1px solid var(--border-default); display: flex; gap: 10px; }
.wf-rec-item:last-child { border-bottom: none; }
.wf-rec-num { font-family: var(--font-mono); font-size: 11px; color: ${ACCENT}; flex-shrink: 0; font-weight: 700; padding-top: 2px; }

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
        <span className="wf-report-title">AI readiness report</span>
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
            <div className="wf-report-section-title">Human task analysis</div>
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
            <div className="wf-report-section-title">Estimated time savings</div>
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
            <div className="wf-report-section-title">Recommended next steps</div>
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
          <Link to="/" className="wf-btn wf-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, textDecoration: 'none' }}>
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-info)', background: 'var(--color-info-bg)', border: '1px solid var(--color-info)', borderRadius: 'var(--radius-chip)', padding: '6px 14px' }}>
              👤 {humanTaskNodes.length} human task{humanTaskNodes.length !== 1 ? 's' : ''}
              {aiCandidates > 0 && <span style={{ color: 'var(--color-success)', marginLeft: 8 }}>· {aiCandidates} candidate{aiCandidates !== 1 ? 's' : ''}</span>}
            </span>
          )}
          <button
            className="wf-btn wf-btn-primary"
            disabled={!reportEnabled}
            onClick={() => setShowReport(true)}
            style={{ fontSize: 14, padding: '8px 20px' }}
          >
            Generate report
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
            Clear canvas
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
          style={{ flex: 1, background: 'var(--surface-base)' }}
        >
          <Background color="var(--border-default)" gap={24} size={1} />
          <Controls
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
            }}
          />
          <MiniMap
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
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
