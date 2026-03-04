'use client'

import { useEffect, useRef, useState } from 'react'

const STOPS = [
  {
  id: 'japan',
  label: 'I. Japan',
  years: '2002 – 2022',
  heading: 'Foundation',
  flag: '🇯🇵',
  body: 'Growing up in Japan, I spent most of my time playing football, running, and building things, from Lego creations to small projects on my computer. When I built a simple website and realized how a few lines of code could create something real, I knew I wanted to keep building.',
  tags: ['Sports', 'Curiosity', 'Building', 'Discipline'],
  enterAt: 0.0,
  exitAt: 0.28,
},
  {
  id: 'australia',
  label: 'II. Australia',
  years: '2022 - 2023',
  heading: 'Discomfort',
  flag: '🇦🇺',
  body: 'When COVID disrupted my plans to study in New Zealand, I chose not to stay comfortable. Instead, I went to Australia on a working holiday. My English wasn’t strong, and everyday communication was challenging at first. Living and working in a diverse environment forced me to adapt quickly, communicate clearly, and grow more independent.',
  tags: ['Adaptability', 'Resilience', 'Diversity', 'Independence'],
  enterAt: 0.28,
  exitAt: 0.48,
},
  {
  id: 'nz',
  label: 'III. New Zealand',
  years: '2022 – 2025',
  heading: 'Growth',
  flag: '🇳🇿',
  body: 'Studying Computer Science and Finance in New Zealand pushed me to grow in ways I did not expect. Adapting to a different education system strengthened my independence, while constant collaboration taught me how to work effectively in diverse teams. Through hands-on projects, I developed deeper technical skills and became more confident in building real systems. Over time, I became more global in perspective and more ambitious about what I want to build.',
  tags: ['Collaboration', 'Independence', 'Technical Depth', 'Global Mindset'],
  enterAt: 0.48,
  exitAt: 0.82,
},
  {
  id: 'future',
  label: 'IV. Horizon',
  years: 'Future',
  heading: 'Next',
  flag: '🌏',
  body: 'I am looking for a role where I can continue to grow while contributing to meaningful work. I want to be in a diverse environment surrounded by passionate people who care about what they build. Constant learning, collaboration, and steady improvement are what drive me forward.',
  tags: ['Growth', 'Diverse Teams', 'Collaboration', 'Continuous Learning'],
  enterAt: 0.82,
  exitAt: 1.0,
},
] as const

const PATH_D = `
  M 282 210
  C 320 240, 540 820, 180 745
  C 220 790, 100 990, 350 820
  C 420 900, 485 980, 290 400
  C 260 260, 280 200, 282 210
`

