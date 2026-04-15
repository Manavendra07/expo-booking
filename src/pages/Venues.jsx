import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ArrowRight, Filter } from 'lucide-react'
import VenueCard from '../components/VenueCard'
import { venues } from '../data/staticData'
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

const venueTypes = ['All', 'Convention Hall', 'Ballroom', 'Meeting Room', 'Exhibition Hall', 'Outdoor Venue']

export default function Venues() {
  useScrollReveal()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [capacity, setCapacity] = useState('')
  const [sortBy, setSortBy] = useState('Recommended')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = venues.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = selectedType === 'All' || v.type === selectedType
    const matchCap = !capacity || v.capacity >= parseInt(capacity)
    return matchSearch && matchType && matchCap
  }).sort((a, b) => {
    if (sortBy === 'Capacity: High to Low') return b.capacity - a.capacity
    if (sortBy === 'Price: Low to High') return a.price - b.price
    if (sortBy === 'Rating: Premium First') return b.rating - a.rating
    return 0
  })

  return (
    <div className="min-h-screen bg-navy-900 pb-20">
      <ScrollProgressBar />

      {/* Immersive Header */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80"
            alt="Venues Hero"
            className="w-full h-full object-cover opacity-40 scale-105"
            style={{ filter: 'brightness(0.6)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/20 to-navy-950" />
        </div>

        <div className="section-container relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6" data-reveal="fade">
            <div className="h-px w-12 bg-gold-500/50" />
            <span className="text-gold-400 text-[14px] tracking-[0.4em] uppercase font-sans font-medium">World Class Venues</span>
            <div className="h-px w-12 bg-gold-500/50" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-cream mb-8 leading-tight" data-reveal="up">
            Find Your <em className="animated-gradient-text not-italic font-medium">Statement</em> Venue
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4" data-reveal="up" data-delay="2">
            <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
              <input
                type="text"
                placeholder="Search by name, type, or tag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/20 rounded-full text-cream placeholder:text-cream/60 backdrop-blur-md focus:border-gold-400/50 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Decorative Orbs */}
        <div className="orb w-96 h-96 bg-gold-500/05 -top-20 -left-20" />
        <div className="orb w-96 h-96 bg-teal-800/05 -bottom-20 -right-20" />
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 -mt-10">
        <div className="section-container">
          <div className="glass rounded-2xl p-4 md:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border border-gold-500/10 shadow-2xl">

            {/* Category Pills */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
              {venueTypes.map((type, i) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-sans tracking-widest uppercase transition-all whitespace-nowrap border ${selectedType === type
                      ? 'bg-gold-gradient text-navy-950 border-gold-400 font-bold shadow-lg shadow-gold-500/20'
                      : 'bg-white/05 text-cream/70 border-white/05 hover:border-gold-500/30 hover:text-cream'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-sans tracking-widest uppercase border transition-all ${showFilters ? 'bg-gold-500/10 border-gold-400 text-gold-400' : 'bg-white/05 border-white/10 text-cream/90'
                  }`}
              >
                <Filter size={14} /> Advanced Filters
              </button>

              <div className="h-8 w-px bg-gold-500/10 hidden md:block" />

              <p className="text-cream/70 text-sm font-sans tracking-widest uppercase hidden md:block">
                <span className="text-gold-400 font-bold">{filtered.length}</span> Results
              </p>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 glass rounded-2xl p-6 border border-gold-500/10 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-gold-500/80 text-[12px] tracking-[0.3em] uppercase mb-3 block">Minimum Capacity</label>
                  <input
                    type="number"
                    placeholder="e.g. 500 Guests"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    className="w-full bg-navy-950/50 border border-gold-500/10 rounded-xl px-4 py-3 text-base text-cream outline-none focus:border-gold-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-gold-500/80 text-[12px] tracking-[0.3em] uppercase mb-3 block">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-navy-950/50 border border-gold-500/10 rounded-xl px-4 py-3 text-base text-cream outline-none focus:border-gold-400/30 transition-all appearance-none cursor-pointer"
                  >
                    <option>Recommended</option>
                    <option>Capacity: High to Low</option>
                    <option>Price: Low to High</option>
                    <option>Rating: Premium First</option>
                  </select>
                </div>
                <div className="flex items-end gap-4">
                  {(search || selectedType !== 'All' || capacity) && (
                    <button
                      onClick={() => { setSearch(''); setSelectedType('All'); setCapacity('') }}
                      className="flex items-center gap-2 text-red-400/70 hover:text-red-400 text-sm transition-colors mb-4"
                    >
                      <X size={14} /> Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="section-container py-20">
        {filtered.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-gold-500/10" data-reveal="fade">
            <div className="w-24 h-24 bg-gold-500/10 border border-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Building2 size={32} className="text-gold-400/40" />
            </div>
            <h3 className="font-display text-4xl text-cream mb-4">No venues match your vision</h3>
            <p className="text-cream/70 text-lg max-w-md mx-auto">Try refining your search or explore our most popular categories.</p>
            <button
              onClick={() => { setSearch(''); setSelectedType('All'); setCapacity('') }}
              className="btn-gold px-8 py-3 rounded-full text-sm mt-10"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filtered.map((v, i) => (
              <div key={v.id} data-reveal="up" data-delay={String((i % 3) + 1)}>
                <VenueCard venue={v} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="section-container relative py-10" data-reveal="fade">
        <div className="section-line mb-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="font-display text-2xl text-cream mb-2">Can't find what you're looking for?</h4>
            <p className="text-cream/70">Our concierge team can help you source the perfect space for your event.</p>
          </div>
          <a href="mailto:concierge@expoinn.com" className="btn-outline px-10 py-4 rounded-full text-sm shrink-0">
            Speak to a Consultant
          </a>
        </div>
      </div>
    </div>
  )
}

