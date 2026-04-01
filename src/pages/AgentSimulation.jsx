import { useState, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.prism-wrap {
  font-family: 'IBM Plex Sans', sans-serif;
  background: #070e1f;
  color: #c4d8f2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 52px);
  position: relative;
}
.prism-wrap::before {
  content: '';
  position: fixed;
  inset: 0;
  top: 52px;
  background-image:
    linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
  z-index: 0;
}

/* MINI HEADER */
.prism-hdr {
  background: rgba(7,14,31,.96);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #1c3050;
  padding: 0 24px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  z-index: 10;
  position: relative;
}
.prism-logo {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.prism-logo-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prism-logo-icon svg { width: 12px; height: 12px; }
.prism-hdr-div { width: 1px; height: 20px; background: #243e62; }
.prism-hdr-label {
  font-size: 11px;
  color: #3d6080;
  font-family: 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.prism-hdr-title { font-size: 12px; color: #7a9cc4; }
.prism-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.prism-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-family: 'IBM Plex Sans', sans-serif;
  transition: all .15s;
}
.prism-btn svg { width: 12px; height: 12px; }
.prism-btn-outline {
  background: transparent;
  color: #7a9cc4;
  border: 1px solid #243e62;
}
.prism-btn-outline:hover { background: #101e34; color: #c4d8f2; }
.prism-btn-sim {
  background: transparent;
  color: #f59e0b;
  border: 1px solid rgba(245,158,11,.3);
}
.prism-btn-sim:hover { background: rgba(245,158,11,.1); }

/* PIPELINE BAR */
.pipe-bar {
  background: #0b1628;
  border-bottom: 1px solid #1c3050;
  padding: 7px 24px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  z-index: 8;
  position: relative;
  overflow-x: auto;
}
.pipe-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 18px;
  border-right: 1px solid #1c3050;
  flex-shrink: 0;
}
.pipe-stat:first-child { padding-left: 0; }
.pipe-stat:last-child { border-right: none; }
.pipe-icon {
  width: 26px;
  height: 26px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pipe-icon svg { width: 13px; height: 13px; }
.pi-blue  { background: rgba(59,130,246,.12);  border: 1px solid rgba(59,130,246,.2); }
.pi-teal  { background: rgba(20,184,166,.1);   border: 1px solid rgba(20,184,166,.2); }
.pi-amber { background: rgba(245,158,11,.1);   border: 1px solid rgba(245,158,11,.2); }
.pi-red   { background: rgba(239,68,68,.1);    border: 1px solid rgba(239,68,68,.2); }
.pi-violet{ background: rgba(139,92,246,.1);   border: 1px solid rgba(139,92,246,.2); }
.pipe-val { font-size: 13px; font-weight: 600; color: #dde9fa; }
.pipe-lbl { font-size: 10px; color: #3d6080; font-family: 'IBM Plex Mono', monospace; }

/* BODY */
.prism-body { display: flex; flex: 1; overflow: hidden; position: relative; }

/* FLOOR CANVAS */
.floor-col { flex: 1; overflow: auto; padding: 20px 24px 80px; position: relative; }
.floor-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  position: sticky;
  left: 0;
}
.floor-hed {
  font-size: 10px;
  font-family: 'IBM Plex Mono', monospace;
  color: #3d6080;
  text-transform: uppercase;
  letter-spacing: .1em;
}
.legend { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.leg-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #3d6080; }
.leg-dot { width: 8px; height: 8px; border-radius: 2px; }
.floor-canvas { position: relative; width: 680px; margin: 0 auto; }

/* NODES */
.nd { position: absolute; cursor: pointer; transition: transform .15s; }
.nd:hover { transform: scale(1.02); }
.nd.active { transform: scale(1.02); }
.nd-box { border-radius: 8px; padding: 10px 14px; border: 1px solid; }
.nd-agent   { background: #101e34; border-color: #243e62; border-left: 3px solid #3b82f6; }
.nd-entry   { background: rgba(20,184,166,.1);  border-color: rgba(20,184,166,.35); border-left: 3px solid #14b8a6; }
.nd-success { background: rgba(34,197,94,.1);   border-color: rgba(34,197,94,.3);   border-left: 3px solid #22c55e; }
.nd-endpoint{ background: #0b1628; border-color: #1c3050; border-left: 3px solid #64748b; }
.nd-revision{ background: rgba(249,115,22,.1);  border-color: rgba(249,115,22,.3);  border-left: 3px solid #f97316; }
.nd-learning{ background: rgba(139,92,246,.1);  border-color: rgba(139,92,246,.3);  border-left: 3px solid #8b5cf6; }

.nd.active .nd-agent,
.nd.active .nd-entry,
.nd.active .nd-learning { box-shadow: 0 0 0 1px #3b82f6, 0 0 20px rgba(59,130,246,.2); }
.nd.active .nd-success  { box-shadow: 0 0 0 1px #22c55e, 0 0 16px rgba(34,197,94,.18); }
.nd.active .nd-endpoint { box-shadow: 0 0 0 1px #2e5080; }
.nd.active .nd-revision { box-shadow: 0 0 0 1px #f97316, 0 0 16px rgba(249,115,22,.18); }

.nd-title { font-size: 12.5px; font-weight: 600; color: #dde9fa; line-height: 1.3; }
.nd-sub   { font-size: 10px; color: #3d6080; font-family: 'IBM Plex Mono', monospace; margin-top: 2px; }
.nd-zone  {
  display: inline-block;
  font-size: 9px;
  color: #3d6080;
  border: 1px solid #1c3050;
  border-radius: 10px;
  padding: 1px 7px;
  margin-top: 5px;
}
.nd-badges { display: flex; gap: 4px; margin-top: 5px; flex-wrap: wrap; }
.nd-badge  {
  font-size: 8.5px;
  font-family: 'IBM Plex Mono', monospace;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 700;
}
.nb-latency-fast  { background: rgba(34,197,94,.1);  color: #4ade80; border: 1px solid rgba(34,197,94,.2); }
.nb-latency-med   { background: rgba(245,158,11,.1); color: #fbbf24; border: 1px solid rgba(245,158,11,.2); }
.nb-latency-slow  { background: rgba(239,68,68,.1);  color: #f87171; border: 1px solid rgba(239,68,68,.2); }
.nb-latency-human { background: rgba(100,116,139,.1);color: #94a3b8; border: 1px solid rgba(100,116,139,.2); }
.nb-cost-lo  { background: rgba(34,197,94,.1);  color: #4ade80; border: 1px solid rgba(34,197,94,.2); }
.nb-cost-mid { background: rgba(245,158,11,.1); color: #fbbf24; border: 1px solid rgba(245,158,11,.2); }
.nb-cost-hi  { background: rgba(239,68,68,.1);  color: #f87171; border: 1px solid rgba(239,68,68,.2); }
.nb-risk-lo   { background: rgba(34,197,94,.1);  color: #4ade80; border: 1px solid rgba(34,197,94,.2); }
.nb-risk-med  { background: rgba(245,158,11,.1); color: #fbbf24; border: 1px solid rgba(245,158,11,.2); }
.nb-risk-hi   { background: rgba(249,115,22,.1); color: #fb923c; border: 1px solid rgba(249,115,22,.2); }
.nb-risk-crit { background: rgba(239,68,68,.1);  color: #f87171; border: 1px solid rgba(239,68,68,.2); }

/* DIAMOND DECISION NODE */
.nd-decision { position: absolute; cursor: pointer; transition: transform .15s; }
.nd-decision:hover { transform: rotate(45deg) scale(1.06) !important; }
.nd-decision.active { transform: rotate(45deg) scale(1.06) !important; }
.diamond-wrap { width: 96px; height: 96px; display: flex; align-items: center; justify-content: center; }
.diamond-shape {
  width: 80px;
  height: 80px;
  background: rgba(245,158,11,.1);
  border: 1.5px solid rgba(245,158,11,.5);
  border-radius: 6px;
  transform: rotate(45deg);
  transition: all .2s;
}
.nd-decision:hover .diamond-shape,
.nd-decision.active .diamond-shape {
  background: rgba(245,158,11,.18);
  box-shadow: 0 0 0 1px #f59e0b, 0 0 18px rgba(245,158,11,.25);
}
.diamond-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 10px;
  font-weight: 600;
  color: #f59e0b;
  text-align: center;
  white-space: nowrap;
  line-height: 1.3;
  pointer-events: none;
}

/* SIM PULSE */
.sim-pulse {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
  display: none;
  z-index: 5;
}
.sim-pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  animation: pulse-ring 1.4s infinite;
}
@keyframes pulse-ring {
  0%   { opacity: .8; transform: scale(1); }
  100% { opacity: 0;  transform: scale(2.4); }
}
.nd.sim-on .sim-pulse,
.nd-decision.sim-on .sim-pulse { display: block; }

/* DETAIL PANEL */
.detail-col {
  width: 380px;
  flex-shrink: 0;
  border-left: 1px solid #1c3050;
  overflow-y: auto;
  background: #070e1f;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}
.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  text-align: center;
  padding: 32px;
  opacity: .7;
}
.de-icon {
  width: 44px;
  height: 44px;
  background: #101e34;
  border: 1px solid #243e62;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.de-icon svg { width: 18px; height: 18px; }
.de-title { font-size: 13px; color: #7a9cc4; font-weight: 500; }
.de-sub   { font-size: 12px; color: #3d6080; line-height: 1.6; max-width: 200px; }

.detail-body { padding: 20px; }
.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 10px;
}
.tb-agent    { background: rgba(59,130,246,.12); color: #3b82f6; border: 1px solid rgba(59,130,246,.3); }
.tb-decision { background: rgba(245,158,11,.1);  color: #f59e0b; border: 1px solid rgba(245,158,11,.3); }
.tb-entry    { background: rgba(20,184,166,.1);  color: #14b8a6; border: 1px solid rgba(20,184,166,.3); }
.tb-endpoint { background: rgba(100,116,139,.12);color: #64748b; border: 1px solid rgba(100,116,139,.3); }
.tb-success  { background: rgba(34,197,94,.1);   color: #22c55e; border: 1px solid rgba(34,197,94,.3); }
.tb-learning { background: rgba(139,92,246,.1);  color: #8b5cf6; border: 1px solid rgba(139,92,246,.3); }
.tb-revision { background: rgba(249,115,22,.1);  color: #f97316; border: 1px solid rgba(249,115,22,.3); }

.d-name { font-size: 17px; font-weight: 700; color: #dde9fa; line-height: 1.25; margin-bottom: 3px; }
.d-sub  { font-size: 11px; color: #3d6080; font-family: 'IBM Plex Mono', monospace; margin-bottom: 14px; }
.d-desc {
  font-size: 12.5px;
  color: #7a9cc4;
  line-height: 1.7;
  padding: 11px 13px;
  background: #0b1628;
  border-radius: 6px;
  border-left: 3px solid #243e62;
  margin-bottom: 16px;
}
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 18px; }
.io-box  { background: #0b1628; border: 1px solid #1c3050; border-radius: 6px; padding: 9px 11px; }
.io-lbl  {
  font-size: 9.5px;
  font-family: 'IBM Plex Mono', monospace;
  color: #3d6080;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 6px;
}
.io-item {
  font-size: 11.5px;
  color: #7a9cc4;
  padding: 2px 0;
  display: flex;
  align-items: flex-start;
  gap: 5px;
  line-height: 1.4;
}
.io-item::before { content: '›'; color: #3d6080; font-size: 13px; margin-top: -1px; flex-shrink: 0; }

/* DETAIL TABS */
.dtabs {
  display: flex;
  gap: 2px;
  background: #0b1628;
  border: 1px solid #1c3050;
  border-radius: 8px;
  padding: 3px;
  margin-bottom: 14px;
}
.dtab {
  flex: 1;
  padding: 7px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  color: #3d6080;
  transition: all .15s;
  border: none;
  background: transparent;
  font-family: 'IBM Plex Sans', sans-serif;
}
.dtab.on { background: #101e34; color: #c4d8f2; border: 1px solid #243e62; }

/* QUESTIONS */
.q-list { display: flex; flex-direction: column; gap: 7px; }
.q-item {
  padding: 9px 11px;
  background: #0b1628;
  border: 1px solid #1c3050;
  border-radius: 6px;
  font-size: 12.5px;
  color: #7a9cc4;
  line-height: 1.55;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.q-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  color: #3d6080;
  background: #101e34;
  border: 1px solid #243e62;
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  margin-top: 1px;
  flex-shrink: 0;
}

/* RISKS */
.r-list { display: flex; flex-direction: column; gap: 7px; }
.r-item { padding: 9px 11px; background: #0b1628; border: 1px solid #1c3050; border-radius: 6px; }
.r-hdr  { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
.r-name { font-size: 12.5px; font-weight: 600; color: #dde9fa; }
.sev { padding: 2px 8px; border-radius: 10px; font-size: 9.5px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; }
.sev-critical { background: rgba(239,68,68,.1);  color: #ef4444; border: 1px solid rgba(239,68,68,.3); }
.sev-high     { background: rgba(249,115,22,.1); color: #f97316; border: 1px solid rgba(249,115,22,.3); }
.sev-medium   { background: rgba(245,158,11,.1); color: #f59e0b; border: 1px solid rgba(245,158,11,.3); }
.sev-low      { background: rgba(100,116,139,.1);color: #64748b; border: 1px solid rgba(100,116,139,.3); }
.r-note { font-size: 12px; color: #7a9cc4; line-height: 1.5; }

/* METRICS */
.m-section { margin-bottom: 14px; }
.m-section-title {
  font-size: 9.5px;
  font-family: 'IBM Plex Mono', monospace;
  color: #3d6080;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.m-section-title svg { width: 11px; height: 11px; }
.m-card {
  background: #0b1628;
  border: 1px solid #1c3050;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 7px;
}
.m-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
.m-row:last-child { margin-bottom: 0; }
.m-key { font-size: 11.5px; color: #7a9cc4; }
.m-val { font-size: 11.5px; font-weight: 600; color: #dde9fa; font-family: 'IBM Plex Mono', monospace; }
.m-note { font-size: 11px; color: #3d6080; line-height: 1.5; margin-top: 5px; padding-top: 5px; border-top: 1px solid #1c3050; }
.bar-wrap  { height: 5px; background: #1c3050; border-radius: 3px; overflow: hidden; margin: 4px 0 2px; flex: 1; }
.bar-fill  { height: 100%; border-radius: 3px; transition: width .4s ease; }
.bf-green  { background: #22c55e; }
.bf-amber  { background: #f59e0b; }
.bf-orange { background: #f97316; }
.bf-red    { background: #ef4444; }
.bf-blue   { background: #3b82f6; }
.bar-label { font-size: 10px; color: #3d6080; font-family: 'IBM Plex Mono', monospace; }
.latency-grid    { display: grid; grid-template-columns: 38px 1fr 42px; gap: 4px 8px; align-items: center; margin-bottom: 2px; }
.token-bar-row   { display: grid; grid-template-columns: 44px 1fr 50px;  gap: 4px 8px; align-items: center; margin-bottom: 2px; }
.risk-gauge-wrap { position: relative; height: 8px; background: #1c3050; border-radius: 4px; overflow: hidden; margin: 6px 0 4px; }
.risk-gauge-fill { height: 100%; border-radius: 4px; transition: width .5s ease; }
.risk-score-row  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.risk-score-big  { font-size: 22px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
.risk-driver-list{ display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
.risk-driver {
  font-size: 11px;
  color: #7a9cc4;
  padding: 4px 8px;
  background: #101e34;
  border-radius: 4px;
  border-left: 2px solid #2e5080;
  line-height: 1.4;
}
.human-note {
  font-size: 11px;
  color: #64748b;
  padding: 8px 10px;
  background: rgba(100,116,139,.06);
  border: 1px solid rgba(100,116,139,.2);
  border-radius: 5px;
  line-height: 1.5;
  text-align: center;
  margin-top: 4px;
}

/* SIM BAR */
.sim-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 380px;
  background: #0b1628;
  border-top: 1px solid #1c3050;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 8;
}
.sim-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-family: 'IBM Plex Sans', sans-serif;
  transition: all .15s;
}
.sim-btn svg { width: 12px; height: 12px; }
.sb-stop { background: #101e34; color: #7a9cc4; border: 1px solid #243e62; }
.sb-stop:hover { background: #162440; }
.sb-step { background: #101e34; color: #7a9cc4; border: 1px solid #243e62; }
.sb-step:hover { background: #162440; }
.sim-prog-wrap { flex: 1; }
.sim-prog-lbl  { font-size: 11px; color: #3d6080; font-family: 'IBM Plex Mono', monospace; margin-bottom: 4px; }
.sim-prog      { height: 3px; background: #1c3050; border-radius: 2px; overflow: hidden; }
.sim-prog-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius: 2px; transition: width .5s ease; }
.sim-node-lbl  { font-size: 11.5px; color: #7a9cc4; min-width: 170px; font-family: 'IBM Plex Mono', monospace; }

::-webkit-scrollbar       { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #243e62; border-radius: 3px; }
`

// ── SCENARIO DATA ─────────────────────────────────────────────────────────────
const SCENARIO = {
  name: 'Sales AI Pipeline',
  nodes: [
    {
      id: 'lead_intake', type: 'entry', label: 'Lead Intake', sub: 'Entry Point', zone: 'Intake Zone',
      cx: 240, cy: 55, w: 200, h: 72,
      desc: "Receives raw prospect data from CRM imports, web forms, LinkedIn, and API feeds. Normalises, deduplicates, and stamps each record before passing downstream. This is where data quality is either set up for success — or quietly sabotaged.",
      inputs: ['CRM export', 'Web form fills', 'LinkedIn enrichment', 'Manual entry'],
      outputs: ['Normalised lead record', 'Duplicate flags', 'Validation status'],
      questions: [
        'What data sources feed into this intake point, and are they all trusted?',
        'How do we handle duplicate leads arriving from multiple sources simultaneously?',
        'What minimum required fields must exist before the agent can proceed?',
        "Who owns the lead data quality standard — and is it documented?"
      ],
      risks: [
        { label: 'Garbage In / Garbage Out', sev: 'high', note: 'Poor input data propagates silently through all downstream agents, producing convincing but worthless output.' },
        { label: 'Missing Required Fields', sev: 'medium', note: 'Agents may infer or fabricate missing data rather than surfacing a clear gap to a human.' },
        { label: 'PII Handling from Day One', sev: 'high', note: 'Personal data must be scoped to GDPR / CCPA from intake, not retrofitted later.' }
      ]
    },
    {
      id: 'research', type: 'agent', label: 'Research Agent', sub: 'Intelligence Gathering', zone: 'Intelligence Zone',
      cx: 240, cy: 165, w: 200, h: 72,
      desc: "Autonomously gathers company intelligence from approved public sources: news, LinkedIn, Crunchbase, company websites, SEC filings. Enriches the lead record with org size, tech stack, recent events, and decision-maker contacts.",
      inputs: ['Lead record', 'Search & scraping APIs', 'Internal knowledge base'],
      outputs: ['Enriched company profile', 'Key contacts list', 'Confidence score', 'Source citations'],
      questions: [
        'Which data sources are licensed for automated scraping — and which are legally off-limits?',
        'How do we verify that scraped facts are accurate before they influence downstream scoring?',
        'What is the token / cost budget per research run — and what triggers a "good enough" stop?',
        'How fresh does the data need to be — and how do we detect stale cache hits?'
      ],
      risks: [
        { label: 'Hallucinated Company Facts', sev: 'critical', note: 'LLMs readily fabricate headcount, funding rounds, and leadership names if grounding data is thin.' },
        { label: 'Scraping Blocks & Rate Limits', sev: 'medium', note: 'Target domains actively block automated crawlers; failure modes are often silent.' },
        { label: 'Privacy Law Violations', sev: 'high', note: 'Automated collection of personal contact data may violate GDPR Article 6, CCPA, or LinkedIn ToS.' },
        { label: 'Stale Cached Data', sev: 'medium', note: 'A cached research run from three months ago will look identical to a fresh one but may be dangerously wrong.' }
      ]
    },
    {
      id: 'd_data', type: 'decision', label: 'Data Quality Gate', sub: 'Pass / Fail', zone: 'Intelligence Zone',
      cx: 240, cy: 285, w: 96, h: 96,
      desc: "Evaluates the completeness and confidence of the research output. If the enriched profile meets the minimum quality threshold, the lead proceeds automatically. If not, a human reviewer is flagged before anything continues.",
      inputs: ['Enriched profile', 'Quality rule set', 'Confidence thresholds'],
      outputs: ['PASS → Qualification Agent', 'FAIL → Human Review Queue'],
      questions: [
        'What numeric threshold defines "passing" — and who set that number?',
        'Who receives the human-review flag, and what is the SLA before the lead goes cold?',
        'Does the agent auto-approve when the review queue is long, or does it hard-block?',
        'Is the threshold the same for all lead sources, or does it vary by data type?'
      ],
      risks: [
        { label: 'Threshold Set Too Low', sev: 'high', note: "A permissive bar lets poor-quality leads through, wasting every downstream agent's effort." },
        { label: 'Review Queue Bottleneck', sev: 'medium', note: 'High failure rates flood the human review queue and create cold-lead latency.' },
        { label: 'Silent Auto-Approval', sev: 'high', note: 'Agents may self-approve borderline leads to avoid latency if the logic permits it.' }
      ]
    },
    {
      id: 'human_flag', type: 'endpoint', label: 'Human Review Queue', sub: 'Escalation Branch', zone: 'Escalation',
      cx: 490, cy: 285, w: 178, h: 72,
      desc: "Holds leads that failed the data quality gate. A human analyst reviews the record, adds missing data, corrects errors, and resubmits — or permanently discards the lead with a reason code.",
      inputs: ['Failed lead record', 'Failure reason codes'],
      outputs: ['Corrected record → resubmit to gate', 'Discarded record + reason'],
      questions: [
        'What is the expected review volume, and is the team resourced for it?',
        'How does a corrected record cleanly re-enter the pipeline without creating a duplicate?',
        'Is there an immutable audit trail for every human edit?'
      ],
      risks: [
        { label: 'Review Latency = Cold Lead', sev: 'medium', note: 'The longer a lead waits in the queue, the lower the eventual response rate.' },
        { label: 'Inconsistent Human Standards', sev: 'medium', note: "Different analysts may apply different quality bars, making the gate's output unpredictable." }
      ]
    },
    {
      id: 'qualify', type: 'agent', label: 'Qualification Agent', sub: 'ICP Scoring', zone: 'Qualification Zone',
      cx: 240, cy: 405, w: 200, h: 72,
      desc: "Scores the enriched lead against the Ideal Customer Profile (ICP) criteria. Evaluates firmographic fit (company size, industry, region), technographic signals (current software stack), and any available intent data.",
      inputs: ['Enriched lead record', 'ICP criteria store', 'Intent signal feed'],
      outputs: ['ICP score (0–100)', 'Score explanation (LIME/SHAP-style)', 'Recommended tier'],
      questions: [
        'Who owns and governs the ICP definition — and when was it last updated?',
        'Does the agent produce an explainable reason for every score, or is it a black box?',
        'Can sales reps override a score, and if so, does the override feed back into training?',
        'Are there segments where historical win data is too thin to score reliably?'
      ],
      risks: [
        { label: 'ICP Definition Drift', sev: 'high', note: "The ICP may become stale as the market shifts, causing the agent to optimise for yesterday's ideal customer." },
        { label: 'Opaque Black-Box Scores', sev: 'medium', note: "Reps who don't understand why a lead scored high or low will not adopt the output." },
        { label: 'Encoded Demographic Bias', sev: 'high', note: 'Historical CRM data may encode patterns where certain company profiles were never pursued — not because they were poor fits, but because of past sales team blind spots.' }
      ]
    },
    {
      id: 'd_qualify', type: 'decision', label: 'Qualification Gate', sub: 'Route by Score', zone: 'Qualification Zone',
      cx: 240, cy: 527, w: 96, h: 96,
      desc: "Routes leads based on ICP score. Leads scoring ≥70 proceed to personalised outreach. Leads below the threshold are routed into a nurture sequence for longer-term development, not discarded.",
      inputs: ['ICP score', 'Tier routing thresholds'],
      outputs: ['≥70 → Personalisation Agent', '<70 → Nurture Queue'],
      questions: [
        'Is the 70/30 split the right threshold — and has it been validated against win-rate data?',
        'What does a "nurture" lead actually receive — is it a real programme or a low-effort sequence?',
        'Are there escalation paths for borderline leads (60–70)?',
        'How do leads graduate from nurture back into the active pipeline?'
      ],
      risks: [
        { label: 'Wrong Threshold = Revenue Leakage', sev: 'medium', note: 'Too strict loses addressable market; too loose dilutes rep time and conversion rates.' },
        { label: 'Nurture as a Dead End', sev: 'medium', note: 'Without a re-trigger mechanism, leads may enter nurture and never be re-evaluated.' }
      ]
    },
    {
      id: 'nurture', type: 'endpoint', label: 'Nurture Queue', sub: 'Long-term Development', zone: 'Escalation',
      cx: 490, cy: 527, w: 178, h: 72,
      desc: "Receives leads below the qualification threshold. Enrols them in a lower-frequency nurture sequence and schedules a re-evaluation at a set cadence. These are potential customers — they should be treated accordingly.",
      inputs: ['Lead record', 'Nurture programme config'],
      outputs: ['Enrolled in nurture sequence', 'Scheduled re-qualification check'],
      questions: [
        'What cadence does the nurture sequence follow, and who approves the content?',
        'What signal triggers a re-qualification check — time elapsed, intent score spike, company event?',
        'Is the nurture content personalised per lead or batch-templated?'
      ],
      risks: [
        { label: 'Abandoned Leads', sev: 'medium', note: 'Without an active re-trigger, leads may enter nurture and remain there indefinitely.' },
        { label: 'Over-Nurturing Opt-Outs', sev: 'low', note: "A high-frequency sequence on a lead that isn't ready creates unsubscribes and damaged reputation." }
      ]
    },
    {
      id: 'personalize', type: 'agent', label: 'Personalisation Agent', sub: 'Content Generation', zone: 'Content Zone',
      cx: 240, cy: 647, w: 200, h: 72,
      desc: "Generates highly personalised outreach content by combining research insights, brand voice guidelines, and proven messaging frameworks. Creates tailored email sequences, LinkedIn messages, and call talk-tracks grounded in specific company intelligence.",
      inputs: ['Qualified lead record', 'Brand voice library', 'Approved message frameworks', 'Research summary'],
      outputs: ['Draft email sequence', 'LinkedIn connection note', 'Call talk-track'],
      questions: [
        'What brand voice constraints must the agent respect — and are they machine-readable?',
        'How many hard personalisation variables are required per message (beyond first name and company)?',
        'Is there a legal / compliance review requirement before any message is sent in regulated industries?',
        'How do we detect and prevent repetitive personalisation patterns across a large book of leads?'
      ],
      risks: [
        { label: 'Fabricated Prospect References', sev: 'critical', note: 'The agent may invent specific details about the prospect — a fake product launch, a wrong hire — that the rep then sends, causing immediate credibility damage.' },
        { label: 'Brand Voice Drift', sev: 'high', note: 'Each generation is a fresh sample. Without explicit style constraints, content tone drifts across sequences.' },
        { label: 'Spam Trigger Language', sev: 'medium', note: 'Generated content frequently includes phrases that trigger inbox spam filters, reducing deliverability.' },
        { label: 'Legal Exposure', sev: 'high', note: 'Claims made in outreach to regulated industries (finance, health, legal) may require legal review that the automation bypasses.' }
      ]
    },
    {
      id: 'd_review', type: 'decision', label: 'Human Approval Gate', sub: 'Rep Review Required', zone: 'Content Zone',
      cx: 240, cy: 769, w: 96, h: 96,
      desc: "A sales rep reviews AI-generated content before it is sent. They can approve as-is, edit, or reject with specific feedback. Rejection routes content back to the Personalisation Agent with structured guidance for revision.",
      inputs: ['Draft content package', 'Assigned rep', 'Quality checklist'],
      outputs: ['Approved → Outreach Agent', 'Rejected → Revision Loop'],
      questions: [
        'What percentage of messages should require human review long-term — what is the target autonomy level?',
        'Is there a fast-track auto-approve path for high-confidence content — and who can enable it?',
        'How are rep edits captured and fed back as training signals for the personalisation agent?',
        'What is the review SLA — and is there a process if the rep is unavailable?'
      ],
      risks: [
        { label: 'Review Fatigue → Rubber Stamping', sev: 'high', note: 'High review volumes cause reps to approve everything without reading it — defeating the safety purpose entirely.' },
        { label: 'Bypassing the Gate', sev: 'critical', note: 'Operational pressure to "hit quota" can lead teams to disable or route around approval gates.' },
        { label: 'No Feedback Loop', sev: 'medium', note: 'If rep edits are not captured as structured signals, the agent never learns and quality never improves.' }
      ]
    },
    {
      id: 'revise', type: 'revision', label: 'Revision Loop', sub: 'Quality Branch', zone: 'Escalation',
      cx: 490, cy: 769, w: 178, h: 72,
      desc: "Receives rejected content along with rep feedback. The Personalisation Agent regenerates with explicit guidance. A maximum of 2–3 revision cycles is enforced; beyond that, the content escalates to full human authoring to prevent infinite loops.",
      inputs: ['Rejected draft', 'Structured rep feedback', 'Revision count'],
      outputs: ['Revised draft → Human Approval Gate', 'Escalate to human authoring (if max retries hit)'],
      questions: [
        'How many revision cycles are allowed before full human takeover — and is there a hard cap in the code?',
        'Is rep feedback structured (checkboxes, rubric) or free-text — and how does the agent parse it?',
        'How are revision reasons logged for model improvement?'
      ],
      risks: [
        { label: 'Infinite Loop Risk', sev: 'high', note: 'Without a hard retry cap enforced in code, the system can cycle indefinitely between rejection and revision.' },
        { label: 'Vague Feedback = Shallow Revision', sev: 'medium', note: 'Free-text rejections like "sounds off" produce superficial rewrites that fail again for the same reason.' }
      ]
    },
    {
      id: 'outreach', type: 'agent', label: 'Outreach Agent', sub: 'Execution', zone: 'Execution Zone',
      cx: 240, cy: 889, w: 200, h: 72,
      desc: "Executes the approved outreach sequence across channels. Manages send-time optimisation, channel sequencing (email → LinkedIn → call reminder), tracks delivery and engagement events, and adapts the next touch based on engagement signals.",
      inputs: ['Approved content package', 'Lead contact details', 'Send schedule config', 'Channel credentials'],
      outputs: ['Sent messages (with timestamps)', 'Engagement events (opens, clicks, replies)', 'Delivery status per channel'],
      questions: [
        'What send-time optimisation logic is used — is it per-lead or timezone-average?',
        'How are bounced or undeliverable contacts immediately surfaced and resolved?',
        'Does the agent have permission to act autonomously on follow-up touches, or does each require approval?',
        'How many total touchpoints are allowed before a lead is marked inactive for this cycle?'
      ],
      risks: [
        { label: 'CAN-SPAM / GDPR Compliance', sev: 'critical', note: 'Automated email sequences must honour unsubscribe requests within 10 business days (CAN-SPAM) and handle consent properly under GDPR. Automation makes violations at scale trivially easy.' },
        { label: 'Sender Reputation Degradation', sev: 'high', note: 'High-volume sending without domain warm-up, or sending to invalid addresses, triggers spam classification that takes weeks to repair.' },
        { label: 'Over-Sequencing', sev: 'medium', note: 'Automated follow-up logic can create aggressive cadences that are counter-productive and damage brand perception.' }
      ]
    },
    {
      id: 'd_response', type: 'decision', label: 'Response Detection Gate', sub: 'Classify & Route', zone: 'Execution Zone',
      cx: 240, cy: 1010, w: 96, h: 96,
      desc: "Monitors all outreach channels for prospect responses. An NLP classifier categorises response sentiment — positive, negative, objection, or neutral — and routes accordingly. Positive responses trigger immediate sales rep alerts; objections route to a structured handling flow.",
      inputs: ['Engagement events', 'NLP response classifier', 'Channel monitoring feed'],
      outputs: ['Positive → Alert Sales Rep', 'Objection → Structured handling flow', 'No response → Continue sequence'],
      questions: [
        'What exactly defines a "positive" response — and how confident must the classifier be before acting?',
        'What is the rep alert SLA from response detection — 5 minutes? 2 hours?',
        'Are objections handled autonomously with a rebuttal, or always escalated to a human?',
        'How are out-of-office replies and vacation auto-responders identified and correctly suppressed?'
      ],
      risks: [
        { label: 'Misclassified Negative as Positive', sev: 'critical', note: '"Remove me from your list" being classified as a positive and triggering an enthusiastic follow-up is a reputational disaster.' },
        { label: 'Response-to-Rep Alert Latency', sev: 'medium', note: "Every minute between a prospect's response and the rep's first touch reduces conversion probability." },
        { label: 'Autonomous Response Boundary', sev: 'high', note: 'The boundary between "agent informs the rep" and "agent replies on the rep\'s behalf" must be explicitly defined and technically enforced.' }
      ]
    },
    {
      id: 'alert_rep', type: 'success', label: 'Alert Sales Rep', sub: 'Human Handoff', zone: 'Handoff',
      cx: 490, cy: 1010, w: 178, h: 72,
      desc: "Delivers a fully contextualised alert to the assigned sales rep. Includes the full conversation history, a prospect intelligence summary, recommended talking points, and any relevant objection-handling guidance. The rep takes it from here.",
      inputs: ['Response event', 'Full lead context', 'Conversation history', 'Talking-point brief'],
      outputs: ['Rep notification (Slack / email / CRM push)', 'Contextual brief', 'Booked meeting → CRM logged'],
      questions: [
        'Which channel delivers the alert — Slack, email, CRM notification, mobile push?',
        'How rich is the context package — does it include a "why they\'re hot right now" summary?',
        'Is there an escalation if the assigned rep doesn\'t respond within the SLA?'
      ],
      risks: [
        { label: 'Alert Fatigue', sev: 'medium', note: 'If too many low-quality alerts are sent, reps stop responding urgently to any of them — including the genuinely hot ones.' },
        { label: 'Poor Contextual Brief Quality', sev: 'medium', note: "A rep going into a call with a weak summary will underperform. The agent's brief quality directly affects conversion." }
      ]
    },
    {
      id: 'feedback', type: 'learning', label: 'Feedback Loop Agent', sub: 'Continuous Learning', zone: 'Learning Zone',
      cx: 240, cy: 1130, w: 200, h: 72,
      desc: "Continuously ingests outcome data — meetings booked, deals won and lost, response rates per message variant — and feeds structured signals back to improve research quality, ICP scoring accuracy, and personalisation effectiveness over time. The nervous system of the whole pipeline.",
      inputs: ['CRM win/loss data', 'Sequence engagement metrics', 'Rep override history', 'Meeting and pipeline outcomes'],
      outputs: ['Updated ICP scoring weights', 'Research quality signals', 'Content performance insights', 'Drift alerts for human review'],
      questions: [
        'What outcomes are used as primary training signals — and are they aligned with actual revenue, not just proxy metrics?',
        'How frequently is the feedback data reviewed by a human before any model update is applied?',
        'Who has the authority to pause or roll back the feedback loop — and is that process documented?',
        'Are there guardrails that prevent the model from optimising toward biased historical patterns?'
      ],
      risks: [
        { label: 'Reward Hacking', sev: 'critical', note: 'The agent may optimise for measurable proxies (open rate, reply rate) instead of real business outcomes (revenue, LTV), because those are the signals that arrive fastest.' },
        { label: 'Feedback Loop Delay', sev: 'medium', note: 'Enterprise deal cycles can take 6–18 months. By the time outcome signals arrive, the model may have already drifted.' },
        { label: 'Unmonitored Model Drift', sev: 'high', note: 'Without continuous human oversight, the model gradually shifts in ways that no single change makes obvious — a slow, undetected quality degradation.' }
      ]
    }
  ],
  edges: [
    { from: 'lead_intake',  to: 'research',   type: 'main' },
    { from: 'research',     to: 'd_data',      type: 'main' },
    { from: 'd_data',       to: 'qualify',     type: 'yes',    label: 'Pass' },
    { from: 'd_data',       to: 'human_flag',  type: 'branch', label: 'Fail' },
    { from: 'qualify',      to: 'd_qualify',   type: 'main' },
    { from: 'd_qualify',    to: 'personalize', type: 'yes',    label: '≥70' },
    { from: 'd_qualify',    to: 'nurture',     type: 'branch', label: '<70' },
    { from: 'personalize',  to: 'd_review',    type: 'main' },
    { from: 'd_review',     to: 'outreach',    type: 'yes',    label: 'Approved' },
    { from: 'd_review',     to: 'revise',      type: 'branch', label: 'Rejected' },
    { from: 'revise',       to: 'd_review',    type: 'loop' },
    { from: 'outreach',     to: 'd_response',  type: 'main' },
    { from: 'd_response',   to: 'feedback',    type: 'main',   label: 'Sequence done' },
    { from: 'd_response',   to: 'alert_rep',   type: 'yes',    label: 'Response' },
    { from: 'alert_rep',    to: 'feedback',    type: 'side' }
  ],
  simFlow: ['lead_intake','research','d_data','qualify','d_qualify','personalize','d_review','outreach','d_response','alert_rep','feedback']
}

// ── METRICS DATA ──────────────────────────────────────────────────────────────
const METRICS = {
  lead_intake:  { latency: { p50: 0.3,   p95: 1.2,   unit: 's', bottleneck: false, note: 'Near-instant for well-structured imports; p95 spike from malformed CSV parsing or duplicate-resolution conflicts.' }, tokens: { input: 180,  output: 90,   model: 'GPT-4o mini', note: 'Low token use — mostly schema validation and field normalisation.' },            cost: { per_run: 0.001, volume: '~$1/day at 1,000 leads' },                               risk: { score: 22, drivers: ['Silent dedup failures can create ghost leads', 'PII ingested before consent is verified'] } },
  research:     { latency: { p50: 9,     p95: 48,    unit: 's', bottleneck: true,  note: 'Dominated by external API calls (Crunchbase, LinkedIn, web scraping). Cache hits cut p50 to ~1.5s; misses on obscure targets drive p95 to 60s+.' },    tokens: { input: 3800, output: 1400, model: 'GPT-4o',      note: 'Input scales with number of sources scraped. Multi-hop research runs can reach 8k+ input tokens.' },        cost: { per_run: 0.038, volume: '~$38/day at 1,000 leads' },                              risk: { score: 80, drivers: ['Hallucination rate ~3–5% on thin grounding data', 'External API availability is outside your control', 'Scraping blocks create silent data gaps'] } },
  d_data:       { latency: { p50: 0.1,   p95: 0.4,   unit: 's', bottleneck: false, note: 'Rule-based threshold check — no LLM call. Latency is purely compute and DB write.' },                                                                      tokens: { input: 600,  output: 80,   model: 'GPT-4o mini', note: 'Minimal — parsing the quality rubric against field completeness scores.' },                   cost: { per_run: 0.003, volume: '~$3/day at 1,000 leads' },                               risk: { score: 44, drivers: ['Threshold value is arbitrary without empirical calibration', 'Silent auto-approve pathway under queue pressure'] } },
  human_flag:   { latency: { p50: 14400, p95: 86400, unit: 's', bottleneck: false, note: 'Entirely human-dependent. p50 assumes 4-hour business-hours review. p95 reflects overnight or weekend arrival with no on-call.' },                        tokens: { input: 0,    output: 0,    model: 'None',         note: 'No LLM involved. Human analyst works directly in the CRM.' },                                       cost: { per_run: 12.0,  volume: '~$12 analyst time per reviewed lead (est. 15 min @ $48/hr)' },         risk: { score: 52, drivers: ['Review latency directly degrades lead responsiveness', 'Inconsistent analyst quality standards'] } },
  qualify:      { latency: { p50: 1.6,   p95: 4.2,   unit: 's', bottleneck: false, note: 'Scoring against a vector-matched ICP store. Latency grows with ICP rule complexity and intent signal lookup.' },                                           tokens: { input: 2100, output: 650,  model: 'GPT-4o',      note: 'Input includes enriched lead profile plus ICP criteria prompt. Output is score + SHAP-style breakdown.' },   cost: { per_run: 0.019, volume: '~$19/day at 1,000 leads' },                              risk: { score: 64, drivers: ['ICP definition drift — stale criteria poison every score', 'Black-box scores kill rep adoption', 'Historical bias encoded in training win data'] } },
  d_qualify:    { latency: { p50: 0.05,  p95: 0.15,  unit: 's', bottleneck: false, note: 'Pure threshold comparison against numeric score. No LLM call.' },                                                                                          tokens: { input: 120,  output: 30,   model: 'None',         note: 'No LLM — deterministic routing logic only.' },                                                          cost: { per_run: 0.0,   volume: 'Negligible' },                                            risk: { score: 28, drivers: ['Wrong threshold = silent revenue leakage', 'Nurture dead-end without re-trigger mechanism'] } },
  nurture:      { latency: { p50: 0.2,   p95: 0.6,   unit: 's', bottleneck: false, note: 'Queue write and sequence enrolment only. No generation.' },                                                                                                tokens: { input: 0,    output: 0,    model: 'None',         note: 'No LLM. Enrolment is a database write and CRM tag.' },                                                  cost: { per_run: 0.001, volume: '~$1/day at 1,000 leads routed here' },                   risk: { score: 18, drivers: ['Leads enter nurture and are never re-evaluated', 'Over-nurturing at high volume triggers opt-outs'] } },
  personalize:  { latency: { p50: 5,     p95: 14,    unit: 's', bottleneck: false, note: 'Long-form generation — email sequence + LinkedIn + call script. Scales with sequence length and persona complexity.' },                                   tokens: { input: 4800, output: 3200, model: 'GPT-4o',      note: 'Highest token count in pipeline. System prompt (brand voice + frameworks) + full lead context = large input.' }, cost: { per_run: 0.062, volume: '~$62/day at 1,000 leads' },                              risk: { score: 84, drivers: ['Fabricated prospect-specific details (fake funding rounds, wrong hires)', 'Brand voice drift across high-volume runs', 'Spam trigger language in generated copy', 'Legal exposure for regulated industry claims'] } },
  d_review:     { latency: { p50: 7200,  p95: 28800, unit: 's', bottleneck: false, note: 'Human rep review. p50 assumes same-day review within 2 hours. p95 reflects end-of-day review or rep unavailability.' },                                   tokens: { input: 0,    output: 0,    model: 'None',         note: 'No LLM. Rep reads draft in UI, edits inline, and approves or rejects.' },                                   cost: { per_run: 6.4,   volume: '~$6.40 rep time per review (est. 8 min @ $48/hr)' },            risk: { score: 72, drivers: ['Review fatigue causes rubber-stamp approvals', 'Operational pressure to bypass gate entirely', 'No structured feedback capture from rep edits'] } },
  revise:       { latency: { p50: 5.5,   p95: 16,    unit: 's', bottleneck: false, note: 'Per-revision latency. With max 3 revisions, worst-case adds 48s to pipeline.' },                                                                           tokens: { input: 5200, output: 3400, model: 'GPT-4o',      note: 'Includes original draft + rejection feedback in input. Each revision cycle is a full regeneration.' },        cost: { per_run: 0.068, volume: '~$0.068 per revision cycle' },                           risk: { score: 58, drivers: ['No hard retry cap = infinite loop risk', 'Vague rejection feedback = shallow revision that fails again'] } },
  outreach:     { latency: { p50: 0.5,   p95: 2.1,   unit: 's', bottleneck: false, note: 'Execution latency only — email/LinkedIn API calls. Does not include delivery time or engagement window.' },                                               tokens: { input: 480,  output: 0,    model: 'GPT-4o mini', note: 'Minimal — send-time optimisation scoring only. Content is pre-approved and sent as-is.' },                  cost: { per_run: 0.004, volume: '~$4/day at 1,000 sends + email service fees' },          risk: { score: 74, drivers: ['CAN-SPAM / GDPR unsubscribe compliance at automation scale', 'Sender domain reputation degradation from invalid addresses', 'Over-sequencing damages brand perception'] } },
  d_response:   { latency: { p50: 0.8,   p95: 3.2,   unit: 's', bottleneck: false, note: 'NLP classification of inbound response. Runs on every engagement event.' },                                                                               tokens: { input: 1100, output: 190,  model: 'GPT-4o mini', note: 'Input includes full response text plus context thread. Output is classification label + confidence score.' },    cost: { per_run: 0.006, volume: '~$6/day at 1,000 responses classified' },                risk: { score: 66, drivers: ['Misclassified unsubscribe as positive reply = reputational damage', 'Alert-to-rep latency gap kills conversion probability', 'Undefined boundary between informing vs acting on behalf of rep'] } },
  alert_rep:    { latency: { p50: 0.4,   p95: 1.1,   unit: 's', bottleneck: false, note: 'Brief generation + push notification delivery. Near-instant from the pipeline perspective.' },                                                             tokens: { input: 2200, output: 550,  model: 'GPT-4o',      note: 'Input is full lead history + response context. Output is the contextual brief with talking points.' },        cost: { per_run: 0.014, volume: '~$14/day at 1,000 alerts' },                             risk: { score: 32, drivers: ['Alert fatigue from low-quality notifications', 'Weak brief quality directly impacts conversion outcome'] } },
  feedback:     { latency: { p50: 35,    p95: 130,   unit: 's', bottleneck: false, note: 'Batch processing — runs asynchronously on closed deals and completed sequences. Not on the hot path.' },                                                   tokens: { input: 9000, output: 2200, model: 'GPT-4o',      note: 'Batch input includes many outcome records. Expensive per batch but amortised across many leads.' },           cost: { per_run: 0.056, volume: '~$56/batch (est. 500 outcomes/batch)' },                 risk: { score: 87, drivers: ['Proxy metric optimisation (open rate) vs real outcome (revenue)', 'Enterprise deal lag means learning signals arrive 6–18 months late', 'Unmonitored drift compounds silently across cycles', 'Historical bias patterns reinforced with each update'] } }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function nodeAnchor(n, side) {
  if (n.type === 'decision') {
    if (side === 'top')    return { x: n.cx,         y: n.cy - n.h / 2 }
    if (side === 'bottom') return { x: n.cx,         y: n.cy + n.h / 2 }
    if (side === 'left')   return { x: n.cx - n.w / 2, y: n.cy }
    if (side === 'right')  return { x: n.cx + n.w / 2, y: n.cy }
  } else {
    const top    = n.cy
    const bottom = n.cy + n.h
    const left   = n.cx - n.w / 2
    const right  = n.cx + n.w / 2
    if (side === 'top')    return { x: n.cx,  y: top }
    if (side === 'bottom') return { x: n.cx,  y: bottom }
    if (side === 'left')   return { x: left,  y: (top + bottom) / 2 }
    if (side === 'right')  return { x: right, y: (top + bottom) / 2 }
  }
}

function fmtLatency(p50, unit) {
  if (unit === 's' && p50 >= 3600) return (p50 / 3600).toFixed(1) + 'h'
  if (unit === 's' && p50 >= 60)   return (p50 / 60).toFixed(0) + 'm'
  if (unit === 's')                 return p50 + 's'
  return p50 + unit
}

function riskColor(score) {
  if (score >= 81) return '#ef4444'
  if (score >= 61) return '#f97316'
  if (score >= 31) return '#f59e0b'
  return '#22c55e'
}

function riskLabel(score) {
  if (score >= 81) return 'Critical'
  if (score >= 61) return 'High'
  if (score >= 31) return 'Medium'
  return 'Low'
}

function getNodeBadges(nodeId) {
  const m = METRICS[nodeId]
  if (!m) return null
  const { latency, cost, risk } = m
  const s = latency.unit === 's' ? latency.p50 : latency.p50 / 1000
  const latCls = s >= 1800 ? 'nb-latency-human' : s >= 5 ? 'nb-latency-slow' : s >= 1 ? 'nb-latency-med' : 'nb-latency-fast'
  const latLbl = s >= 1800 ? 'human' : fmtLatency(latency.p50, latency.unit)
  const cstCls = cost.per_run >= 5 ? 'nb-cost-hi' : cost.per_run >= 0.02 ? 'nb-cost-mid' : 'nb-cost-lo'
  const rskCls = risk.score >= 81 ? 'nb-risk-crit' : risk.score >= 61 ? 'nb-risk-hi' : risk.score >= 31 ? 'nb-risk-med' : 'nb-risk-lo'
  return { latCls, latLbl, cstCls, rskCls, rskLbl: 'risk:' + risk.score }
}

function computeEdges() {
  const nm = {}
  SCENARIO.nodes.forEach(n => { nm[n.id] = n })
  return SCENARIO.edges.map((e, i) => {
    const fn = nm[e.from], tn = nm[e.to]
    if (!fn || !tn) return null
    let d = '', color = 'rgba(59,130,246,0.3)', dashArray = null
    let lx = 0, ly = 0, showLabel = false
    if (e.type === 'main' || e.type === 'yes') {
      const a1 = nodeAnchor(fn, 'bottom'), a2 = nodeAnchor(tn, 'top')
      const my = (a1.y + a2.y) / 2
      d = `M ${a1.x} ${a1.y} C ${a1.x} ${my} ${a2.x} ${my} ${a2.x} ${a2.y}`
      color = e.type === 'yes' ? 'rgba(34,197,94,0.45)' : 'rgba(59,130,246,0.3)'
      if (e.label) { lx = a2.x + 6; ly = a2.y - 6; showLabel = true }
    } else if (e.type === 'branch') {
      const a1 = nodeAnchor(fn, 'right'), a2 = nodeAnchor(tn, 'left')
      const mx = (a1.x + a2.x) / 2
      d = `M ${a1.x} ${a1.y} C ${mx} ${a1.y} ${mx} ${a2.y} ${a2.x} ${a2.y}`
      color = 'rgba(100,116,139,0.5)'
      if (e.label) { lx = a1.x + 8; ly = a1.y - 7; showLabel = true }
    } else if (e.type === 'loop') {
      const a1 = nodeAnchor(fn, 'top'), a2 = nodeAnchor(tn, 'right')
      d = `M ${a1.x} ${a1.y} C ${a1.x} ${a1.y - 24} ${a2.x + 32} ${a2.y + 24} ${a2.x} ${a2.y}`
      color = 'rgba(249,115,22,0.4)'; dashArray = '5 4'
    } else if (e.type === 'side') {
      const a1 = nodeAnchor(fn, 'bottom'), a2 = nodeAnchor(tn, 'right')
      d = `M ${a1.x} ${a1.y} C ${a1.x} ${a2.y} ${a2.x + 30} ${a2.y} ${a2.x} ${a2.y}`
      color = 'rgba(59,130,246,0.2)'; dashArray = '4 4'
    }
    const textColor = color.replace('0.3', '0.8').replace('0.45', '0.9').replace('0.5', '0.9').replace('0.2', '0.7')
    return { key: i, d, color, dashArray, lx, ly, showLabel, label: e.label, textColor }
  }).filter(Boolean)
}

function getPipelineTotals() {
  let totalLat = 0, totalTok = 0, totalCost = 0, riskSum = 0, riskCount = 0
  let bottleneckId = null, bottleneckLat = 0
  SCENARIO.simFlow.forEach(id => {
    const m = METRICS[id]; if (!m) return
    const isHuman = m.latency.p50 >= 300
    if (!isHuman) totalLat += m.latency.p50
    totalTok  += (m.tokens.input + m.tokens.output)
    totalCost += m.cost.per_run
    if (m.risk.score) { riskSum += m.risk.score; riskCount++ }
    if (!isHuman && m.latency.p50 > bottleneckLat) { bottleneckLat = m.latency.p50; bottleneckId = id }
  })
  return { latency: totalLat, tokens: totalTok, cost: totalCost, risk: riskCount ? Math.round(riskSum / riskCount) : 0, bottleneckId, bottleneckLat }
}

// ── METRICS PANEL SUB-COMPONENT ───────────────────────────────────────────────
function MetricsPanel({ nodeId }) {
  const m = METRICS[nodeId]
  if (!m) return <div className="human-note">No metrics data for this node.</div>
  const { latency: lat, tokens: tok, cost, risk } = m
  const isHuman    = lat.p50 >= 300
  const maxLat     = isHuman ? lat.p95 : Math.max(lat.p95, 1)
  const p50pct     = Math.min(100, Math.round(lat.p50 / maxLat * 100))
  const latColor   = lat.p50 >= 3600 ? 'bf-red' : lat.p50 >= 60 ? 'bf-orange' : lat.p50 >= 5 ? 'bf-amber' : 'bf-green'
  const totalTok   = tok.input + tok.output
  const inPct      = totalTok > 0 ? Math.round(tok.input / totalTok * 100) : 0
  const tokColor   = totalTok >= 5000 ? 'bf-orange' : totalTok >= 2000 ? 'bf-amber' : 'bf-blue'
  const isHumanCost= cost.per_run >= 1
  const rc         = riskColor(risk.score)
  const rl         = riskLabel(risk.score)
  const rFill      = risk.score >= 81 ? 'bf-red' : risk.score >= 61 ? 'bf-orange' : risk.score >= 31 ? 'bf-amber' : 'bf-green'
  return (
    <>
      <div className="m-section">
        <div className="m-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Latency
        </div>
        <div className="m-card">
          {isHuman ? (
            <div className="human-note">Human step.&nbsp; p50: {fmtLatency(lat.p50,'s')}&nbsp;|&nbsp;p95: {fmtLatency(lat.p95,'s')}</div>
          ) : (
            <>
              <div className="latency-grid">
                <span className="bar-label">p50</span>
                <div className="bar-wrap"><div className={`bar-fill ${latColor}`} style={{width:`${p50pct}%`}}></div></div>
                <span className="m-val" style={{fontSize:'11px'}}>{fmtLatency(lat.p50, lat.unit)}</span>
              </div>
              <div className="latency-grid">
                <span className="bar-label">p95</span>
                <div className="bar-wrap"><div className={`bar-fill ${latColor}`} style={{width:'100%',opacity:.5}}></div></div>
                <span className="m-val" style={{fontSize:'11px'}}>{fmtLatency(lat.p95, lat.unit)}</span>
              </div>
              {lat.bottleneck && <div style={{fontSize:'10px',color:'#f59e0b',marginTop:'5px',fontFamily:"'IBM Plex Mono',monospace"}}>▲ Pipeline bottleneck — highest latency node</div>}
            </>
          )}
          <div className="m-note">{lat.note}</div>
        </div>
      </div>
      <div className="m-section">
        <div className="m-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
          Token Usage
        </div>
        <div className="m-card">
          {totalTok === 0 ? (
            <div className="human-note">No LLM calls — model: {tok.model}</div>
          ) : (
            <>
              <div className="m-row"><span className="m-key">Model</span><span className="m-val">{tok.model}</span></div>
              <div className="token-bar-row">
                <span className="bar-label">Input</span>
                <div className="bar-wrap"><div className={`bar-fill ${tokColor}`} style={{width:`${inPct}%`}}></div></div>
                <span className="m-val" style={{fontSize:'10px'}}>{tok.input.toLocaleString()}</span>
              </div>
              <div className="token-bar-row">
                <span className="bar-label">Output</span>
                <div className="bar-wrap"><div className={`bar-fill ${tokColor}`} style={{width:`${100-inPct}%`,opacity:.55}}></div></div>
                <span className="m-val" style={{fontSize:'10px'}}>{tok.output.toLocaleString()}</span>
              </div>
              <div className="m-row" style={{marginTop:'6px'}}><span className="m-key">Total / run</span><span className="m-val">{totalTok.toLocaleString()} tokens</span></div>
            </>
          )}
          <div className="m-note">{tok.note}</div>
        </div>
      </div>
      <div className="m-section">
        <div className="m-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          Cost
        </div>
        <div className="m-card">
          <div className="m-row">
            <span className="m-key">Per run</span>
            <span className="m-val">{isHumanCost ? '~$' + cost.per_run.toFixed(2) + ' (labor)' : '$' + cost.per_run.toFixed(3)}</span>
          </div>
          <div className="m-row">
            <span className="m-key">At volume</span>
            <span className="m-val" style={{fontSize:'10px',color:'#7a9cc4'}}>{cost.volume}</span>
          </div>
          {isHumanCost && <div className="m-note">Human labor cost estimate. Does not include LLM tokens.</div>}
        </div>
      </div>
      <div className="m-section">
        <div className="m-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Risk Score
        </div>
        <div className="m-card">
          <div className="risk-score-row">
            <div style={{flex:1}}>
              <div className="risk-gauge-wrap"><div className={`risk-gauge-fill ${rFill}`} style={{width:`${risk.score}%`}}></div></div>
              <div style={{fontSize:'10px',color:'#3d6080',fontFamily:"'IBM Plex Mono',monospace",marginTop:'3px'}}>{risk.score}/100 · {rl}</div>
            </div>
            <div className="risk-score-big" style={{color:rc,marginLeft:'12px'}}>{risk.score}</div>
          </div>
          <div className="risk-driver-list">
            {risk.drivers.map((d, i) => <div key={i} className="risk-driver">{d}</div>)}
          </div>
        </div>
      </div>
    </>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const BADGE_MAP = { entry:'tb-entry', agent:'tb-agent', decision:'tb-decision', endpoint:'tb-endpoint', success:'tb-success', learning:'tb-learning', revision:'tb-revision' }
const NODE_CLS  = { entry:'nd-entry', agent:'nd-agent', success:'nd-success', endpoint:'nd-endpoint', revision:'nd-revision', learning:'nd-learning' }
const TABS      = ['overview','questions','risks','metrics']
const TAB_LABEL = { overview:'Overview', questions:'Questions', risks:'Risks', metrics:'Metrics' }

export default function AgentSimulation() {
  const [selectedId, setSelectedId] = useState(null)
  const [simActive,  setSimActive]  = useState(false)
  const [simStep,    setSimStep]    = useState(0)
  const [activeTab,  setActiveTab]  = useState('overview')

  const simSeq     = SCENARIO.simFlow
  const selectedNode = selectedId ? SCENARIO.nodes.find(n => n.id === selectedId) : null
  const curSimId   = simActive ? simSeq[simStep] : null

  const edges       = useMemo(() => computeEdges(), [])
  const canvasH     = useMemo(() => Math.max(...SCENARIO.nodes.map(n => n.type === 'decision' ? n.cy + n.h / 2 : n.cy + n.h)) + 50, [])
  const totals      = useMemo(() => getPipelineTotals(), [])
  const totRiskColor= riskColor(totals.risk)
  const bottleneckNode = totals.bottleneckId ? SCENARIO.nodes.find(n => n.id === totals.bottleneckId) : null

  const handleSelect = (id) => { setSelectedId(id); setActiveTab('overview') }

  const handleStartSim = () => {
    setSimActive(true); setSimStep(0)
    setSelectedId(simSeq[0]); setActiveTab('overview')
  }
  const handleStopSim = () => { setSimActive(false) }
  const handleStepSim = (dir) => {
    const next = Math.max(0, Math.min(simSeq.length - 1, simStep + dir))
    setSimStep(next); setSelectedId(simSeq[next]); setActiveTab('overview')
  }

  const handleExport = () => {
    let txt = `PRISM — ${SCENARIO.name}\nExported: ${new Date().toLocaleString()}\n\n${'='.repeat(60)}\n`
    SCENARIO.nodes.forEach(n => {
      txt += `\n▶ ${n.label} (${n.type.toUpperCase()})\nZone: ${n.zone}\n\nDescription:\n${n.desc}\n\nKey Questions:\n`
      n.questions.forEach((q, i) => { txt += `  ${i + 1}. ${q}\n` })
      txt += `\nRisks:\n`
      n.risks.forEach(r => { txt += `  [${r.sev.toUpperCase()}] ${r.label}: ${r.note}\n` })
      txt += '\n' + '-'.repeat(60) + '\n'
    })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([txt], { type: 'text/plain' })), download: 'prism_sales_pipeline_notes.txt' })
    a.click()
  }

  return (
    <>
      <style>{css}</style>
      <NavBar />
      <div className="prism-wrap">

        {/* ── MINI HEADER ── */}
        <div className="prism-hdr">
          <div className="prism-logo">
            <div className="prism-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="8.5" x2="22" y2="8.5"/></svg>
            </div>
            Prism
          </div>
          <div className="prism-hdr-div"/>
          <span className="prism-hdr-label">Agent Sandbox</span>
          <div className="prism-hdr-div"/>
          <span className="prism-hdr-title">Workflow Simulation &amp; Decision Mapping</span>
          <div className="prism-hdr-right">
            <button className="prism-btn prism-btn-outline" onClick={handleExport}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Export Notes
            </button>
            {!simActive && (
              <button className="prism-btn prism-btn-sim" onClick={handleStartSim}>
                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run Simulation
              </button>
            )}
          </div>
        </div>

        {/* ── PIPELINE SUMMARY BAR ── */}
        <div className="pipe-bar">
          <div className="pipe-stat">
            <div className="pipe-icon pi-blue"><svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div><div className="pipe-val">{fmtLatency(Math.round(totals.latency), 's')}</div><div className="pipe-lbl">Pipeline latency (p50)</div></div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-icon pi-teal"><svg viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg></div>
            <div><div className="pipe-val">{totals.tokens.toLocaleString()}</div><div className="pipe-lbl">Tokens / run (happy path)</div></div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-icon pi-amber"><svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
            <div><div className="pipe-val">${totals.cost.toFixed(3)}</div><div className="pipe-lbl">Est. cost / run</div></div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-icon pi-red"><svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div><div className="pipe-val" style={{color:totRiskColor}}>{totals.risk} / 100</div><div className="pipe-lbl">Avg. risk score</div></div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-icon pi-violet"><svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
            <div>
              <div className="pipe-val">{bottleneckNode ? fmtLatency(Math.round(totals.bottleneckLat), 's') : '—'}</div>
              <div className="pipe-lbl">{bottleneckNode ? bottleneckNode.label : 'Bottleneck'}</div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="prism-body">

          {/* ── FLOOR CANVAS ── */}
          <div className="floor-col">
            <div className="floor-top">
              <span className="floor-hed">{SCENARIO.name} — Click any node to inspect</span>
              <div className="legend">
                <div className="leg-item"><div className="leg-dot" style={{background:'#14b8a6'}}></div>Entry</div>
                <div className="leg-item"><div className="leg-dot" style={{background:'#3b82f6'}}></div>Agent</div>
                <div className="leg-item"><div className="leg-dot" style={{background:'#f59e0b'}}></div>Decision</div>
                <div className="leg-item"><div className="leg-dot" style={{background:'#64748b'}}></div>Branch</div>
                <div className="leg-item"><div className="leg-dot" style={{background:'#22c55e'}}></div>Handoff</div>
                <div className="leg-item"><div className="leg-dot" style={{background:'#8b5cf6'}}></div>Learning</div>
              </div>
            </div>

            <div className="floor-canvas" style={{height: canvasH}}>
              {/* SVG EDGES */}
              <svg
                style={{position:'absolute',top:0,left:0,width:'100%',pointerEvents:'none'}}
                viewBox={`0 0 680 ${canvasH}`}
                width="680"
                height={canvasH}
              >
                <defs>
                  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                {edges.map(e => (
                  <g key={e.key}>
                    <path d={e.d} fill="none" stroke={e.color} strokeWidth="1.5" strokeDasharray={e.dashArray || undefined} markerEnd="url(#arr)"/>
                    {e.showLabel && (
                      <text x={e.lx} y={e.ly} fontSize="10" fill={e.textColor} fontFamily="IBM Plex Mono, monospace">{e.label}</text>
                    )}
                  </g>
                ))}
              </svg>

              {/* NODES */}
              {SCENARIO.nodes.map(n => {
                const isActive = selectedId === n.id
                const isSim    = curSimId === n.id
                if (n.type === 'decision') {
                  return (
                    <div
                      key={n.id}
                      id={'nd_' + n.id}
                      className={`nd-decision${isActive ? ' active' : ''}${isSim ? ' sim-on' : ''}`}
                      style={{left: n.cx - n.w / 2, top: n.cy - n.h / 2}}
                      onClick={() => handleSelect(n.id)}
                    >
                      <div className="diamond-wrap">
                        <div className="diamond-shape"/>
                        <div className="diamond-label">
                          {n.label}<br/>
                          <span style={{fontSize:'9px',fontWeight:400,opacity:.7}}>{n.sub}</span>
                        </div>
                      </div>
                      <div className="sim-pulse"/>
                    </div>
                  )
                }
                const badges = getNodeBadges(n.id)
                return (
                  <div
                    key={n.id}
                    id={'nd_' + n.id}
                    className={`nd${isActive ? ' active' : ''}${isSim ? ' sim-on' : ''}`}
                    style={{left: n.cx - n.w / 2, top: n.cy}}
                    onClick={() => handleSelect(n.id)}
                  >
                    <div className={`nd-box ${NODE_CLS[n.type] || 'nd-agent'}`}>
                      <div className="nd-title">{n.label}</div>
                      <div className="nd-sub">{n.sub}</div>
                      <span className="nd-zone">{n.zone}</span>
                      {badges && (
                        <div className="nd-badges">
                          <span className={`nd-badge ${badges.latCls}`}>{badges.latLbl}</span>
                          <span className={`nd-badge ${badges.cstCls}`}>{badges.cstCls === 'nb-cost-hi' ? '$$$' : badges.cstCls === 'nb-cost-mid' ? '$$' : '$'}</span>
                          <span className={`nd-badge ${badges.rskCls}`}>{badges.rskLbl}</span>
                        </div>
                      )}
                    </div>
                    <div className="sim-pulse"/>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── DETAIL PANEL ── */}
          <div className="detail-col">
            {!selectedNode ? (
              <div className="detail-empty">
                <div className="de-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3d6080" strokeWidth="1.5"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l4.553 2.276A1 1 0 0021 21.382V10.618a1 1 0 00-1.447-.894L15 12m0 8V12m0 0L9 7"/></svg>
                </div>
                <div className="de-title">Select a node</div>
                <div className="de-sub">Click any agent, decision, or branch node on the floor plan to inspect it</div>
              </div>
            ) : (
              <div className="detail-body">
                <div className={`type-badge ${BADGE_MAP[selectedNode.type] || 'tb-agent'}`}>
                  {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                </div>
                <div className="d-name">{selectedNode.label}</div>
                <div className="d-sub">{selectedNode.sub} · {selectedNode.zone}</div>
                <div className="d-desc">{selectedNode.desc}</div>

                {/* I/O Grid */}
                <div className="io-grid">
                  <div className="io-box">
                    <div className="io-lbl">Inputs</div>
                    {selectedNode.inputs.map((item, i) => <div key={i} className="io-item">{item}</div>)}
                  </div>
                  <div className="io-box">
                    <div className="io-lbl">Outputs</div>
                    {selectedNode.outputs.map((item, i) => <div key={i} className="io-item">{item}</div>)}
                  </div>
                </div>

                {/* Tabs */}
                <div className="dtabs">
                  {TABS.map(t => (
                    <button key={t} className={`dtab${activeTab === t ? ' on' : ''}`} onClick={() => setActiveTab(t)}>
                      {TAB_LABEL[t]}
                    </button>
                  ))}
                </div>

                {/* Tab: Overview */}
                {activeTab === 'overview' && (
                  <div>
                    <div style={{fontSize:'12.5px',color:'#7a9cc4',lineHeight:1.7,padding:'10px 12px',background:'#0b1628',border:'1px solid #1c3050',borderRadius:'6px'}}>
                      <strong style={{color:'#dde9fa',fontWeight:600,display:'block',marginBottom:'6px'}}>What this node does</strong>
                      {selectedNode.desc}
                    </div>
                    <div style={{marginTop:'10px',padding:'10px 12px',background:'#0b1628',border:'1px solid #1c3050',borderRadius:'6px'}}>
                      <div style={{fontSize:'9.5px',fontFamily:"'IBM Plex Mono',monospace",color:'#3d6080',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'6px'}}>Decision or handoff</div>
                      <div style={{fontSize:'12.5px',color:'#7a9cc4'}}>{selectedNode.outputs.join(' · ')}</div>
                    </div>
                  </div>
                )}

                {/* Tab: Questions */}
                {activeTab === 'questions' && (
                  <div className="q-list">
                    {selectedNode.questions.map((q, i) => (
                      <div key={i} className="q-item">
                        <span className="q-num">Q{i + 1}</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Risks */}
                {activeTab === 'risks' && (
                  <div className="r-list">
                    {selectedNode.risks.map((r, i) => (
                      <div key={i} className="r-item">
                        <div className="r-hdr">
                          <span className="r-name">{r.label}</span>
                          <span className={`sev sev-${r.sev}`}>{r.sev}</span>
                        </div>
                        <div className="r-note">{r.note}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Metrics */}
                {activeTab === 'metrics' && <MetricsPanel nodeId={selectedNode.id} />}
              </div>
            )}
          </div>

          {/* ── SIM BAR ── */}
          {simActive && (
            <div className="sim-bar">
              <button className="sim-btn sb-stop" onClick={handleStopSim}>
                <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                Stop
              </button>
              <button className="sim-btn sb-step" onClick={() => handleStepSim(-1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="sim-btn sb-step" onClick={() => handleStepSim(1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <div className="sim-prog-wrap">
                <div className="sim-prog-lbl">Step {simStep + 1} of {simSeq.length}</div>
                <div className="sim-prog"><div className="sim-prog-fill" style={{width:`${(simStep + 1) / simSeq.length * 100}%`}}/></div>
              </div>
              <div className="sim-node-lbl">
                {SCENARIO.nodes.find(n => n.id === simSeq[simStep])?.label || ''}
              </div>
            </div>
          )}

        </div>{/* /prism-body */}
      </div>{/* /prism-wrap */}
    </>
  )
}
