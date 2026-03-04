'use client'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(190,140,70,0.2)',
        padding: '3rem 0',
        marginTop: '4rem',
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}
      >
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', color: 'var(--ink)', fontWeight: 700 }}>
          Y<span style={{ color: 'var(--gold)' }}>.</span>T
        </span>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>
          Charting new territories · {new Date().getFullYear()}
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['GitHub', 'LinkedIn', 'Email'].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
