interface LandmarkCardProps {
  title: string
  subtitle?: string
  description: string
  tags?: string[]
  icon?: string
  href?: string
}

export default function LandmarkCard({
  title,
  subtitle,
  description,
  tags = [],
  icon,
  href,
}: LandmarkCardProps) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer', style: { textDecoration: 'none' } }
    : {}

  return (
    <Wrapper className="note-card p-6 block" {...wrapperProps}>
      {icon && (
        <div
          style={{
            fontSize: '1.75rem',
            marginBottom: '0.75rem',
            lineHeight: 1,
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: subtitle ? '0.2rem' : '0.6rem',
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            marginBottom: '0.6rem',
          }}
        >
          {subtitle}
        </p>
      )}
      <p
        style={{
          color: 'var(--ink-light)',
          fontSize: '0.98rem',
          lineHeight: 1.6,
          marginBottom: tags.length ? '1rem' : 0,
        }}
      >
        {description}
      </p>
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map((tag) => (
            <span key={tag} className="skill-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Wrapper>
  )
}
