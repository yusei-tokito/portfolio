'use client'

import { useEffect, useRef } from 'react'

interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Section({ id, children, className = '', style }: SectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
        }
      },
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      className={`section-reveal ${className}`}
      style={style}
    >
      {children}
    </section>
  )
}
