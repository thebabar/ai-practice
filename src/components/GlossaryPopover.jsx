import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@phosphor-icons/react'

/* =====================================================================
   GlossaryPopover — the definition card raised by GlossaryScope.

   Portalled to <body> so a page with overflow:hidden cannot clip it,
   and positioned fixed against the abbr's viewport rect.
   ===================================================================== */

const WIDTH = 320
const GAP = 10
const MARGIN = 12

export default function GlossaryPopover({ term, rect, onHold, onRelease, onClose }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ top: -9999, left: -9999, flipped: false })

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const h = node.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Prefer below; flip above when there is not room.
    const below = rect.bottom + GAP
    const flipped = below + h > vh - MARGIN && rect.top - GAP - h > MARGIN
    const top = flipped ? rect.top - GAP - h : below

    // Centre on the term, then pull back inside the viewport.
    let left = rect.left + rect.width / 2 - WIDTH / 2
    left = Math.max(MARGIN, Math.min(left, vw - WIDTH - MARGIN))

    setPos({ top, left, flipped })
  }, [rect])

  return createPortal(
    <div
      ref={ref}
      className="prism-gloss-pop"
      role="dialog"
      aria-label={`${term.term} — definition`}
      style={{ top: pos.top, left: pos.left, width: WIDTH }}
      onMouseEnter={onHold}
      onMouseLeave={onRelease}
    >
      <div className="prism-gloss-pop-head">
        <span className="prism-gloss-pop-term">{term.term}</span>
        <span className="prism-gloss-pop-cat">{term.category}</span>
      </div>

      <p className="prism-gloss-pop-def">{term.definition}</p>

      {term.example && (
        <p className="prism-gloss-pop-eg">
          <span>Example</span>
          {term.example}
        </p>
      )}

      <div className="prism-gloss-pop-foot">
        {(term.seeIn || []).map(s => (
          <Link key={s.path} to={s.path} className="prism-gloss-pop-link" onClick={onClose}>
            {s.label}
            <ArrowRightIcon size={12} weight="bold" />
          </Link>
        ))}
        <Link to="/glossary" className="prism-gloss-pop-all" onClick={onClose}>
          Full glossary
        </Link>
      </div>
    </div>,
    document.body,
  )
}
