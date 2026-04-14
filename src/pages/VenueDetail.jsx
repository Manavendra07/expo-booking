import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Users, Maximize, Star, MapPin, CheckCircle, ArrowRight,
  ChevronLeft, ChevronRight, Calendar, Shield, Share2, Heart, Info, Clock,
  ArrowUpRight, AlertTriangle, Sparkles, AlertCircle
} from 'lucide-react'
import { venues } from '../data/staticData'
import { getBookedDaysForVenue, getConflicts } from '../utils/bookingStore'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ─── Scroll Progress Bar ─────────────────────────────────────────────── */
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
      <div className="h-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite', transition: 'width 0.1s ease', boxShadow: '0 0 8px rgba(201,168,76,0.6)' }} />
    </div>
  )
}

/* ─── Real Availability Calendar Widget ───────────────────────────────── */
function VenueAvailabilityWidget({ venue, onDateSelect, selectedDate }) {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selDay, setSelDay] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  // Re-compute whenever month/year or refreshKey changes
  const bookedMap = useMemo(() => {
    return getBookedDaysForVenue(venue.id, year, month)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venue.id, year, month, refreshKey])

  // Refresh when the widget mounts (picks up bookings from this session)
  useEffect(() => { setRefreshKey(k => k + 1) }, [])

  const firstDay     = new Date(year, month, 1).getDay()
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const dotColor     = { confirmed: '#34d399', tentative: '#fbbf24' }

  const changeMonth  = (dir) => {
    let m = month + dir, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m); setYear(y); setSelDay(null)
  }

  const handleDayClick = (day) => {
    setSelDay(day === selDay ? null : day)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onDateSelect(dateStr)
  }

  const statusForDay = (day) => bookedMap[day] // 'confirmed' | 'tentative' | undefined

  return (
    <div>
      {/* Month Navigator */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => changeMonth(-1)}
          className="w-7 h-7 glass rounded-lg flex items-center justify-center text-cream/60 hover:text-gold-400 transition-colors border border-white/05">
          <ChevronLeft size={12} />
        </button>
        <span className="text-cream/80 text-[12px] font-sans font-semibold tracking-widest uppercase">
          {monthNames[month].slice(0, 3)} {year}
        </span>
        <button onClick={() => changeMonth(1)}
          className="w-7 h-7 glass rounded-lg flex items-center justify-center text-cream/60 hover:text-gold-400 transition-colors border border-white/05">
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-3 justify-end">
        {[['#34d399', 'Booked'], ['#fbbf24', 'Tentative'], ['rgba(255,255,255,0.25)', 'Open']].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            <span className="text-cream/55 text-[9px]">{l}</span>
          </div>
        ))}
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-cream/40 text-[9px] py-1">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const status  = statusForDay(day)
          const isSel   = selDay === day
          const isPast  = new Date(year, month, day) < new Date(new Date().setHours(0, 0, 0, 0))
          const booking = bookedMap[`_b_${day}`]

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => handleDayClick(day)}
              title={status ? `${status === 'confirmed' ? 'Confirmed — Not Available' : 'Tentative — May Open'}${booking ? `: ${booking.hall}` : ''}` : 'Available'}
              className={`aspect-square flex flex-col items-center justify-center rounded-md text-[11px] transition-all duration-150
                ${isPast       ? 'opacity-20 cursor-not-allowed'
                : isSel        ? 'bg-gold-500/25 border border-gold-500/50 text-gold-400 scale-110 shadow-sm shadow-gold-500/20'
                : status === 'confirmed' ? 'bg-red-500/10 border border-red-500/20 text-cream/70 cursor-not-allowed'
                : status === 'tentative' ? 'bg-amber-500/08 border border-amber-500/15 text-cream/80 hover:bg-amber-500/15'
                : 'hover:bg-white/05 text-cream/60 hover:text-cream/90'}`}
            >
              <span className={`${isSel ? 'font-bold' : ''}`}>{day}</span>
              {status && (
                <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: dotColor[status] }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day info */}
      {selDay && (
        <div className={`mt-3 p-2.5 rounded-xl border flex items-start gap-2 ${
          statusForDay(selDay) === 'confirmed' ? 'glass-light border-red-500/20 bg-red-500/05'
          : statusForDay(selDay) === 'tentative' ? 'glass-light border-amber-500/20 bg-amber-500/05'
          : 'glass-light border-emerald-500/20 bg-emerald-500/05'
        }`}>
          <div className="w-2 h-2 rounded-full mt-0.5 shrink-0" style={{
            background: statusForDay(selDay) === 'confirmed' ? '#f87171'
              : statusForDay(selDay) === 'tentative' ? '#fbbf24' : '#34d399'
          }} />
          <div>
            <span className="text-cream/90 text-[11px] font-sans leading-tight block">
              {monthNames[month].slice(0, 3)} {selDay} —{' '}
              {statusForDay(selDay) === 'confirmed'
                ? <span className="text-red-400 font-semibold">Confirmed — Not Available</span>
                : statusForDay(selDay) === 'tentative'
                ? <span className="text-amber-400 font-semibold">Tentative — May Open Up</span>
                : <span className="text-emerald-400 font-semibold">Available for Booking!</span>
              }
            </span>
            {bookedMap[`_b_${selDay}`] && (
              <span className="text-cream/50 text-[9px] mt-0.5 block">
                {bookedMap[`_b_${selDay}`].hall} · {bookedMap[`_b_${selDay}`].eventType || 'Event'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Check Availability Panel ────────────────────────────────────────── */
function CheckAvailabilityPanel({ venue }) {
  const navigate = useNavigate()
  const [date, setDate]     = useState('')
  const [guests, setGuests] = useState('')
  const [checked, setChecked] = useState(false)
  const [conflicts, setConflicts] = useState([])
  const [selectedDate, setSelectedDate] = useState('')

  const today = new Date().toISOString().split('T')[0]

  // Sync when calendar selects a day
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate)
      setChecked(false)
    }
  }, [selectedDate])

  const handleCheck = () => {
    if (!date) return
    const found = getConflicts(venue.id, null, date, date)
    setConflicts(found)
    setChecked(true)
  }

  const handleBook = () => {
    const params = new URLSearchParams({ venue: venue.id })
    if (date)   params.set('date', date)
    if (guests) params.set('guests', guests)
    navigate(`/book?${params.toString()}`)
  }

  const isAvailable = checked && conflicts.length === 0
  const hasConflict = checked && conflicts.length > 0

  return (
    <div>
      {/* Live Availability Calendar */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={13} className="text-gold-400/60" />
          <span className="text-gold-400/60 text-[11px] tracking-[0.3em] uppercase font-sans">Live Availability</span>
        </div>
        <VenueAvailabilityWidget
          venue={venue}
          onDateSelect={(d) => { setSelectedDate(d); setDate(d); setChecked(false) }}
          selectedDate={date}
        />
      </div>

      <div className="section-line mb-6 opacity-10" />

      {/* Date + Guests Inputs */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-gold-500/70 text-[11px] tracking-[0.3em] uppercase mb-2 block px-1">Event Date</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" />
            <input
              type="date"
              min={today}
              value={date}
              onChange={e => { setDate(e.target.value); setChecked(false) }}
              className="w-full pl-11 pr-4 py-3.5 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-gold-500/70 text-[11px] tracking-[0.3em] uppercase mb-2 block px-1">Expected Guests</label>
          <div className="relative">
            <Users size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" />
            <input
              type="number"
              placeholder={`Up to ${venue.capacity}`}
              value={guests}
              min={1}
              max={venue.capacity}
              onChange={e => setGuests(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all"
            />
          </div>
          {guests && parseInt(guests) > venue.capacity && (
            <p className="text-red-400 text-[11px] mt-1 ml-1">Exceeds venue capacity of {venue.capacity.toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Check Availability Button */}
      <button
        onClick={handleCheck}
        disabled={!date}
        className={`w-full py-3.5 rounded-2xl text-sm font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all duration-300 mb-4 ${
          date ? 'btn-outline hover:scale-[1.02]' : 'opacity-30 cursor-not-allowed border border-white/10 text-cream/40'
        }`}
      >
        <Calendar size={15} /> Check Availability
      </button>

      {/* Result: Available */}
      {isAvailable && (
        <div className="mb-4 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/08 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-emerald-400" />
            <span className="text-emerald-400 font-bold text-sm">Available on {date}!</span>
          </div>
          <p className="text-cream/70 text-[12px] mb-3">This venue is open for your selected date. Confirm your booking now.</p>
          <button
            onClick={handleBook}
            className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
          >
            Book This Date <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Result: Conflict */}
      {hasConflict && (
        <div className="mb-4 p-4 rounded-2xl border border-red-500/30 bg-red-500/06 animate-slide-up">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-red-400 font-bold text-sm block">Unavailable on {date}</span>
              <span className="text-cream/60 text-[11px]">
                {conflicts.length} active booking{conflicts.length > 1 ? 's' : ''} conflict with this date
              </span>
            </div>
          </div>
          {conflicts.slice(0, 2).map(c => (
            <div key={c.id} className="mt-2 flex items-center gap-2 text-[11px] text-cream/60">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
              <span>{c.hall} · {c.eventType || 'Event'} · <span className="font-mono text-red-300">{c.id}</span></span>
            </div>
          ))}
          <p className="text-cream/50 text-[11px] mt-3">Try selecting a different date or check tentative slots.</p>
        </div>
      )}

      {/* Primary CTA — always visible */}
      {!isAvailable && (
        <button
          onClick={handleBook}
          className="btn-gold w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-base font-bold shadow-xl shadow-gold-500/10 transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Initiate Booking <ArrowRight size={18} />
        </button>
      )}
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function VenueDetail() {
  useScrollReveal()
  const { slug } = useParams()
  const venue     = venues.find(v => v.slug === slug)
  const [activeImg, setActiveImg] = useState(0)
  const allImages = venue ? [venue.image, ...venue.gallery] : []

  if (!venue) return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-navy-950">
      <div className="text-center">
        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info size={32} className="text-gold-400/40" />
        </div>
        <h2 className="font-display text-4xl text-cream mb-4">Venue not found</h2>
        <Link to="/venues" className="btn-gold px-8 py-3 rounded-full text-sm">Back to Portfolio</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-950 pb-20">
      <ScrollProgressBar />

      {/* Cinematic Hero */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0" data-reveal="img-slide">
          <img src={allImages[activeImg]} alt={venue.name} className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 py-20">
          <div className="section-container">
            <Link to="/venues" className="inline-flex items-center gap-2 text-gold-400/60 hover:text-gold-400 transition-all text-sm tracking-widest uppercase mb-8" data-reveal="fade">
              <ChevronLeft size={16} /> Portfolio
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div data-reveal="up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold-400 text-[11px] tracking-[0.4em] uppercase font-sans font-medium px-3 py-1 glass rounded-full border border-gold-500/20">
                    {venue.type}
                  </span>
                  <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1 border border-white/05">
                    <Star size={12} className="text-gold-400 fill-gold-400" />
                    <span className="text-cream/90 text-[11px] font-bold">{venue.rating}</span>
                    <span className="text-cream/60 text-[11px]">({venue.reviews} Reviews)</span>
                  </div>
                </div>
                <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight mb-4">{venue.name}</h1>
                <div className="flex items-center gap-2 text-gold-500/60 text-base">
                  <MapPin size={16} />
                  <span className="tracking-wide">{venue.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3" data-reveal="fade" data-delay="2">
                <button className="w-12 h-12 rounded-full glass flex items-center justify-center text-cream/70 hover:text-gold-400 transition-all border border-white/05">
                  <Heart size={20} />
                </button>
                <button className="w-12 h-12 rounded-full glass flex items-center justify-center text-cream/70 hover:text-gold-400 transition-all border border-white/05">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-16">

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar" data-reveal="fade">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      i === activeImg ? 'border-gold-400 scale-105 shadow-xl shadow-gold-500/10' : 'border-transparent grayscale hover:grayscale-0 opacity-40 hover:opacity-100'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Overview */}
            <div data-reveal="up">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-gold-400" />
                <h2 className="text-gold-400 text-sm tracking-[0.4em] uppercase font-sans font-medium">The Experience</h2>
              </div>
              <p className="text-cream/90 text-xl leading-relaxed italic font-display">
                "{venue.description}"
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal="up">
              {[
                { label: 'Event Capacity', value: venue.capacity.toLocaleString(), sub: 'Guests MAX', icon: Users },
                { label: 'Expanse', value: venue.area, sub: 'Total Area', icon: Maximize },
                { label: 'Elite Sector', value: venue.sector.split(' ')[0], sub: venue.sector, icon: Shield },
              ].map((item, idx) => (
                <div key={idx} className="glass group rounded-3xl p-8 border border-white/05 hover:border-gold-500/20 transition-all duration-500 text-center">
                  <div className="w-14 h-14 bg-gold-500/05 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-gold-500/10 transition-all">
                    <item.icon size={24} className="text-gold-400" />
                  </div>
                  <div className="font-display text-4xl text-cream mb-1">{item.value}</div>
                  <div className="text-cream/50 text-[11px] tracking-[0.2em] uppercase mb-4">{item.label}</div>
                  <div className="section-line mb-4 opacity-20" />
                  <div className="text-gold-500/40 text-[9px] tracking-widest uppercase">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Available Halls */}
            <div data-reveal="up">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-gold-400" />
                <h2 className="text-gold-400 text-sm tracking-[0.4em] uppercase font-sans font-medium">Available Halls</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {venue.halls.map((hall, i) => (
                  <div key={i} className="flex items-center gap-4 glass-light rounded-2xl px-6 py-4 border border-white/05 hover:bg-white/05 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-gold-400" />
                    </div>
                    <span className="text-cream/90 text-base font-medium">{hall}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div data-reveal="up">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-8 bg-gold-400" />
                <h2 className="text-gold-400 text-sm tracking-[0.4em] uppercase font-sans font-medium">Curated Amenities</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 glass-light rounded-2xl px-6 py-5 border border-white/05 hover:bg-white/05 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-gold-400" />
                    </div>
                    <span className="text-cream/90 text-base font-medium">{a}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-4" data-reveal="fade" data-delay="3">
            <div className="sticky top-28 glass rounded-[32px] p-8 border border-gold-500/20 gold-glow overflow-hidden">
              <div className="orb w-48 h-48 bg-gold-500/05 -top-10 -right-10" />
              <div className="relative z-10">

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-gold-400/50 text-[11px] tracking-widest uppercase mb-1">Elite Booking Rate</span>
                    <div className="flex items-baseline gap-2">
                      <span className="animated-gradient-text font-display text-4xl font-bold">
                        ₹{(venue.price / 1000).toFixed(0)}K
                      </span>
                      <span className="text-cream/70 text-sm">{venue.priceUnit}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-gold-500/20">
                    <ArrowUpRight size={24} className="text-navy-950" />
                  </div>
                </div>

                <div className="section-line mb-6 opacity-20" />

                {/* Check Availability Panel */}
                <CheckAvailabilityPanel venue={venue} />

                {/* Trust Signals */}
                <div className="mt-6 pt-6 border-t border-gold-500/10 space-y-3">
                  {[
                    { text: 'Best Price Guaranteed', icon: Shield },
                    { text: 'Concierge Event Manager', icon: Sparkles },
                    { text: 'Priority Processing', icon: Clock },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-cream/70 text-sm">
                      <feat.icon size={14} className="text-gold-400/50" />
                      <span className="tracking-wide">{feat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Suggested Venues */}
      <div className="section-container py-32" data-reveal="up">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-gold-400" />
              <h2 className="text-gold-400 text-sm tracking-[0.4em] uppercase font-sans font-medium">The Collection</h2>
            </div>
            <h3 className="font-display text-4xl text-cream">Similar Statement Venues</h3>
          </div>
          <Link to="/venues" className="btn-outline px-8 py-3 rounded-full text-sm hidden md:flex">
            View All Venues
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {venues.filter(v => v.id !== venue.id).slice(0, 3).map((v) => (
            <Link key={v.id} to={`/venues/${v.slug}`} className="glass rounded-[32px] overflow-hidden group border border-white/05 hover:border-gold-500/20 transition-all duration-500">
              <div className="h-48 overflow-hidden relative">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent opacity-60" />
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 border border-white/10">
                  <span className="text-gold-400 font-bold text-sm">₹{(v.price / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-gold-500/50 text-[11px] tracking-[0.2em] uppercase mb-2 font-sans">{v.type}</div>
                <div className="font-display text-2xl text-cream group-hover:text-gold-400 transition-colors">{v.name}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cream/60 text-sm">
                    <Users size={12} /> {v.capacity.toLocaleString()}
                  </div>
                  <div className="text-gold-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
