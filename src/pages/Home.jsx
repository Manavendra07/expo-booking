import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight, ArrowRight, Calendar, BarChart2, Users, Building2,
  MapPin, Star, Clock, CheckCircle, Zap, Shield, Search, ChevronDown,
  ChevronLeft, ArrowUpRight, Sparkles, MousePointer, Award, TrendingUp
} from 'lucide-react'
import { venues, testimonials } from '../data/staticData'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ─── Scroll Progress Bar ────────────────────────────────────────────── */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]" style={{ background: 'rgba(201,168,76,0.08)' }}>
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
          transition: 'width 0.1s ease',
          boxShadow: '0 0 8px rgba(201,168,76,0.6)'
        }}
      />
    </div>
  )
}

/* ─── Parallax hook ─────────────────────────────────────────────────── */
function useParallax(speed = 0.18) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      el.style.transform = `translateY(${center * speed}px)`
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [speed])
  return ref
}

/* ─── Animated Count-Up ──────────────────────────────────────────────── */
function CountUp({ value, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          let t0 = null
          const dur = 2400
          const step = (ts) => {
            if (!t0) t0 = ts
            const p = Math.min((ts - t0) / dur, 1)
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * value))
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [value])
  return (
    <div ref={ref} className="text-center group cursor-default">
      <div className="gold-shimmer font-display text-5xl md:text-6xl font-bold mb-2 leading-none">
        {prefix}{count}{suffix}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 1: HERO                                                         */
/* ═══════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const heroImages = [
    'https://images.unsplash.com/photo-1592494804071-faea15d93a8a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1699166877362-73cba7e56867?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1592494804071-faea15d93a8a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1709809328185-ba9ee5a06121?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=90',
  ]
  const kenClasses = ['ken-burns', 'ken-burns-2', 'ken-burns', 'ken-burns-2', 'ken-burns']
  const [heroIdx, setHeroIdx] = useState(0)
  const [prev, setPrev] = useState(null)
  const [search, setSearch] = useState({ date: '', type: '', guests: '' })

  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx((p) => {
        setPrev(p)
        return (p + 1) % heroImages.length
      })
    }, 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG images with Ken Burns */}
      {heroImages.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden"
          style={{ transition: 'opacity 1.6s ease', opacity: i === heroIdx ? 1 : 0, zIndex: i === heroIdx ? 1 : (i === prev ? 0 : -1) }}
        >
          <img
            src={img} alt=""
            className={`w-full h-full object-cover ${i === heroIdx ? kenClasses[i] : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070d1a]/98 via-[#070d1a]/70 to-[#070d1a]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a]/80 via-transparent to-[#070d1a]/20" />
        </div>
      ))}

      {/* Grad orbs */}
      <div className="orb w-[900px] h-[900px] bg-teal-800/15 -right-72 top-1/2 -translate-y-1/2 z-[2]" />
      <div className="orb w-80 h-80 bg-gold-500/6 left-1/3 -top-28 z-[2]" />

      {/* Dot indicator — right edge */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[10]">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => { setPrev(heroIdx); setHeroIdx(i) }}
            className="rounded-full transition-all duration-500"
            style={{ width: 5, height: i === heroIdx ? 36 : 5, background: i === heroIdx ? '#c9a84c' : 'rgba(255,255,255,0.18)' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative section-container pt-28 pb-20 w-full z-[3]">
        <div className="max-w-3xl">
          {/* Label */}
          <div className="flex items-center gap-3 mb-7 animate-slide-up">
            <div className="h-px w-12 bg-gold-400" />
            <span className="text-gold-400 text-sm tracking-[0.35em] uppercase font-sans">
              India's Premier Smart Booking Engine
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-display text-6xl md:text-7xl lg:text-[86px] text-cream leading-[1.01] mb-8 animate-slide-up"
            style={{ animationDelay: '0.15s' }}
          >
            Where Grand<br />
            <em className="gold-shimmer not-italic">Events</em>{' '}
            <span className="text-cream/90">Begin</span>
          </h1>

          <p
            className="text-cream/85 text-xl md:text-2xl leading-relaxed mb-10 max-w-lg font-sans font-light animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            Discover, book, and host your event at India's finest venues — in minutes.
          </p>

          {/* Search glass card */}
          <div
            className="glass rounded-2xl p-5 mb-8 max-w-xl border border-gold-500/20 animate-slide-up"
            style={{ animationDelay: '0.45s' }}
          >
            <p className="text-gold-400/60 text-[12px] tracking-[0.3em] uppercase font-sans mb-4">Find Your Perfect Venue</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-3 sm:col-span-1">
                <label className="text-cream/80 text-[12px] tracking-widest uppercase mb-1.5 block font-sans">Event Date</label>
                <input type="date" value={search.date} onChange={(e) => setSearch((p) => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base rounded-lg" />
              </div>
              <div>
                <label className="text-cream/80 text-[12px] tracking-widest uppercase mb-1.5 block font-sans">Event Type</label>
                <select value={search.type} onChange={(e) => setSearch((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base rounded-lg appearance-none">
                  <option value="">All Types</option>
                  {['Conference', 'Exhibition', 'Wedding', 'Corporate', 'Gala'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-cream/80 text-[12px] tracking-widest uppercase mb-1.5 block font-sans">Guests</label>
                <input type="number" placeholder="No. of guests" value={search.guests}
                  onChange={(e) => setSearch((p) => ({ ...p, guests: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base rounded-lg" />
              </div>
            </div>
            <Link to={`/venues?date=${search.date}&type=${search.type}&guests=${search.guests}`}
              className="btn-gold w-full py-3.5 rounded-xl flex items-center justify-center gap-2">
              <Search size={14} /> Check Availability
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-5 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link to="/venues" className="btn-outline px-7 py-3 rounded-xl flex items-center gap-2 text-sm">
              Browse Venues <ArrowRight size={13} />
            </Link>
            <div className="flex items-center gap-2.5 text-cream/65 text-sm font-sans">
              <div className="flex -space-x-2">
                {['photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330', 'photo-1560250097-0b93528c311a'].map((id, i) => (
                  <img key={i} src={`https://images.unsplash.com/${id}?w=60&q=70`}
                    className="w-7 h-7 rounded-full border-2 border-navy-900 object-cover" alt="" />
                ))}
              </div>
              <span><strong className="text-cream">500+</strong> events booked this year</span>
            </div>
          </div>
        </div>

        {/* Floating venue cards — right desktop */}
        <div className="hidden xl:flex flex-col gap-5 absolute right-10 top-1/2 -translate-y-[35%] z-[3]">
          {[
            { img: 'photo-1464366400600-7168b8af9bc3', name: 'Grand Ballroom', guests: '500', price: '₹80K/day', status: 'Available', delay: '0s' },
            { img: 'photo-1497366216548-37526070297c', name: 'Boardroom Alpha', guests: '30', price: '₹15K/day', status: 'Available', delay: '1.5s' },
          ].map((card, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden w-52 gold-glow animate-float group cursor-pointer"
              style={{ animationDelay: card.delay }}>
              <div className="overflow-hidden h-28">
                <img src={`https://images.unsplash.com/${card.img}?w=400&q=80`} alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[11px] font-sans">{card.status}</span>
                </div>
                <div className="text-cream text-base font-sans font-semibold">{card.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-cream/70 text-[11px]"><Users size={9} className="inline mr-0.5" />{card.guests}</span>
                  <span className="text-gold-400 text-sm font-display">{card.price}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Live booking badge */}
          <div className="glass rounded-xl p-3.5 w-52 border border-gold-500/20 animate-float" style={{ animationDelay: '3s' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <Zap size={15} className="text-gold-400" />
              </div>
              <div>
                <div className="text-cream font-sans font-bold text-base leading-none">Real-Time</div>
                <div className="text-cream/65 text-[11px] font-sans mt-0.5">Availability Checked Live</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-[3] animate-bounce-slow">
        <span className="text-cream/50 text-[9px] tracking-[0.45em] uppercase font-sans">Explore</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold-400/60 to-transparent" />
        <ChevronDown size={13} className="text-gold-400/40" />
      </div>

      {/* Image counter */}
      <div className="absolute bottom-7 right-8 flex items-center gap-2 z-[3]">
        <span className="text-gold-400 font-display text-xl">{String(heroIdx + 1).padStart(2, '0')}</span>
        <div className="h-px w-8 bg-gold-400/25" />
        <span className="text-cream/50 font-display text-base">{String(heroImages.length).padStart(2, '0')}</span>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 2: STATS                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */
function StatsBar() {
  const stats = [
    { value: 50, suffix: '+', label: 'Unique Venues', sub: 'Premium spaces' },
    { value: 2000, suffix: '+', label: 'Events Hosted', sub: 'And counting' },
    { value: 98, suffix: '%', label: 'Client Satisfaction', sub: 'Consistently rated' },
    { value: 24, suffix: '/7', label: 'Concierge Support', sub: 'Always available' },
  ]
  return (
    <section className="py-20 relative overflow-hidden border-y border-gold-500/8">
      <div className="orb w-[500px] h-[500px] bg-gold-500/04 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, #c9a84c 1px, transparent 1px)', backgroundSize: '44px 44px' }} />

      <div className="section-container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-gold-500/10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center py-4 px-8" data-reveal data-delay={String(i + 1)}>
              <CountUp value={s.value} suffix={s.suffix} />
              <p className="text-cream/85 text-base font-sans tracking-wider text-center mt-2 font-medium">{s.label}</p>
              <p className="text-gold-500/80 text-[11px] font-sans tracking-[0.2em] uppercase text-center mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* TRUSTED BY MARQUEE                                                      */
/* ═══════════════════════════════════════════════════════════════════════ */
function TrustedBySection() {
  const brands = [
    'India Exposition Mart', 'EPCH India', 'CII', 'FICCI', 'Confederation of Indian Industry',
    'Ministry of Textiles', 'NITI Aayog', 'MSME India', 'Make in India', 'Invest India',
  ]
  // Duplicate for seamless loop
  const allBrands = [...brands, ...brands]

  return (
    <section className="py-12 relative border-b border-gold-500/8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#070d1a] via-transparent to-[#070d1a] z-10 pointer-events-none" />

      <div className="mb-6 text-center">
        <span className="text-gold-500/85 text-[16px] tracking-[0.40em] uppercase font-sans">
          Trusted by India's premier institutions
        </span>
      </div>

      <div className="overflow-hidden">
        <div className="marquee-track gap-0">
          {allBrands.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-8 shrink-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500/80 shrink-0" />
              <span className="text-cream/85 text-base font-sans font-medium tracking-wide whitespace-nowrap hover:text-cream/85 transition-colors cursor-default">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 3: HOW TO BOOK — Gold Curtain Image Reveals                     */
/* ═══════════════════════════════════════════════════════════════════════ */
const steps = [
  {
    num: '01', title: 'Search & Discover', subtitle: 'Find your perfect venue',
    desc: "Use our intelligent search to filter venues by date, capacity, event type, and location. Real-time availability shows exactly what's open for your chosen dates.",
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=88',
    features: ['Filter by date, type & capacity', 'Instant availability check', 'Compare venues side-by-side'],
    reveal: 'img-slide',
  },
  {
    num: '02', title: 'Select Your Hall', subtitle: 'Choose from premium spaces',
    desc: 'Browse gallery photos, check floor plans, review amenities, and select the hall that matches your event perfectly. Each hall is linked to its venue for accuracy.',
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=88',
    features: ['HD gallery for every hall', 'Capacity & area details', 'Amenities checklist'],
    reveal: 'img-slide-left',
  },
  {
    num: '03', title: 'Fill Event Details', subtitle: 'Quick & intuitive form',
    desc: 'Enter your organizer details, setup and dismantle dates, event type, industry, and special requirements. Our smart form validates everything in real-time.',
    img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=88',
    features: ['Setup, event & dismantle dates', 'Industry & sector selection', 'Special requirements field'],
    reveal: 'img-slide',
  },
  {
    num: '04', title: 'Confirm & Host', subtitle: 'Zero conflicts guaranteed',
    desc: 'Submit your booking request. Our system instantly checks for conflicts and sends you a confirmation. Your slot is secured — zero double-bookings, ever.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=88',
    features: ['Auto conflict detection', 'Instant confirmation', 'Post-event archive'],
    reveal: 'img-slide-left',
  },
]

function HowToBookSection() {
  return (
    <section className="py-14 relative overflow-hidden">
      <div className="orb w-[600px] h-[600px] bg-teal-800/10 -left-48 top-48" />
      <div className="orb w-[400px] h-[400px] bg-gold-500/05 right-0 bottom-0" />

      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5" data-reveal>
            <div className="h-px w-12 bg-gold-400" />
            <span className="text-gold-400 text-[11px] tracking-[0.4em] uppercase font-sans">How It Works</span>
            <div className="h-px w-12 bg-gold-400" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream" data-reveal data-delay="1">
            Book in <em className="gold-shimmer not-italic">4 Simple Steps</em>
          </h2>
          <p className="text-cream/70 text-lg mt-4 max-w-xl mx-auto font-sans font-light" data-reveal data-delay="2">
            From discovery to confirmed booking in minutes — no friction, no complexity.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(6)' }}>
          {steps.map((step, i) => {
            const isEven = i % 2 === 0
            return (
              <div key={i} className="sticky top-[10vh]" style={{ '--card-idx': i }}>
                <div className="stacking-card-content relative grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] shadow-[0_-15px_50px_rgba(0,0,0,0.6)] bg-[#070d1a] w-full lg:h-[580px]">
                  {/* IMAGE — alternates left/right */}
                  <div
                    className={`${isEven ? 'lg:order-1' : 'lg:order-2'} h-80 md:h-96 lg:h-full`}
                    data-reveal={step.reveal}
                  >
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                  </div>

                  {/* TEXT */}
                  <div
                    className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex items-center bg-gradient-to-br from-navy-800/80 to-[#070d1a]/95 glass border border-white/4 lg:h-full`}
                    data-reveal={isEven ? 'right' : 'left'}
                  >
                    <div className="p-10 md:p-14 relative">
                      {/* Giant step number behind */}
                      <span className="step-number" style={{ left: isEven ? '1.5rem' : 'auto', right: isEven ? 'auto' : '1.5rem' }}>
                        {step.num}
                      </span>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-gold-400/80 font-display text-base tracking-[0.25em]">STEP {step.num}</span>
                        <div className="h-px flex-1 bg-gold-400/15" />
                      </div>

                      <p className="text-gold-400/60 text-sm font-sans tracking-widest uppercase mb-3">{step.subtitle}</p>
                      <h3 className="font-display text-3xl md:text-4xl text-cream mb-5">{step.title}</h3>
                      <p className="text-cream/80 text-base md:text-lg leading-relaxed mb-8 font-sans font-light">{step.desc}</p>

                      <div className="flex flex-col gap-3">
                        {step.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-gold-500/12 border border-gold-500/25 flex items-center justify-center shrink-0">
                              <CheckCircle size={10} className="text-gold-400" />
                            </div>
                            <span className="text-cream/85 text-base font-sans">{f}</span>
                          </div>
                        ))}
                      </div>

                      {i === steps.length - 1 && (
                        <Link to="/book" className="btn-gold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 text-sm mt-8">
                          Request a Booking <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 4: VENUE SHOWCASE — 3D Tilt Cards                               */
/* ═══════════════════════════════════════════════════════════════════════ */
function TiltVenueCard({ venue, delay = 1, large = false }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) translateZ(20px) scale(1.02)`
    el.style.boxShadow = `${-x * 24}px ${y * 14}px 50px rgba(0,0,0,0.45), 0 0 40px rgba(201,168,76,0.18)`
  }
  const onLeave = () => {
    ref.current.style.transform = ''
    ref.current.style.boxShadow = ''
  }

  return (
    <Link to={`/venues/${venue.slug}`}>
      <div
        ref={ref}
        onMouseMove={onMove} onMouseLeave={onLeave}
        className="relative rounded-3xl overflow-hidden cursor-pointer group"
        style={{ transition: 'transform 0.15s ease, box-shadow 0.3s ease', transformStyle: 'preserve-3d' }}
        data-reveal data-delay={String(delay)}
      >
        <div className="overflow-hidden h-full"
        // style={{ height: large ? '440px' : '300px' }}
        >
          <img
            src={venue.image} alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms]"
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a]/97 via-[#070d1a]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d1a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 glass rounded-full px-2.5 py-1.5 border border-white/6">
          <Star size={10} className="text-gold-400 fill-gold-400" />
          <span className="text-gold-400 text-[11px] font-sans font-semibold">{venue.rating}</span>
        </div>

        {/* Tag badges */}
        {large && (
          <div className="absolute top-4 left-4 flex gap-2">
            {venue.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="glass text-gold-400/80 text-[11px] px-2.5 py-1 rounded-full border border-gold-500/20 font-sans">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h3 className={`font-display text-cream ${large ? 'text-2xl' : 'text-xl'}`}>{venue.name}</h3>
              <div className="flex items-center gap-3 text-cream/70 text-sm font-sans mt-1.5">
                <span><Users size={10} className="inline mr-1" />{venue.capacity} guests</span>
                <span><MapPin size={10} className="inline mr-1" />{venue.type}</span>
              </div>
            </div>
            <div className="text-right ml-4 shrink-0">
              <div className="text-gold-400 font-display text-xl">₹{venue.price / 1000}K</div>
              <div className="text-cream/60 text-[11px] font-sans">/day</div>
            </div>
          </div>

          {/* CTA that appears on hover */}
          <div className="overflow-hidden" style={{ maxHeight: '0', transition: 'max-height 0.4s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.maxHeight = '40px' }}
            onMouseLeave={(e) => { e.currentTarget.style.maxHeight = '0' }}>
            <div className="pt-3 flex items-center gap-2 text-gold-400 text-sm font-sans border-t border-gold-500/15">
              View Venue <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function VenueShowcase() {
  return (
    <section className=" relative overflow-hidden">
      <div className="orb w-[700px] h-[700px] bg-teal-800/10 -right-48 top-0" />

      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5" data-reveal>
              <div className="h-px w-12 bg-gold-400" />
              <span className="text-gold-400 text-[11px] tracking-[0.4em] uppercase font-sans">Featured Spaces</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-cream" data-reveal data-delay="1">
              Our Signature <em className="gold-shimmer not-italic">Venues</em>
            </h2>
          </div>
          <Link to="/venues" className="btn-outline px-7 py-3 rounded-xl flex items-center gap-2 text-sm mt-6 md:mt-0 self-start"
            data-reveal>
            All 6 Venues <ArrowRight size={13} />
          </Link>
        </div>

        {/* Large + side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TiltVenueCard venue={venues[0]} delay={1} large />
          </div>
          <div className="flex flex-col gap-6">
            <TiltVenueCard venue={venues[1]} delay={2} />
            <TiltVenueCard venue={venues[2]} delay={3} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {venues.slice(3).map((v, i) => <TiltVenueCard key={v.id} venue={v} delay={i + 1} />)}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 5: VENUE CATEGORY CARDS                                         */
/* ═══════════════════════════════════════════════════════════════════════ */
function VenueCategories() {
  const categories = [
    {
      label: 'Convention Halls', sub: 'Up to 2,000 guests', icon: '🏛️',
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=85',
      desc: 'Grand-scale events, product launches, trade shows',
    },
    {
      label: 'Grand Ballrooms', sub: 'Up to 500 guests', icon: '✨',
      img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=85',
      desc: 'Weddings, galas, award ceremonies',
    },
    {
      label: 'Executive Boardrooms', sub: 'Up to 80 guests', icon: '💼',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=85',
      desc: 'High-stakes meetings, workshops, training',
    },
    {
      label: 'Exhibition Halls', sub: 'Up to 1,200 guests', icon: '🏗️',
      img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=85',
      desc: 'Trade fairs, auto shows, craft exhibitions',
    },
    {
      label: 'Outdoor & Terraces', sub: 'Up to 200 guests', icon: '🌆',
      img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=85',
      desc: 'Cocktail evenings, outdoor receptions',
    },
  ]

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-gold-500/05 left-0 top-1/2 -translate-y-1/2" />

      <div className="section-container">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5" data-reveal>
            <div className="h-px w-12 bg-gold-400" />
            <span className="text-gold-400 text-[14px] tracking-[0.4em] uppercase font-sans">Venue Types</span>
            <div className="h-px w-12 bg-gold-400" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream" data-reveal data-delay="1">
            Find the <em className="gold-shimmer not-italic">Perfect Space</em>
          </h2>
          <p className="text-cream/80 text-lg mt-4 max-w-lg mx-auto font-sans font-light" data-reveal data-delay="2">
            Every occasion deserves the right venue. Browse by category to find yours.
          </p>
        </div>

        {/* 5 category cards in a single row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link to="/venues" key={i}>
              <div
                className="category-card rounded-3xl"
                style={{ height: '400px' }}
                data-reveal data-delay={String(i + 1)}
              >
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover absolute inset-0" />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                  <div className="category-card-tag mb-2">
                    <span className="glass text-gold-400/80 text-[11px] px-2.5 py-1 rounded-full border border-gold-500/20 font-sans">
                      {cat.sub}
                    </span>
                  </div>
                  <span className="text-lg mr-2">{cat.icon}</span>
                  <h3 className="font-display text-cream text-xl mt-1">{cat.label}</h3>
                  <div className="category-card-desc">
                    <p className="text-cream/80 text-sm font-sans leading-relaxed mt-2">{cat.desc}</p>
                    <div className="flex items-center gap-1 text-gold-400 text-sm font-sans mt-2">
                      View venues <ArrowRight size={10} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 6: FULL-WIDTH IMMERSIVE SPOTLIGHT                               */
/* ═══════════════════════════════════════════════════════════════════════ */
function ImmersiveSpotlight() {
  const bgRef = useParallax(0.12)

  return (
    <section className="relative py-0 overflow-hidden" style={{ height: '600px' }}>
      {/* Parallax background */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef}>
          <img
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1920&q=90"
            alt="Grand Convention Centre"
            className="w-full object-cover"
            style={{ height: '130%', marginTop: '-15%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d1a]/98 via-[#070d1a]/80 to-[#070d1a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a]/70 to-transparent" />
      </div>

      {/* Decorative orb */}
      <div className="orb w-64 h-64 bg-gold-500/20 right-48 top-1/2 -translate-y-1/2" />

      <div className="relative h-full section-container flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5" data-reveal>
            <div className="h-px w-12 bg-gold-400" />
            <span className="text-gold-400 text-[14px] tracking-[0.4em] uppercase font-sans">Spotlight Venue</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream mb-4" data-reveal data-delay="1">
            The Grand<br /><em className="gold-shimmer not-italic">Convention Centre</em>
          </h2>
          <p className="text-cream/85 text-xl leading-relaxed mb-8 font-sans font-light" data-reveal data-delay="2">
            India's most prestigious convention venue — 5,000 sqft, 2,000 guests, world-class AV infrastructure, and full catering for the grandest events.
          </p>

          <div className="flex flex-wrap gap-6 mb-10" data-reveal data-delay="3">
            {[
              { icon: Users, val: '2,000', label: 'Max Guests' },
              { icon: Building2, val: '5,000', label: 'Square Feet' },
              { icon: Star, val: '4.9', label: 'Rating' },
            ].map(({ icon: Icon, val, label }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                  <Icon size={16} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-cream font-display text-xl leading-none">{val}</div>
                  <div className="text-cream/70 text-sm font-sans">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/venues/grand-convention" className="btn-gold px-10 py-4 rounded-xl inline-flex items-center gap-2"
            data-reveal data-delay="4">
            Explore This Venue <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 7: WHY BOOK WITH US                                             */
/* ═══════════════════════════════════════════════════════════════════════ */
function WhyChooseUs() {
  const features = [
    {
      icon: Zap, title: 'Instant Availability',
      desc: 'Real-time calendar checks availability the moment you pick a date — no waiting, no back-and-forth emails.',
      img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80',
    },
    {
      icon: Shield, title: 'Zero Double Bookings',
      desc: 'Confirmed bookings are locked. Our conflict engine ensures your slot can never be double-booked, ever.',
      img: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=500&q=80',
    },
    {
      icon: Clock, title: 'Flexible Scheduling',
      desc: 'Manage setup, event, and dismantle dates independently. Full date flexibility built around your event needs.',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
    },
    {
      icon: CheckCircle, title: '24/7 Concierge',
      desc: 'Our dedicated team is on call round the clock — from first inquiry to post-event completion and archival.',
      img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80',
    },
  ]

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-900/6 to-transparent pointer-events-none" />
      <div className="orb w-[600px] h-[600px] bg-teal-800/12 -right-40 bottom-0" />

      <div className="section-container">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5" data-reveal>
            <div className="h-px w-12 bg-gold-400" />
            <span className="text-gold-400 text-[14px] tracking-[0.4em] uppercase font-sans">Why ExpoInn</span>
            <div className="h-px w-12 bg-gold-400" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream" data-reveal data-delay="1">
            The Smarter Way to <em className="gold-shimmer not-italic">Book</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, img }, i) => (
            <div
              key={i}
              className="relative glass rounded-3xl overflow-hidden border border-white/5 hover:border-gold-500/25 transition-all duration-500 gold-glow-hover group cursor-default"
              data-reveal data-delay={String((i % 2) + 1)}
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover opacity-10 group-hover:opacity-18 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800/80 to-[#070d1a]/95" />
              </div>

              <div className="relative p-8 md:p-10">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6 icon-pulse group-hover:bg-gold-500/20 transition-colors">
                  <Icon size={24} className="text-gold-400" />
                </div>
                <h3 className="font-display text-2xl text-cream mb-3">{title}</h3>
                <p className="text-cream/80 text-base leading-relaxed font-sans font-light">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 8: AVAILABILITY CALENDAR TEASER                                 */
/* ═══════════════════════════════════════════════════════════════════════ */
function AvailabilityTeaser() {
  const [selected, setSelected] = useState(null)

  const events = {
    3: { status: 'confirmed', title: 'Global Tech Summit', hall: 'Grand Convention Centre' },
    4: { status: 'confirmed', title: 'Global Tech Summit', hall: 'Grand Convention Centre' },
    8: { status: 'tentative', title: 'Sharma Wedding', hall: 'Grand Ballroom' },
    12: { status: 'tentative', title: 'Corporate Workshop', hall: 'Boardroom Alpha' },
    13: { status: 'tentative', title: 'Corporate Workshop', hall: 'Boardroom Alpha' },
    16: { status: 'draft', title: 'Internal Meeting', hall: 'Pavilion Hall' },
    19: { status: 'confirmed', title: 'Auto Expo 2026', hall: 'Pavilion Hall' },
    20: { status: 'confirmed', title: 'Auto Expo 2026', hall: 'Pavilion Hall' },
    21: { status: 'confirmed', title: 'Auto Expo 2026', hall: 'Pavilion Hall' },
    25: { status: 'tentative', title: 'Startup Pitch Day', hall: 'Sky Lounge' },
    28: { status: 'confirmed', title: 'Fashion Week', hall: 'Grand Convention Centre' },
    29: { status: 'confirmed', title: 'Fashion Week', hall: 'Grand Convention Centre' },
  }
  const statusDot = { confirmed: 'bg-emerald-400', tentative: 'bg-amber-400', draft: 'bg-slate-400' }

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div data-reveal="left">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gold-400" />
              <span className="text-gold-400 text-[14px] tracking-[0.4em] uppercase font-sans">Live Availability</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-cream mb-6">
              Check Dates<br /><em className="gold-shimmer not-italic">Instantly</em>
            </h2>
            <p className="text-cream/80 text-xl leading-relaxed mb-8 font-sans font-light">
              Our real-time calendar shows exactly which dates are open. No phone calls, no waiting. Pick a date and book immediately.
            </p>
            {['Green = Fully confirmed bookings', 'Amber = Tentative (date holds available)', 'Click any day to see event details'].map((f, i) => (
              <div key={i} className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: i === 0 ? '#34d399' : i === 1 ? '#fbbf24' : '#94a3b8' }} />
                <span className="text-cream/80 text-base font-sans">{f}</span>
              </div>
            ))}
            <Link to="/book" className="btn-gold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 text-sm mt-6">
              Check Availability Now <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: mini calendar UI */}
          <div className="glass rounded-3xl p-7 border border-gold-500/15 gold-glow" data-reveal="right">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl text-cream">April 2026</h3>
                <p className="text-gold-400/50 text-[11px] font-sans tracking-wide mt-0.5">Live Preview</p>
              </div>
              <div className="flex gap-2">
                {[ChevronLeft, ChevronRight].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-cream/65 hover:text-cream transition-colors border border-white/5">
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} className="text-center text-cream/50 text-[11px] font-sans py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} />)}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const ev = events[day]
                const status = ev ? ev.status : null
                const isSel = selected === day
                return (
                  <button key={day}
                    onClick={() => setSelected(isSel ? null : day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[11px] font-sans transition-all duration-200
                      ${isSel ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400' : 'hover:bg-white/5 ' + (status ? 'text-cream' : 'text-cream/60')}`}
                  >
                    <span className={isSel ? 'font-semibold' : ''}>{day}</span>
                    {status && <div className={`w-1 h-1 rounded-full mt-0.5 ${statusDot[status]}`} />}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-5 mt-5 pt-5 border-t border-white/5">
              {[['Confirmed', 'emerald'], ['Tentative', 'amber'], ['Open', 'slate']].map(([label, clr]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full bg-${clr}-400`} />
                  <span className="text-cream/60 text-[11px] font-sans">{label}</span>
                </div>
              ))}
            </div>

            {selected && events[selected] && (
              <div className="mt-4 pt-4 border-t border-gold-500/15 animate-slide-up">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusDot[events[selected].status]} shrink-0`} />
                    <span className="text-cream text-sm font-sans font-medium">April {selected}, 2026</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-sans
                    ${events[selected].status === 'confirmed' ? 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/20' :
                      events[selected].status === 'tentative' ? 'bg-amber-400/15 text-amber-400 border border-amber-400/20' :
                        'bg-slate-400/15 text-slate-400 border border-slate-400/20'}`}>
                    {events[selected].status}
                  </span>
                </div>

                <div className="glass rounded-xl p-4 border border-white/5 bg-white/[0.02]">
                  <h4 className="text-gold-400 font-display text-xl leading-tight mb-2">{events[selected].title}</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cream/70 text-[11px] font-sans tracking-wide">
                      <MapPin size={12} className="text-gold-400/50" /> {events[selected].hall}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 9: TESTIMONIALS                                                 */
/* ═══════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const bgRef = useParallax(0.1)

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative py-28 overflow-hidden" style={{ minHeight: '700px' }}>
      {/* Parallax BG */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef}>
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=70"
            alt=""
            className="w-full object-cover" style={{ height: '130%', marginTop: '-15%', opacity: 0.09 }}
          />
        </div>
        <div className="absolute inset-0 bg-[#070d1a]/92" />
      </div>

      <div className="relative section-container">
        <div className="text-center mb-14" data-reveal>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-gold-400" />
            <span className="text-gold-400 text-[14px] tracking-[0.4em] uppercase font-sans">Client Stories</span>
            <div className="h-px w-12 bg-gold-400" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream">
            What Our Clients <em className="gold-shimmer not-italic">Say</em>
          </h2>
        </div>

        <div className="relative section-container" style={{ minHeight: '340px' }}>
          {testimonials.map((t, i) => (
            <div key={i} className={`transition-all duration-800 ${i === active ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-6 absolute inset-0 pointer-events-none'}`}
              style={{ transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
              <div className="glass rounded-3xl px-10 py-14 md:px-16 md:py-16 text-center gold-glow border border-gold-500/15">
                {/* Quote mark */}
                <div className="font-display text-8xl text-gold-400/15 leading-none mb-2 -mt-4">"</div>

                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={17} className="text-gold-400 fill-gold-400" />)}
                </div>

                <blockquote className="font-display text-2xl md:text-3xl text-cream/90 italic leading-relaxed mb-10">
                  {t.text}
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/30" />
                  <div className="text-left">
                    <div className="text-cream font-sans font-semibold text-base">{t.name}</div>
                    <div className="text-gold-400/55 text-base font-sans">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all duration-400"
                style={{ height: 5, width: i === active ? 32 : 8, background: i === active ? '#c9a84c' : 'rgba(255,255,255,0.15)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SECTION 10: CTA BANNER                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */
function CTABanner() {
  const bgRef = useParallax(0.14)

  return (
    <section className="relative overflow-hidden mx-4 md:mx-6 mb-8 rounded-3xl" data-reveal="zoom">
      <div className="overflow-hidden" style={{ height: '560px' }}>
        <div ref={bgRef}>
          <img
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-full object-cover" style={{ height: '130%', marginTop: '-15%' }}
          />
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070d1a]/99 via-[#070d1a]/85 to-[#070d1a]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a]/70 to-transparent" />
      <div className="orb w-72 h-72 bg-gold-500/25 right-40 top-1/2 -translate-y-1/2" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-12 bg-gold-400" />
              <span className="text-gold-400 text-[14px] tracking-[0.4em] uppercase font-sans">Get Started Today</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-cream mb-5 leading-tight">
              Ready to Host Your<br />
              <em className="gold-shimmer not-italic">Next Grand Event?</em>
            </h2>
            <p className="text-cream/80 text-lg font-sans font-light leading-relaxed">
              From intimate boardrooms to grand exhibition halls — real-time availability, instant confirmation, zero conflicts.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 min-w-[220px]">
            <Link to="/book" className="btn-gold px-10 py-4 rounded-xl flex items-center justify-center gap-2">
              Request a Booking <ChevronRight size={16} />
            </Link>
            <Link to="/venues" className="btn-outline px-10 py-4 rounded-xl text-center">
              Browse Venues
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* HOME PAGE                                                               */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  useScrollReveal()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ScrollProgressBar />
      <HeroSection />
      <StatsBar />
      <TrustedBySection />
      <HowToBookSection />
      <VenueShowcase />
      <VenueCategories />
      <ImmersiveSpotlight />
      <WhyChooseUs />
      <AvailabilityTeaser />
      <TestimonialsSection />
      <CTABanner />
    </div>
  )
}
