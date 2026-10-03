import { useEffect } from 'react'
import { LEGAL, SITE_NAME, legalHasPlaceholders } from '../config.js'

// Renders a value from LEGAL. Values still in [BRACKETS] are highlighted so a
// placeholder can't slip through unnoticed.
export function Fill({ children }) {
  const text = String(children)
  return text.startsWith('[') ? <mark className="todo">{text}</mark> : <>{text}</>
}

export default function LegalPage({ title, children }) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} | ${SITE_NAME}`
    return () => {
      document.title = previous
    }
  }, [title])

  return (
    <section className="section">
      <div className="container legal">
        {legalHasPlaceholders && (
          <div className="legal__draft" role="note">
            <strong>Draft.</strong> This page still has highlighted placeholders and hasn’t
            been reviewed yet. Fill them in (see <code>LEGAL</code> in <code>src/config.js</code>)
            and have a lawyer check it before relying on it.
          </div>
        )}
        <h1 className="h2">{title}</h1>
        <p className="legal__updated">Last updated: {LEGAL.lastUpdated}</p>
        {children}
      </div>
    </section>
  )
}
