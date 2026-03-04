import Navbar from '@/components/Navbar'
import ShipJourney from '@/components/ShipJourney'
import LandmarkCard from '@/components/LandmarkCard'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import Section from '@/components/Section'

// ─── Projects data ─────────────────────────────────────────────
const projects = [
  {
    title: 'Serverless To-Do App',
    subtitle: 'AWS · Lambda · DynamoDB',
    description:
      'A fully serverless task management app on AWS. Lambda for CRUD, DynamoDB for persistence, API Gateway for REST endpoints, Cognito for auth.',
    tags: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'TypeScript'],
    icon: '☁️',
  },
  {
    title: 'NZ Trip Planner',
    subtitle: 'Maps API · Weather API',
    description:
      'Interactive trip planner built during my NZ exchange. Google Maps routing, OpenWeather forecasts, local itinerary storage with export.',
    tags: ['React', 'Google Maps', 'OpenWeather', 'Node.js'],
    icon: '🗺️',
  },
  {
    title: 'AI Card Game',
    subtitle: 'Genetic Algorithm · Simulation',
    description:
      'AI agents evolve card strategies via genetic algorithm. Population search, fitness evaluation, crossover and mutation for emergent gameplay.',
    tags: ['Python', 'Genetic Algorithm', 'NumPy', 'OOP'],
    icon: '🃏',
  },
]

// ─── Skills data ───────────────────────────────────────────────
const skillGroups = [
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP'],
  },
  {
    category: 'Backend & Cloud',
    skills: ['Node.js', 'Python', 'AWS Lambda', 'DynamoDB', 'PostgreSQL'],
  },
  {
    category: 'Other',
    skills: ['Git', 'Docker', 'REST APIs', 'Agile', 'Financial Modelling'],
  },
]

export default function Home() {
  return (
    <>
      <Navbar />

      <main>

        {/* ══════════════════════════════════════════════════════
            HERO — Full-screen landing above the journey
        ══════════════════════════════════════════════════════ */}
        <section
          id="hero"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--paper)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle background texture lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 39px,
                rgba(190,140,70,0.07) 39px,
                rgba(190,140,70,0.07) 40px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 79px,
                rgba(190,140,70,0.04) 79px,
                rgba(190,140,70,0.04) 80px
              )
            `,
            pointerEvents: 'none',
          }} />

          <div className="max-w-6xl mx-auto px-6 w-full" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '720px' }}>

              {/* Eyebrow */}
              <p style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '1.25rem',
              }}>
                
              </p>

              {/* Name */}
              <h1 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                color: 'var(--ink)',
                letterSpacing: '-0.03em',
                marginBottom: '1.75rem',
              }}>
                Yusei<br />
                <span style={{ color: 'var(--gold)' }}>Tokito</span>
                <span style={{ color: 'var(--gold)', fontSize: '0.55em' }}>.</span>
              </h1>

              {/* Gold rule */}
              <div style={{ width: '56px', height: '2px', background: 'var(--gold)', marginBottom: '1.75rem' }} />

              {/* Subtitle */}
              <p style={{
                fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)',
                color: 'var(--ink-light)',
                fontFamily: 'var(--font-crimson)',
                fontStyle: 'italic',
                lineHeight: 1.65,
                marginBottom: '3rem',
                maxWidth: '520px',
              }}>
                Computer Science & Finance student building scalable systems across three countries.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
                <a href="#projects" className="btn-primary">
                  View Projects <span style={{ marginLeft: '4px' }}>→</span>
                </a>
                <a href="#contact" className="btn-outline">
                  Get in Touch
                </a>
              </div>

              {/* Scroll cue */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5 }}>
                <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
                  <rect x="1" y="1" width="12" height="18" rx="6" stroke="#be8c46" strokeWidth="1.2" />
                  <rect x="5.5" y="4" width="3" height="5" rx="1.5" fill="#be8c46">
                    <animate attributeName="y" values="4;11;4" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite" />
                  </rect>
                </svg>
                <span style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-light)',
                }}>
                  The voyage begins below
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SHIP JOURNEY — The cinematic scroll-driven centerpiece
            Japan → Australia → New Zealand → Future
        ══════════════════════════════════════════════════════ */}
        <section id="journey" style={{ background: 'var(--paper)' }}>
          {/* Section header — above the sticky journey */}
          <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: '5rem', paddingBottom: '2rem' }}>
            <p className="section-label">— The Voyage</p>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--ink)',
            }}>
              A Journey Across Three Countries
            </h2>
          </div>

          {/* The cinematic ship component */}
          <ShipJourney />
        </section>

        {/* ══════════════════════════════════════════════════════
            PROJECTS
        ══════════════════════════════════════════════════════ */}
        <Section
          id="projects"
          style={{
            paddingTop: '7rem',
            paddingBottom: '7rem',
            background: 'var(--paper)',
          }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <p className="section-label">— Islands of Treasure</p>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}>
              Projects
            </h2>
            <div style={{ width: '56px', height: '2px', background: 'var(--gold)', margin: '1rem 0 2rem' }} />
            <p style={{
              maxWidth: '480px',
              color: 'var(--ink-light)',
              marginBottom: '3.5rem',
              fontSize: '1.05rem',
              fontFamily: 'var(--font-crimson)',
            }}>
              Each project is an island discovered through curiosity, built with intention.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {projects.map(p => <LandmarkCard key={p.title} {...p} />)}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            SKILLS
        ══════════════════════════════════════════════════════ */}
        <Section
          id="skills"
          style={{
            paddingTop: '5rem',
            paddingBottom: '7rem',
            background: 'rgba(190,140,70,0.04)',
            borderTop: '1px solid rgba(190,140,70,0.12)',
            borderBottom: '1px solid rgba(190,140,70,0.12)',
          }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <p className="section-label">— Supplies & Tools</p>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}>
              Skills
            </h2>
            <div style={{ width: '56px', height: '2px', background: 'var(--gold)', margin: '1rem 0 2.5rem' }} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}>
              {skillGroups.map(group => (
                <div key={group.category} className="note-card p-6">
                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--ink)',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(190,140,70,0.18)',
                  }}>
                    {group.category}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {group.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            CONTACT
        ══════════════════════════════════════════════════════ */}
        <Section
          id="contact"
          style={{ paddingTop: '7rem', paddingBottom: '5rem', background: 'var(--paper)' }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <p className="section-label">— Treasure Chest</p>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}>
              Send a Message
            </h2>
            <div style={{ width: '56px', height: '2px', background: 'var(--gold)', margin: '1rem 0 1.5rem' }} />
            <p style={{
              maxWidth: '480px',
              color: 'var(--ink-light)',
              marginBottom: '2.5rem',
              fontSize: '1.05rem',
              fontFamily: 'var(--font-crimson)',
            }}>
              Found the treasure? Drop me a note — open to collaborations, roles, and good conversations.
            </p>
            <div style={{ maxWidth: '560px' }}>
              <ContactForm />
            </div>
          </div>
        </Section>

      </main>

      <Footer />
    </>
  )
}
