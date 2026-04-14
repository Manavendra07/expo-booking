import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Users, MapPin, Clock, CheckCircle, AlertCircle,
  XCircle, ChevronDown, Plus, FileText, Download, Trash2, ArrowRight,
  Compass, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  LayoutGrid, CalendarDays, Filter, Building2, Tag, Sparkles
} from 'lucide-react'
import { bookingRequests, venues, industries, eventStatuses } from '../data/staticData'
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
      <div className="h-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite', transition: 'width 0.1s ease', boxShadow: '0 0 8px rgba(201,168,76,0.6)' }} />
    </div>
  )
}

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: '#34d399', icon: CheckCircle },
  tentative: { label: 'Tentative', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: '#fbbf24', icon: AlertCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: '#f87171', icon: XCircle },
  completed: { label: 'Completed', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: '#60a5fa', icon: Sparkles },
}

/* ─── Booking Card ───────────────────────────────────────────────────── */
function BookingCard({ booking, idx }) {
  const [expanded, setExpanded] = useState(false)
  const status = statusConfig[booking.status] || statusConfig.tentative
  const StatusIcon = status.icon

  return (
    <div className={`glass group rounded-3xl overflow-hidden border transition-all duration-700 ${expanded ? 'border-gold-500/30 shadow-2xl shadow-gold-500/10' : 'border-white/05 hover:border-gold-500/10'}`}
      data-reveal="up" data-delay={String((idx % 4) + 1)}>
      <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/03 rounded-full blur-3xl transition-opacity duration-700" style={{ opacity: expanded ? 1 : 0 }} />

        {/* Status + ID */}
        <div className="flex items-center gap-4 lg:w-48 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/05 border border-gold-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Calendar size={20} className="text-gold-400/60" />
          </div>
          <div>
            <div className="font-mono text-gold-400/80 text-[12px] tracking-widest uppercase mb-1">{booking.id}</div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${status.bg} ${status.border}`}>
              <StatusIcon size={11} className={status.color} />
              <span className={`text-[11px] font-sans font-bold uppercase tracking-wider ${status.color}`}>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="text-gold-500/80 text-[12px] tracking-[0.2em] uppercase mb-1">{booking.eventType} · {booking.company}</div>
          <h3 className="font-display text-xl text-cream group-hover:text-gold-400 transition-colors truncate">{booking.eventName || booking.venue}</h3>
          <div className="text-cream/70 text-sm mt-0.5 flex items-center gap-1"><Building2 size={10} />{booking.venue} — {booking.hall}</div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-4 shrink-0 text-center lg:text-left">
          <div className="px-3 border-l border-white/05">
            <div className="text-cream/70 text-[11px] tracking-[0.2em] uppercase mb-1">Schedule</div>
            <div className="text-cream text-sm font-bold">{new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          </div>
          <div className="px-3 border-l border-white/05">
            <div className="text-cream/70 text-[11px] tracking-[0.2em] uppercase mb-1">Guests</div>
            <div className="text-cream text-sm font-bold">{booking.guests?.toLocaleString()}</div>
          </div>
          <div className="px-3 border-l border-white/05">
            <div className="text-cream/70 text-[11px] tracking-[0.2em] uppercase mb-1">Value</div>
            <div className="text-gold-400 text-sm font-bold">₹{(booking.amount / 100000).toFixed(1)}L</div>
          </div>
        </div>

        <button onClick={() => setExpanded(!expanded)}
          className={`shrink-0 w-10 h-10 glass rounded-xl flex items-center justify-center transition-all duration-500 ${expanded ? 'bg-gold-500/10 border-gold-500/20 text-gold-400 rotate-180' : 'text-cream/50 hover:text-gold-400'}`}>
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Expanded */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 pt-2">
          <div className="section-line mb-6 opacity-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Setup Period', value: booking.setupDate + (booking.setupEndDate && booking.setupEndDate !== booking.setupDate ? ' → ' + booking.setupEndDate : ''), icon: Clock },
              { label: 'Event Date', value: new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: Calendar },
              { label: 'Dismantle Period', value: booking.dismantleDate + (booking.dismantleEndDate && booking.dismantleEndDate !== booking.dismantleDate ? ' → ' + booking.dismantleEndDate : ''), icon: Clock },
              { label: 'Organizer', value: booking.organizer, icon: Users },
            ].map((item, i) => (
              <div key={i} className="glass-light rounded-2xl p-4 border border-white/05">
                <div className="flex items-center gap-2 text-gold-500/40 text-[9px] tracking-[0.3em] uppercase mb-2">
                  <item.icon size={11} />{item.label}
                </div>
                <div className="text-cream text-sm font-bold">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {booking.primePeriod && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${booking.primePeriod.includes('High') ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                {booking.primePeriod.includes('High') ? '🔥' : '🌿'} {booking.primePeriod}
              </span>
            )}
            {booking.industry && (
              <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[11px] font-medium">{booking.industry}</span>
            )}
            {(booking.sector || []).map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full bg-white/05 border border-white/10 text-cream/70 text-[11px]">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {booking.status === 'tentative' && (
                <button className="btn-gold px-7 py-2.5 rounded-2xl text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle size={13} /> Formalize Booking
                </button>
              )}
              <button className="btn-outline px-7 py-2.5 rounded-2xl text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                <Download size={13} /> Contract Details
              </button>
            </div>
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <button className="px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase border border-red-500/10 text-red-400/40 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-2">
                <Trash2 size={12} /> Withdraw
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Calendar View ──────────────────────────────────────────────────── */
function CalendarView({ bookings }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [popup, setPopup] = useState(null)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Map bookings to dates in current month/year
  const dayMap = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      const d = new Date(b.eventDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(b)
      }
    })
    return map
  }, [bookings, year, month])

  const changeMonth = (dir) => {
    let m = month + dir, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setMonth(m); setYear(y); setPopup(null)
  }

  return (
    <div className="glass rounded-3xl border border-gold-500/15 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/05">
        <div>
          <h3 className="font-display text-2xl text-cream">{monthNames[month]} {year}</h3>
          <p className="text-gold-400/40 text-[11px] tracking-widest uppercase mt-0.5">Booking Calendar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cream/70 hover:text-gold-400 transition-colors border border-white/05">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => { setMonth(now.getMonth()); setYear(now.getFullYear()) }} className="px-4 h-9 glass rounded-xl text-[11px] text-cream/70 hover:text-gold-400 font-sans uppercase tracking-widest transition-colors border border-white/05">Today</button>
          <button onClick={() => changeMonth(1)} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cream/70 hover:text-gold-400 transition-colors border border-white/05">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-cream/50 text-[11px] font-sans py-2 tracking-widest uppercase">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dayBookings = dayMap[day] || []
            const isToday = year === now.getFullYear() && month === now.getMonth() && day === now.getDate()
            const isSelected = popup === day
            return (
              <button key={day} onClick={() => setPopup(isSelected ? null : day)}
                className={`relative min-h-[52px] flex flex-col items-center pt-1 pb-1 px-1 rounded-xl text-sm font-sans transition-all duration-200 ${isSelected ? 'bg-gold-500/15 border border-gold-500/30' : isToday ? 'bg-white/08 border border-white/10' : dayBookings.length > 0 ? 'hover:bg-white/05 border border-transparent' : 'border border-transparent hover:bg-white/03'
                  }`}>
                <span className={`${isToday ? 'text-gold-400 font-bold' : dayBookings.length > 0 ? 'text-cream' : 'text-cream/60'}`}>{day}</span>
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {dayBookings.slice(0, 3).map((b, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: statusConfig[b.status]?.dot || '#c9a84c' }} />
                  ))}
                  {dayBookings.length > 3 && <span className="text-gold-400 text-[8px]">+{dayBookings.length - 3}</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Popup: bookings for selected day */}
        {popup && dayMap[popup] && (
          <div className="mt-6 space-y-3 border-t border-white/05 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-gold-400" />
              <span className="text-gold-400 text-[11px] tracking-[0.3em] uppercase font-sans">{monthNames[month]} {popup} — {dayMap[popup].length} Booking{dayMap[popup].length > 1 ? 's' : ''}</span>
            </div>
            {dayMap[popup].map(b => {
              const st = statusConfig[b.status] || statusConfig.tentative
              return (
                <div key={b.id} className="glass-light rounded-2xl p-4 border border-white/05 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: st.dot }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-cream text-base font-semibold truncate">{b.eventName || b.venue}</div>
                    <div className="text-cream/70 text-sm">{b.venue} · {b.hall}</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.bg} ${st.border} ${st.color}`}>{st.label}</div>
                </div>
              )
            })}
          </div>
        )}
        {popup && !dayMap[popup] && (
          <div className="mt-6 border-t border-white/05 pt-5 text-center text-cream/60 text-base">
            No bookings on {monthNames[month]} {popup}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 pb-5 flex flex-wrap gap-4">
        {Object.entries(statusConfig).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: val.dot }} />
            <span className="text-cream/60 text-[11px] font-sans">{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main MyBookings Page ───────────────────────────────────────────── */
export default function MyBookings() {
  useScrollReveal()
  const [viewMode, setViewMode] = useState('list') // 'list' | 'calendar'
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [search, setSearch] = useState('')
  const [advFilters, setAdvFilters] = useState({ venue: '', industry: '', dateFrom: '', dateTo: '', status: '' })

  // Merge static + sessionStorage bookings
  const allBookings = useMemo(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('expoinn_bookings') || '[]')
      return [...bookingRequests, ...stored]
    } catch { return bookingRequests }
  }, [])

  const setAdv = (k, v) => setAdvFilters(f => ({ ...f, [k]: v }))

  const filtered = useMemo(() => {
    return allBookings.filter(b => {
      // Global search: Event Name + Organizer
      if (search) {
        const q = search.toLowerCase()
        const matchName = (b.eventName || '').toLowerCase().includes(q)
        const matchOrg = (b.organizer || '').toLowerCase().includes(q)
        const matchVenue = (b.venue || '').toLowerCase().includes(q)
        if (!matchName && !matchOrg && !matchVenue) return false
      }
      // Status tab filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      // Advanced: venue
      if (advFilters.venue && b.venue !== advFilters.venue) return false
      // Advanced: industry
      if (advFilters.industry && b.industry !== advFilters.industry) return false
      // Advanced: date range
      if (advFilters.dateFrom && new Date(b.eventDate) < new Date(advFilters.dateFrom)) return false
      if (advFilters.dateTo && new Date(b.eventDate) > new Date(advFilters.dateTo)) return false
      // Advanced: status (if set overrides tab)
      if (advFilters.status && b.status !== advFilters.status.toLowerCase()) return false
      return true
    })
  }, [allBookings, search, statusFilter, advFilters])

  const counts = {
    all: allBookings.length,
    confirmed: allBookings.filter(b => b.status === 'confirmed').length,
    tentative: allBookings.filter(b => b.status === 'tentative').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
  }

  const clearAdvanced = () => setAdvFilters({ venue: '', industry: '', dateFrom: '', dateTo: '', status: '' })
  const hasAdvFilters = Object.values(advFilters).some(v => v !== '')

  return (
    <div className="min-h-screen bg-navy-950 pb-32">
      <ScrollProgressBar />

      {/* Header */}
      <div className="relative pt-36 pb-16 border-b border-gold-500/10 overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-800/10 -right-40 -top-40" />
        <div className="orb w-[500px] h-[500px] bg-gold-500/05 -left-40 bottom-0" />
        <div className="section-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div data-reveal="left">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-gold-500/50" />
                <span className="text-gold-400 text-[12px] tracking-[0.4em] uppercase font-sans">Personal Archive</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight">
                My <em className="animated-gradient-text not-italic">Bookings</em>
              </h1>
            </div>
            <Link to="/book" className="btn-gold px-10 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-3 self-start shadow-2xl shadow-gold-500/10" data-reveal="fade">
              <Plus size={16} /> New Booking
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14" data-reveal="up" data-delay="1">
            {[
              { label: 'Total Bookings', value: counts.all, color: 'text-cream' },
              { label: 'Confirmed', value: counts.confirmed, color: 'text-emerald-400' },
              { label: 'Awaiting Review', value: counts.tentative, color: 'text-amber-400' },
              { label: 'Completed', value: counts.completed, color: 'text-blue-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass rounded-3xl p-6 border border-white/05 hover:border-gold-500/20 transition-all text-center">
                <div className={`font-display text-4xl font-bold ${color} mb-1`}>{value}</div>
                <div className="text-white/70 text-[12px] tracking-widest uppercase font-sans">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container mt-12">

        {/* Search + View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6" data-reveal="fade">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/40" />
            <input
              type="text"
              placeholder="Search by event name, organizer, or venue…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-navy-950/60 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-5 py-4 rounded-2xl text-sm font-sans tracking-widest uppercase border transition-all ${showAdvanced || hasAdvFilters ? 'bg-gold-500/10 border-gold-400 text-gold-400' : 'glass border-white/10 text-cream/80 hover:text-cream'}`}>
              <Filter size={14} />
              Filters {hasAdvFilters && <span className="w-5 h-5 rounded-full bg-gold-400 text-navy-950 text-[11px] font-bold flex items-center justify-center">{Object.values(advFilters).filter(v => v).length}</span>}
            </button>
            <div className="flex glass rounded-2xl border border-white/10 overflow-hidden">
              <button onClick={() => setViewMode('list')} className={`px-4 py-2 flex items-center gap-1.5 text-sm transition-all ${viewMode === 'list' ? 'bg-gold-500/15 text-gold-400' : 'text-cream/60 hover:text-cream'}`}>
                <LayoutGrid size={14} />
              </button>
              <button onClick={() => setViewMode('calendar')} className={`px-4 py-2 flex items-center gap-1.5 text-sm transition-all border-l border-white/10 ${viewMode === 'calendar' ? 'bg-gold-500/15 text-gold-400' : 'text-cream/60 hover:text-cream'}`}>
                <CalendarDays size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="glass rounded-3xl p-6 border border-gold-500/15 mb-6 animate-slide-up" data-reveal="fade">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-gold-400" />
                <span className="text-gold-400 text-sm tracking-[0.3em] uppercase font-sans">Advanced Filters</span>
              </div>
              {hasAdvFilters && (
                <button onClick={clearAdvanced} className="text-red-400/60 hover:text-red-400 text-sm flex items-center gap-1 transition-colors">
                  <X size={12} /> Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Venue filter */}
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase flex items-center gap-1"><Building2 size={10} />Venue</label>
                <select value={advFilters.venue} onChange={e => setAdv('venue', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none">
                  <option value="">All Venues</option>
                  {venues.map(v => <option key={v.id}>{v.name}</option>)}
                </select>
              </div>
              {/* Industry filter */}
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase flex items-center gap-1"><Tag size={10} />Industry</label>
                <select value={advFilters.industry} onChange={e => setAdv('industry', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none">
                  <option value="">All Industries</option>
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              {/* Status filter */}
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase">Status</label>
                <select value={advFilters.status} onChange={e => setAdv('status', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none">
                  <option value="">All Statuses</option>
                  {['confirmed', 'tentative', 'cancelled', 'completed'].map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              {/* Date From */}
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase flex items-center gap-1"><Calendar size={10} />Date From</label>
                <input type="date" value={advFilters.dateFrom} onChange={e => setAdv('dateFrom', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
              </div>
              {/* Date To */}
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase">Date To</label>
                <input type="date" value={advFilters.dateTo} onChange={e => setAdv('dateTo', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* Status Quick Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8" data-reveal="fade">
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { key: 'all', label: 'All Bookings', count: counts.all },
              { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
              { key: 'tentative', label: 'Tentative', count: counts.tentative },
              { key: 'completed', label: 'Completed', count: counts.completed },
            ].map(({ key, label, count }) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`px-5 py-2.5 rounded-full text-[12px] font-bold tracking-widest uppercase transition-all whitespace-nowrap border ${statusFilter === key
                    ? 'bg-gold-gradient text-navy-950 border-gold-400 shadow-xl shadow-gold-500/20'
                    : 'glass-light text-cream/70 border-white/05 hover:border-gold-500/30 hover:text-cream'
                  }`}>
                {label} <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            ))}
          </div>
          <div className="text-cream/60 text-[11px] tracking-widest uppercase">
            Showing <span className="text-gold-400 font-bold">{filtered.length}</span> results
          </div>
        </div>

        {/* View: List or Calendar */}
        {viewMode === 'calendar' ? (
          <div data-reveal="fade">
            <CalendarView bookings={filtered} />
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-40 glass rounded-[40px] border border-white/05 relative overflow-hidden" data-reveal="fade">
                <div className="orb w-64 h-64 bg-gold-500/05 mx-auto -top-32" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gold-500/05 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold-500/10">
                    <FileText size={28} className="text-gold-400/40" />
                  </div>
                  <h3 className="font-display text-4xl text-cream mb-4">No Bookings Found</h3>
                  <p className="text-cream/60 text-base max-w-sm mx-auto mb-10">
                    {search || hasAdvFilters ? 'Try adjusting your search or filter criteria.' : 'No active booking protocols in your history.'}
                  </p>
                  {search || hasAdvFilters ? (
                    <button onClick={() => { setSearch(''); clearAdvanced() }} className="btn-outline px-8 py-3 rounded-full text-sm">Clear All Filters</button>
                  ) : (
                    <Link to="/venues" className="btn-gold px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-3">
                      <Compass size={16} /> Browse Venues <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map((b, idx) => <BookingCard key={b.id} booking={b} idx={idx} />)}
              </div>
            )}
          </>
        )}

        {/* Concierge Note */}
        <div className="mt-20 relative px-8 py-10 rounded-[40px] overflow-hidden" data-reveal="up">
          <div className="absolute inset-0 bg-gold-gradient opacity-[0.03]" />
          <div className="absolute inset-0 border border-gold-500/10 rounded-[40px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle size={28} className="text-gold-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-display text-2xl text-cream mb-2">Need Assistance?</h4>
              <p className="text-cream/60 text-base leading-relaxed max-w-2xl">
                Tentative bookings are held for <span className="text-amber-400 font-bold">48 hours</span> pending verification. For priority processing, contact our concierge at <span className="text-gold-400 font-bold">+91 120 696 6555</span>.
              </p>
            </div>
            <button className="btn-outline px-8 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase shrink-0 whitespace-nowrap">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  )
}
