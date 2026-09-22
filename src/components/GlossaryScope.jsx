import { useCallback, useEffect, useRef, useState } from 'react'
import { getMatcher, TERMS } from '../data/glossary.js'
import GlossaryPopover from './GlossaryPopover.jsx'

/* =====================================================================
   GlossaryScope — auto-links glossary terms inside its subtree.

   Wrap a page's content and the first mention of each glossary term in
   static prose becomes an <abbr class="prism-gloss"> that opens a
   definition popover on hover, focus or tap. No prose edits required.

   Opting out: put data-no-gloss on any element to exclude its subtree.
   Headings and the shared nav are excluded automatically; page heroes
   should carry data-no-gloss so first mentions land in body copy.

   --- Why the "safe parent" rule below matters -----------------------
   Annotating means replacing a text node with a fragment. React holds a
   reference to the text nodes it created; if it later tries to remove
   one we have detached, it throws NotFoundError and the page dies.

   So we only ever touch an element whose children React rendered as a
   SINGLE text node (`<p>some prose</p>`). For that shape React's only
   update path is setTextContent on the parent, which harmlessly wipes
   our annotations — and the observer below puts them straight back.
   Mixed content (`<p>text <b>bold</b></p>`) is left alone; that is the
   shape where React removes individual children, and the one that
   would actually crash.
   ===================================================================== */

/* Headings are structural, not prose: linking a term in a page title
 * looks like chrome, and — because a persistent hero outlives the tab
 * panels below it — it would permanently consume that term's
 * "first mention" slot and starve the body copy. */
const SKIP_TAGS = /^(ABBR|A|NAV|H1|H2|H3|H4|H5|H6|CODE|PRE|SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|BUTTON|SVG|PATH|CANVAS)$/

/* True when we may rewrite this element's text children.
 *  - nothing foreign among the children (only text + abbrs we added)
 *  - and, before we have touched it, exactly one text child */
function isSafeParent(el) {
  const kids = el.childNodes
  let texts = 0
  let ours = 0
  for (const c of kids) {
    if (c.nodeType === Node.TEXT_NODE) { texts++; continue }
    if (c.nodeType === Node.ELEMENT_NODE && c.classList.contains('prism-gloss')) { ours++; continue }
    return false
  }
  return ours > 0 || texts === 1
}

export default function GlossaryScope({ children, className, style }) {
  const rootRef = useRef(null)
  const [active, setActive] = useState(null)   // { term, rect }
  const closeTimer = useRef(0)

  /* ---------------- annotation ---------------- */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const { regex, resolve } = getMatcher()
    let timer = 0
    let mo = null

    const annotate = () => {
      // Seed from what is already in the DOM so "first mention only"
      // stays stable across the many passes the observer triggers.
      const seen = new Set()
      root.querySelectorAll('.prism-gloss[data-term-id]')
        .forEach(el => seen.add(el.dataset.termId))

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT
          const parent = n.parentElement
          if (!parent || !isSafeParent(parent)) return NodeFilter.FILTER_REJECT
          for (let p = parent; p && p !== root.parentElement; p = p.parentElement) {
            if (SKIP_TAGS.test(p.tagName)) return NodeFilter.FILTER_REJECT
            if (p.hasAttribute('data-no-gloss')) return NodeFilter.FILTER_REJECT
            if (p.isContentEditable) return NodeFilter.FILTER_REJECT
            if (p.className && typeof p.className === 'string' &&
                p.className.includes('recharts')) return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT
        },
      })

      const nodes = []
      for (let n; (n = walker.nextNode());) nodes.push(n)

      // Stop observing while we write, then resume — our own edits must
      // not queue another pass. (A `writing` boolean cannot do this:
      // observer callbacks are microtasks and arrive after the flag has
      // already been cleared.)
      mo?.disconnect()
      try {
        nodes.forEach(node => {
          const text = node.nodeValue
          regex.lastIndex = 0
          let frag = null
          let last = 0
          let m
          while ((m = regex.exec(text))) {
            const term = resolve(m[1])
            if (!term) continue
            const key = String(term.id)
            if (seen.has(key)) continue
            seen.add(key)

            frag = frag || document.createDocumentFragment()
            frag.appendChild(document.createTextNode(text.slice(last, m.index)))

            const a = document.createElement('abbr')
            a.className = 'prism-gloss'
            a.dataset.termId = key
            a.setAttribute('tabindex', '0')
            a.setAttribute('role', 'button')
            a.setAttribute('aria-label', `${term.term} — glossary definition`)
            a.textContent = m[1] + m[2]
            frag.appendChild(a)
            last = m.index + m[0].length
          }
          if (!frag) return
          frag.appendChild(document.createTextNode(text.slice(last)))
          node.parentNode.replaceChild(frag, node)
        })
      } finally {
        observe()
      }
    }

    // Debounced with setTimeout, deliberately NOT requestAnimationFrame:
    // Chrome does not fire rAF callbacks in a background tab, so a
    // pending rAF would never clear its guard and the annotator would
    // wedge for good on any page opened in a background tab.
    const schedule = () => {
      clearTimeout(timer)
      timer = setTimeout(annotate, 50)
    }

    const observe = () => {
      mo?.observe(root, { childList: true, subtree: true, characterData: true })
    }

    mo = new MutationObserver(schedule)
    annotate()   // also starts observing, via the finally above

    return () => {
      mo.disconnect()
      mo = null
      clearTimeout(timer)
    }
  }, [])

  /* ---------------- interaction (delegated) ---------------- */
  const open = useCallback(el => {
    clearTimeout(closeTimer.current)
    const term = TERM_BY_ID.get(el.dataset.termId)
    if (term) setActive({ term, rect: el.getBoundingClientRect() })
  }, [])

  const closeSoon = useCallback(() => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActive(null), 160)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const hit = e => e.target.closest?.('.prism-gloss')

    const onOver = e => { const el = hit(e); if (el) open(el) }
    const onOut = e => { if (hit(e)) closeSoon() }
    const onFocus = e => { const el = hit(e); if (el) open(el) }
    const onBlur = e => { if (hit(e)) closeSoon() }
    const onClick = e => {
      const el = hit(e)
      if (!el) return
      e.preventDefault()
      open(el)
    }
    const onKey = e => {
      const el = hit(e)
      if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(el) }
    }

    root.addEventListener('mouseover', onOver)
    root.addEventListener('mouseout', onOut)
    root.addEventListener('focusin', onFocus)
    root.addEventListener('focusout', onBlur)
    root.addEventListener('click', onClick)
    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('mouseover', onOver)
      root.removeEventListener('mouseout', onOut)
      root.removeEventListener('focusin', onFocus)
      root.removeEventListener('focusout', onBlur)
      root.removeEventListener('click', onClick)
      root.removeEventListener('keydown', onKey)
      clearTimeout(closeTimer.current)
    }
  }, [open, closeSoon])

  /* Escape, outside click and scroll all dismiss. */
  useEffect(() => {
    if (!active) return
    const onKey = e => { if (e.key === 'Escape') setActive(null) }
    const onScroll = () => setActive(null)
    const onDown = e => {
      if (!e.target.closest?.('.prism-gloss-pop') && !e.target.closest?.('.prism-gloss')) setActive(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [active])

  return (
    <div ref={rootRef} className={className} style={style}>
      {children}
      {active && (
        <GlossaryPopover
          term={active.term}
          rect={active.rect}
          onHold={() => clearTimeout(closeTimer.current)}
          onRelease={closeSoon}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}

/* Term lookup by id, built once at module load. */
const TERM_BY_ID = new Map(TERMS.map(t => [String(t.id), t]))
