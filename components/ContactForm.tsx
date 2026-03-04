'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  // Honeypot (hidden field for bots)
  const [company, setCompany] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const canSend =
    status !== 'sending' &&
    form.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.message.trim().length >= 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        setStatus('error')
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setCompany('')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="note-card p-8" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️</div>
        <h3
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: '0.5rem',
          }}
        >
          Message Received
        </h3>
        <p style={{ color: 'var(--ink-light)' }}>
          Your message has been sealed and sent. I'll respond when the tide turns.
        </p>

        <button
          className="btn-primary"
          style={{ marginTop: '1.25rem' }}
          onClick={() => setStatus('idle')}
        >
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Honeypot (hidden) */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      />

      <div>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink-light)',
            marginBottom: '0.4rem',
          }}
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="form-input"
        />
      </div>

      <div>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink-light)',
            marginBottom: '0.4rem',
          }}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="form-input"
        />
      </div>

      <div>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink-light)',
            marginBottom: '0.4rem',
          }}
        >
          Message
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message..."
          rows={5}
          className="form-input"
          style={{ resize: 'vertical', minHeight: '130px' }}
        />
      </div>

      {status === 'error' && (
        <p style={{ color: 'crimson', fontSize: '0.95rem' }}>{error}</p>
      )}

      <button
        className="btn-primary"
        type="submit"
        disabled={!canSend}
        style={{
          alignSelf: 'flex-start',
          opacity: canSend ? 1 : 0.6,
          cursor: canSend ? 'pointer' : 'not-allowed',
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}