export default function ShipJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const shipRef = useRef<SVGGElement>(null)
  const drawnRef = useRef<SVGPathElement>(null)
  const shipFloatRef = useRef<SVGGElement>(null)

  const [activeStop, setActiveStop] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let gsapCtx: any = null
    let tickerFn: (() => void) | null = null

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const container = containerRef.current
      const path = pathRef.current
      const ship = shipRef.current
      const drawn = drawnRef.current
      if (!container || !path || !ship || !drawn) return

      // Bail out entirely if SVG path isn't ready yet
      const total = path.getTotalLength()
      if (!total || !Number.isFinite(total)) return

      // Route draw setup
      gsap.set(drawn, { strokeDasharray: total, strokeDashoffset: total })

      const proxy = { t: 0 }
      // Bob offsets driven by sine waves via gsap.ticker
      const bob = { x: 0, y: 0, roll: 0 }
      const bobStart = performance.now()

      // Single source of truth: always reads proxy.t AND bob together
      const renderShip = () => {
        const L = proxy.t * total
        if (!Number.isFinite(L) || !total) return
        const clamped = Math.max(0, Math.min(L, total))
        const pt = path.getPointAtLength(clamped)
        const ptA = path.getPointAtLength(Math.min(clamped + 6, total))
        const angle = (Math.atan2(ptA.y - pt.y, ptA.x - pt.x) * 180) / Math.PI
        ship.setAttribute(
          'transform',
          `translate(${pt.x + bob.x} ${pt.y + bob.y}) rotate(${angle + bob.roll})`
        )
      }

      // Ticker runs every frame — drives the wiggle independently of scroll
      tickerFn = () => {
        const t = (performance.now() - bobStart) / 1000
        bob.y    = Math.sin(t * (Math.PI / 1.7)) * 5    // ±5px vertical
        bob.roll = Math.sin(t * (Math.PI / 2.1)) * 3    // ±3deg roll
        bob.x    = Math.sin(t * (Math.PI / 2.6)) * 1.5  // ±1.5px sway
        renderShip()
      }
      gsap.ticker.add(tickerFn)

      renderShip()
      setReady(true)

      gsapCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate(self) {
            if (!Number.isFinite(self.progress)) return
            proxy.t = self.progress                          // just update t …
            gsap.set(drawn, { strokeDashoffset: total - proxy.t * total })
            renderShip()                                     // … renderShip does the rest

            let active = 0
            for (let i = 0; i < STOPS.length; i++) {
              if (proxy.t >= STOPS[i].enterAt) active = i
            }
            setActiveStop(active)
          },
        })
      }, container)
    }

    init()

    return () => {
      if (tickerFn) gsap.ticker.remove(tickerFn)
      try {
        gsapCtx?.revert?.()
      } catch {
        // ignore
      }
    }
  }, [])

  const stop = STOPS[activeStop]

  return (
    <div ref={containerRef} style={{ height: '500vh', position: 'relative' }}>
      <div
        className="ship-journey-sticky"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          background: '#f2e8ce',
        }}
      >
        {/* ── LEFT: Map column ───────────────────────── */}
        <div
          className="ship-journey-map-col"
          style={{
            width: '48%',
            maxWidth: '620px',
            height: '100vh',
            position: 'relative',
            borderRight: '1px solid rgba(120,80,40,0.15)',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              padding: '0 0.5rem 0 2rem',
              boxSizing: 'border-box',
            }}
          >
            <svg
              viewBox="0 0 520 950"
              preserveAspectRatio="xMidYMid meet"
              style={{
                height: '82vh',
                width: 'auto',
                maxWidth: '100%',
                display: 'block',
                marginTop: '4vh',
              }}
              aria-hidden="true"
            >
              <defs>
                <filter id="paper" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
                  <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
                  <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
                  <feComposite in="blend" in2="SourceGraphic" operator="in" />
                </filter>

                <filter id="landShadow" x="-6%" y="-6%" width="112%" height="112%">
                  <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="rgba(90,55,20,0.22)" />
                </filter>

                <filter id="shipShadow" x="-100%" y="-100%" width="300%" height="300%">
                  <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor="rgba(60,30,10,0.55)" />
                </filter>

                <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="landFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0c98a" />
                  <stop offset="50%" stopColor="#d4b872" />
                  <stop offset="100%" stopColor="#c4a458" />
                </linearGradient>

                <clipPath id="clipAustralia">
                  <path d="M 102 340 C 112 316 132 302 158 295 C 182 288 210 290 234 300 C 258 310 278 330 288 354 C 298 378 300 406 294 430 C 288 452 272 470 252 480 C 230 490 204 490 182 480 C 160 470 144 452 136 430 C 126 406 122 380 120 360 C 118 352 108 348 105 344 Z" />
                </clipPath>
              </defs>

              <g transform="translate(0 0)">
                <rect width="520" height="950" fill="#ede2c0" />

                {/* Rhumb lines */}
                {[
                  [320, 200, 0, 600],
                  [320, 200, 80, 950],
                  [320, 200, 0, 950],
                  [320, 200, 400, 600],
                  [320, 200, 400, 950],
                  [320, 200, 160, 0],
                  [320, 200, 400, 0],
                  [320, 200, 0, 0],
                  [320, 200, 0, 200],
                ].map(([fx, fy, tx, ty], i) => (
                  <line key={i} x1={fx} y1={fy} x2={tx} y2={ty} stroke="rgba(140,100,50,0.1)" strokeWidth="0.7" />
                ))}

                {/* Grid */}
                {[95, 190, 285, 380, 475, 570, 665, 760, 855].map((y) => (
                  <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(140,100,50,0.09)" strokeWidth="0.6" strokeDasharray="3 7" />
                ))}
                {[50, 100, 150, 200, 250, 300, 350].map((x) => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x} y2="950" stroke="rgba(140,100,50,0.07)" strokeWidth="0.6" strokeDasharray="3 7" />
                ))}

                {/* Ocean label */}
                <text x="300" y="350" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="11" fontWeight="700" letterSpacing="0.18em" fill="rgba(120,85,40,0.35)" transform="rotate(-8, 310, 230)">
                  PACIFIC
                </text>
                <text x="320" y="368" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="11" fontWeight="700" letterSpacing="0.18em" fill="rgba(120,85,40,0.35)" transform="rotate(-8, 318, 248)">
                  OCEAN
                </text>

                {/* JAPAN */}
                <g id="japan" transform="translate(220 65) scale(1.75)" filter="url(#landShadow)">
                  <path d="M36.5951 14.3419C34.9284 16.5086 33.1951 22.5419 39.5951 29.3419V21.3419L54.0951 24.3419L56.0951 19.3419L63.5951 17.8419L59.0951 8.84189H52.5951L33.0951 0.841888L36.5951 14.3419Z" fill="url(#landFill)" stroke="#7a5028" strokeWidth="1.2" />
                  <path d="M33.0951 68.8419C49.9329 63.0306 42.0951 31.3419 42.0951 35.3419V31.3419H45.5951C54.5057 39.8555 58.3701 45.3821 59.0951 59.3419L63.5951 77.3419H57.5951L54.0951 83.3419H42.0951V92.3419L36.5951 90.3419L33.0951 85.3419L28.0951 83.3419L15.0951 88.3419H5.09509L13.5951 77.3419C20.0951 77.1752 33.0951 75.5419 33.0951 70.3419V68.8419Z" fill="url(#landFill)" stroke="#7a5028" strokeWidth="1.2" />
                  <path d="M3.09509 92.3419L0.595093 99.8419L2.09509 100.842L8.59509 103.342V110.342H15.0951L13.5951 96.8419L3.09509 92.3419Z" fill="url(#landFill)" stroke="#7a5028" strokeWidth="1" />
                  <path d="M21.5951 98.3419L17.5951 94.3419L19.5951 88.3419L29.0951 90.8419L21.5951 98.3419Z" fill="url(#landFill)" stroke="#7a5028" strokeWidth="1" />
                </g>
                
                <text x="230" y="160" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize="9" fill="rgba(90,55,20,0.65)" letterSpacing="0.14em">
                  JAPAN
                </text>

                {/* AUSTRALIA */}
                <g id="australia" transform="translate(40 550) scale(0.95)" filter="url(#landShadow)">
                  <path d="M0.8284 175.421C8.8284 183.821 21.8284 178.921 27.3284 175.421H51.3284L59.3284 170.921L75.3284 161.921L103.828 155.421L125.328 161.921L128.828 179.921L147.328 184.921V208.421H169.828L179.328 205.421L181.828 210.921L209.828 202.421L216.328 191.921C245.528 162.721 260.828 133.755 264.828 122.921L262.328 95.4212L245.828 66.4212L232.328 57.9212L225.828 22.9212L218.828 1.42117L199.828 45.9212L169.828 28.9212L175.828 8.42117L152.328 1.42117V7.92117H141.328L130.828 19.4212V28.4212H119.328V24.9212L111.328 19.4212L97.3284 36.9212H91.3284V44.9212H80.3284L67.8284 64.9212L37.8284 72.4212L19.3284 85.9212L8.3284 103.921L14.3284 113.421L8.3284 121.421C9.8284 133.255 10.8284 160.421 2.8284 174.421L0.8284 175.421Z" fill="url(#landFill)" stroke="#7a5028" strokeWidth="1.4" />
                  <path d="M181.162 233.754L179.328 237.421M181.162 233.754C182.347 230.792 183.162 227.088 181.828 224.421M181.162 233.754C180.569 235.236 179.884 236.532 179.328 237.421M181.162 233.754L185.828 224.421H181.828M181.828 224.421H175.828H164.328L159.328 243.921H164.328L179.328 237.421M152.328 1.42117L175.828 8.42117L169.828 28.9212L199.828 45.9212L218.828 1.42117L225.828 22.9212L232.328 57.9212L245.828 66.4212L262.328 95.4212L264.828 122.921C260.828 133.755 245.528 162.721 216.328 191.921L209.828 202.421L181.828 210.921L179.328 205.421L169.828 208.421H147.328V184.921L128.828 179.921L125.328 161.921L103.828 155.421L75.3284 161.921L59.3284 170.921L51.3284 175.421H27.3284C21.8284 178.921 8.8284 183.821 0.8284 175.421L2.8284 174.421C10.8284 160.421 9.8284 133.255 8.3284 121.421L14.3284 113.421L8.3284 103.921L19.3284 85.9212L37.8284 72.4212L67.8284 64.9212L80.3284 44.9212H91.3284V36.9212H97.3284L111.328 19.4212L119.328 24.9212V28.4212H130.828V19.4212L141.328 7.92117H152.328V1.42117" fill="none" stroke="rgba(120,80,30,0.18)" strokeWidth="0.9" clipPath="url(#clipAustralia)" />
                </g>
                <text x="100" y="750" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize="14" fontWeight="600" fill="rgba(90,55,20,0.55)" letterSpacing="0.12em">
                  Australia
                </text>

                {/* NEW ZEALAND */}
                <g id="newzealand" transform="translate(300 720) scale(1.25)" filter="url(#landShadow)">
                  <path d="M0.5 86.1327V90.6327L6.5 92.6327H12.5L19.5 90.6327H25L32 83.6327L38 75.1327L51.5 71.6327L61.5 65.1327L70.5 57.6327L72.5 51.1327H67.5L64 47.6327L58.5 54.6327H53.5L39 67.1327L29.5 71.6327H24L0.5 86.1327Z" fill="url(#landFill)" stroke="#7a5028" strokeWidth="1.2" />
                  <path d="M85 44.1327L81 39.1327V36.1327L89 34.6327L94 27.6327L95.5 16.1327L96.5 1.13269L103 7.63269C103.412 12.3824 105.724 14.779 103 18.6327L107.5 26.6327C109 24.6327 116.5 25.6327 116.5 25.6327L109 34.6327L100 36.1327L98 41.1327L88 50.1327L81 51.1327L85 44.1327Z" fill="url(#landFill)" stroke="#7a5028" strokeWidth="1.2" />
                </g>
                <text x="320" y="770" textAnchor="start" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize="8.5" fill="rgba(90,55,20,0.6)" letterSpacing="0.1em">
                  NEW ZEALAND
                </text>

                {/* Horizon */}
                <line x1="100" y1="888" x2="300" y2="888" stroke="rgba(120,80,40,0.2)" strokeWidth="0.8" strokeDasharray="6 8" />
                <text x="200" y="884" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize="8" fill="rgba(120,80,40,0.4)" letterSpacing="0.2em">
                  HORIZON
                </text>

                {/* Route */}
                <path d={PATH_D} fill="none" stroke="rgba(160,100,40,0.15)" strokeWidth="1.2" strokeDasharray="5 9" strokeLinecap="round" />
                <path ref={drawnRef} d={PATH_D} fill="none" stroke="#8b5e2a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#routeGlow)" opacity="0.85" />
                <path ref={pathRef} d={PATH_D} fill="none" stroke="transparent" strokeWidth="1" />

                {/* Stop markers */}
                {[
                  { x: 282, y: 210 },
                  { x: 180, y: 745 },
                  { x: 350, y: 820 },
                ].map((m, i) => (
                  <g key={i}>
                    <circle cx={m.x} cy={m.y} r="4.5" fill="#f2e8ce" stroke="#8b5e2a" strokeWidth="1.2" />
                    <circle cx={m.x} cy={m.y} r="1.8" fill="#8b5e2a" />
                  </g>
                ))}

                {/* ── Ship ───────────────────────────────────────── */}
                <g ref={shipRef} filter="url(#shipShadow)" opacity={ready ? 1 : 0} style={{ transition: 'opacity 0.5s ease' }}>
                  <g ref={shipFloatRef}>
                    {/* HULL */}
                    <path d="M 22 2 C 18 7, 8 10, -2 10 C -12 10, -22 8, -28 5 C -32 3, -34 0, -32 -2 C -30 -4, -28 -5, -18 -5 L 20 -5 C 24 -5, 26 -3, 22 2 Z" fill="#3d2408" stroke="#6b3f12" strokeWidth="0.7" />
                    <path d="M -26 2 C -20 3, 0 4, 20 2" fill="none" stroke="rgba(180,120,50,0.4)" strokeWidth="0.5" />
                    <path d="M -24 -1 C -18 0, 2 1, 20 -1" fill="none" stroke="rgba(180,120,50,0.3)" strokeWidth="0.4" />
                    <path d="M -28 5 L -38 4 L -40 -4 L -34 -6 L -28 -5 Z" fill="#4a2c0a" stroke="#6b3f12" strokeWidth="0.7" />
                    <circle cx="-35" cy="-1" r="1.5" fill="none" stroke="rgba(200,160,80,0.5)" strokeWidth="0.5" />
                    <path d="M 22 2 L 30 -1 L 22 -5 Z" fill="#3d2408" stroke="#6b3f12" strokeWidth="0.6" />
                    <line x1="28" y1="-2" x2="44" y2="-12" stroke="#5c3510" strokeWidth="0.9" strokeLinecap="round" />

                    {/* MASTS */}
                    <line x1="14" y1="-4" x2="14" y2="-34" stroke="#4a2c0a" strokeWidth="1.1" strokeLinecap="round" />
                    <line x1="2" y1="-28" x2="26" y2="-28" stroke="#4a2c0a" strokeWidth="0.8" strokeLinecap="round" />
                    <line x1="6" y1="-20" x2="22" y2="-20" stroke="#4a2c0a" strokeWidth="0.6" strokeLinecap="round" />
                    <line x1="-2" y1="-4" x2="-2" y2="-42" stroke="#4a2c0a" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="-18" y1="-36" x2="14" y2="-36" stroke="#4a2c0a" strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="-14" y1="-26" x2="10" y2="-26" stroke="#4a2c0a" strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="-10" y1="-16" x2="6" y2="-16" stroke="#4a2c0a" strokeWidth="0.6" strokeLinecap="round" />
                    <line x1="-20" y1="-5" x2="-20" y2="-28" stroke="#4a2c0a" strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="-30" y1="-22" x2="-10" y2="-22" stroke="#4a2c0a" strokeWidth="0.7" strokeLinecap="round" />

                    {/* SAILS */}
                    <path d="M 14 -34 C 22 -30, 24 -24, 22 -20 L 6 -20 C 4 -24, 6 -30 14 -34 Z" fill="rgba(242,232,200,0.88)" stroke="#9a7040" strokeWidth="0.5" />
                    <line x1="14" y1="-34" x2="22" y2="-20" stroke="rgba(120,80,30,0.2)" strokeWidth="0.4" />
                    <line x1="8" y1="-32" x2="18" y2="-20" stroke="rgba(120,80,30,0.15)" strokeWidth="0.3" />
                    <path d="M 2 -28 C 6 -24, 8 -18, 7 -12 L 0 -10 L -4 -12 C -2 -18, 2 -24 2 -28 Z" fill="rgba(235,225,192,0.9)" stroke="#9a7040" strokeWidth="0.5" />
                    <path d="M 26 -28 C 22 -24, 20 -18, 21 -12 L 28 -10 L 30 -14 C 28 -20, 26 -24 26 -28 Z" fill="rgba(235,225,192,0.9)" stroke="#9a7040" strokeWidth="0.5" />
                    <path d="M -2 -42 C 10 -37, 13 -30, 12 -26 L -16 -26 C -16 -30, -12 -37 -2 -42 Z" fill="rgba(242,232,200,0.9)" stroke="#9a7040" strokeWidth="0.5" />
                    <line x1="-2" y1="-42" x2="12" y2="-26" stroke="rgba(120,80,30,0.2)" strokeWidth="0.4" />
                    <line x1="-8" y1="-40" x2="4" y2="-26" stroke="rgba(120,80,30,0.15)" strokeWidth="0.3" />
                    <line x1="-2" y1="-42" x2="-14" y2="-28" stroke="rgba(120,80,30,0.18)" strokeWidth="0.35" />
                    <path d="M -18 -36 C -14 -30, -12 -22, -13 -16 L -20 -14 L -24 -18 C -22 -24, -20 -30 -18 -36 Z" fill="rgba(232,220,188,0.88)" stroke="#9a7040" strokeWidth="0.5" />
                    <path d="M 14 -36 C 10 -30, 8 -22, 9 -16 L 16 -14 L 18 -18 C 16 -24, 14 -30 14 -36 Z" fill="rgba(232,220,188,0.88)" stroke="#9a7040" strokeWidth="0.5" />
                    <path d="M -30 -22 C -24 -18, -22 -12, -23 -8 L -30 -6 L -34 -10 C -32 -14, -30 -18 -30 -22 Z" fill="rgba(228,216,183,0.85)" stroke="#9a7040" strokeWidth="0.5" />
                    <path d="M 28 -2 C 32 -6, 38 -8, 44 -12 L 38 -6 C 36 -4, 32 -2 28 -2 Z" fill="rgba(240,230,196,0.8)" stroke="#9a7040" strokeWidth="0.5" />

                    {/* RIGGING */}
                    <line x1="-2" y1="-42" x2="28" y2="-2" stroke="rgba(80,50,20,0.35)" strokeWidth="0.45" />
                    <line x1="-2" y1="-42" x2="-36" y2="-2" stroke="rgba(80,50,20,0.3)" strokeWidth="0.4" />
                    <line x1="14" y1="-34" x2="44" y2="-12" stroke="rgba(80,50,20,0.3)" strokeWidth="0.4" />
                    <line x1="14" y1="-34" x2="-2" y2="-4" stroke="rgba(80,50,20,0.25)" strokeWidth="0.35" />
                    <line x1="-20" y1="-28" x2="-2" y2="-4" stroke="rgba(80,50,20,0.25)" strokeWidth="0.35" />
                    <line x1="-16" y1="-36" x2="-8" y2="-4" stroke="rgba(80,50,20,0.2)" strokeWidth="0.3" />
                    <line x1="12" y1="-36" x2="4" y2="-4" stroke="rgba(80,50,20,0.2)" strokeWidth="0.3" />

                    {/* FLAGS */}
                    <path d="M -2 -43 L 6 -40 L -2 -37 Z" fill="#8b5e2a" />
                    <line x1="-38" y1="-4" x2="-38" y2="-12" stroke="#4a2c0a" strokeWidth="0.7" />
                    <path d="M -38 -12 L -32 -10 L -38 -8 Z" fill="#8b5e2a" />

                    {/* WAKE LINES */}
                    <path d="M -34 4 C -40 6, -50 7, -56 6" fill="none" stroke="rgba(160,120,60,0.4)" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M -32 7 C -38 9, -46 10, -52 9" fill="none" stroke="rgba(160,120,60,0.3)" strokeWidth="0.6" strokeLinecap="round" />
                    <path d="M -34 1 C -42 2, -50 2, -56 1" fill="none" stroke="rgba(160,120,60,0.25)" strokeWidth="0.5" strokeLinecap="round" />
                  </g>
                </g>
                

                {/* Compass rose */}
                <g transform="translate(355, 900)" opacity="0.55">
                  <circle r="28" fill="rgba(242,232,200,0.7)" stroke="#8b5e2a" strokeWidth="1" />
                  <circle r="20" fill="none" stroke="rgba(140,90,40,0.3)" strokeWidth="0.6" strokeDasharray="2 4" />
                  <circle r="5" fill="#8b5e2a" />
                  <polygon points="0,-26 3,-12 0,-17 -3,-12" fill="#6b3f12" />
                  <polygon points="0,26 3,12 0,17 -3,12" fill="rgba(120,80,30,0.5)" />
                  <polygon points="26,0 12,3 17,0 12,-3" fill="rgba(120,80,30,0.5)" />
                  <polygon points="-26,0 -12,3 -17,0 -12,-3" fill="rgba(120,80,30,0.5)" />
                  {[45, 135, 225, 315].map((deg) => (
                    <line
                      key={deg}
                      x1={Math.cos((deg * Math.PI) / 180) * 20}
                      y1={Math.sin((deg * Math.PI) / 180) * 20}
                      x2={Math.cos((deg * Math.PI) / 180) * 26}
                      y2={Math.sin((deg * Math.PI) / 180) * 26}
                      stroke="#8b5e2a"
                      strokeWidth="0.8"
                    />
                  ))}
                  <text y="-31" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="9" fontWeight="700" fill="#5a3510">N</text>
                  <text y="40" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="9" fill="rgba(90,55,20,0.7)">S</text>
                  <text x="34" y="3" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="9" fill="rgba(90,55,20,0.7)">E</text>
                  <text x="-34" y="3" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="9" fill="rgba(90,55,20,0.7)">W</text>
                </g>

                {/* Border + signature */}
                <rect x="5" y="5" width="510" height="940" rx="3" fill="none" stroke="rgba(120,80,40,0.2)" strokeWidth="1.2" />
                <rect x="9" y="9" width="502" height="932" rx="2" fill="none" stroke="rgba(120,80,40,0.1)" strokeWidth="0.6" />
                <text x="200" y="935" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize="8" fill="rgba(120,80,40,0.35)" letterSpacing="0.14em">
                  CARTA NAVIGATORIA · YUSEI TOKITO
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* ── RIGHT: Content column ────────────────────────────── */}
        <div
          className="ship-journey-content-col"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '4rem 4rem 4rem 3.5rem',
            position: 'relative',
            background: 'linear-gradient(to right, rgba(242,232,200,0.3), transparent)',
          }}
        >
          {/* Progress indicator */}
          <div style={{ position: 'absolute', top: '2rem', left: '3.5rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
            {STOPS.map((s, i) => (
              <div
                key={i}
                style={{
                  height: '3px',
                  borderRadius: '2px',
                  width: i === activeStop ? '28px' : '8px',
                  background: i <= activeStop ? '#8b5e2a' : 'rgba(139,94,42,0.2)',
                  transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div key={activeStop} style={{ maxWidth: '620px', animation: 'sj-fadein 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>
            <p
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#8b5e2a',
                marginBottom: '0.75rem',
              }}
            >
              {stop.label}
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.85rem', marginBottom: '0.4rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                {stop.heading}
              </h2>
              <span style={{ fontSize: '2.2rem', lineHeight: 1, paddingBottom: '0.15rem' }}>{stop.flag}</span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.68rem',
                letterSpacing: '0.16em',
                color: '#8b5e2a',
                marginBottom: '1.4rem',
                textTransform: 'uppercase',
              }}
            >
              {stop.years}
            </p>

            <div style={{ width: '44px', height: '2px', background: '#8b5e2a', marginBottom: '1.5rem', borderRadius: '1px' }} />

            <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '1.08rem', lineHeight: 1.75, color: 'var(--ink-light)', marginBottom: '2rem' }}>
              {stop.body}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {stop.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.28rem 0.8rem',
                    background: 'rgba(139,94,42,0.08)',
                    border: '1px solid rgba(139,94,42,0.28)',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '0.7rem',
                    color: '#5a3510',
                    letterSpacing: '0.04em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          {activeStop === 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                opacity: 0.42,
                animation: 'sj-fadein 1.2s ease 0.8s both',
              }}
            >
              <svg width="13" height="22" viewBox="0 0 13 22" fill="none">
                <rect x="1" y="1" width="11" height="17" rx="5.5" stroke="#8b5e2a" strokeWidth="1.1" />
                <rect x="5" y="4" width="3" height="4" rx="1.5" fill="#8b5e2a">
                  <animate attributeName="y" values="4;10;4" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite" />
                </rect>
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-light)',
                }}
              >
                Scroll to sail
              </span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes sj-fadein {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .ship-journey-sticky {
            flex-direction: column !important;
          }
          .ship-journey-map-col {
            width: 100% !important;
            max-width: 100% !important;
            height: 45vh !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(120,80,40,0.15) !important;
          }
          .ship-journey-map-col svg {
            height: 43vh !important;
            margin-top: 0 !important;
          }
          .ship-journey-content-col {
            padding: 2rem 1.5rem !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  )
}
