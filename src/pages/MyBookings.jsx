import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, Users, MapPin, Clock, CheckCircle, AlertCircle, 
  XCircle, ChevronDown, ChevronUp, Plus, FileText, Download, Trash2, ArrowRight, Compass
} from 'lucide-react'
import { bookingRequests } from '../data/staticData'
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

const statusConfig = {
  confirmed: { label: 'Confirmed Protocol', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
  tentative: { label: 'Awaiting Verification', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertCircle },
  cancelled: { label: 'Nullified', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
}

function BookingCard({ booking, idx }) {
  const [expanded, setExpanded] = useState(false)
  const status = statusConfig[booking.status]
  const StatusIcon = status.icon

  return (
    <div 
      className={`glass group rounded-3xl overflow-hidden border transition-all duration-700 ${
        expanded ? 'border-gold-500/30 shadow-2xl shadow-gold-500/10' : 'border-white/05 hover:border-gold-500/10'
      }`}
      data-reveal="up"
      data-delay={String((idx % 4) + 1)}
    >
      {/* Main Preview Container */}
      <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-8 relative overflow-hidden">
        {/* Animated Background Element */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gold-500/03 rounded-full blur-3xl transition-opacity duration-700 ${expanded ? 'opacity-100' : 'opacity-0'}`} />

        {/* Status + ID Column */}
        <div className="flex items-center gap-5 lg:w-48 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/05 border border-gold-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Calendar size={22} className="text-gold-400/60" />
          </div>
          <div>
            <div className="font-mono text-gold-400/50 text-[10px] tracking-widest uppercase mb-1.5">{booking.id}</div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${status.bg} ${status.border}`}>
              <StatusIcon size={12} className={status.color} />
              <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${status.color}`}>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Venue Information Column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-gold-500/40 text-[9px] tracking-[0.3em] uppercase">{booking.eventType}</span>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <span className="text-cream/30 text-[9px] tracking-[0.3em] uppercase">{booking.company}</span>
          </div>
          <h3 className="font-display text-2xl text-cream group-hover:text-gold-400 transition-colors">{booking.venue}</h3>
        </div>

        {/* Metadata Grid Column */}
        <div className="grid grid-cols-3 gap-6 shrink-0 text-center lg:text-left">
          <div className="px-4 border-l border-white/05">
            <div className="text-cream/20 text-[9px] tracking-[0.2em] uppercase mb-1">Schedule</div>
            <div className="text-cream text-xs font-bold tracking-wide">
              {new Date(booking.eventDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
            </div>
          </div>
          <div className="px-4 border-l border-white/05">
            <div className="text-cream/20 text-[9px] tracking-[0.2em] uppercase mb-1">Presence</div>
            <div className="text-cream text-xs font-bold tracking-wide">{booking.guests.toLocaleString()}</div>
          </div>
          <div className="px-4 border-l border-white/05">
            <div className="text-cream/20 text-[9px] tracking-[0.2em] uppercase mb-1">Contract Value</div>
            <div className="text-gold-400 text-xs font-bold tracking-wide">₹{(booking.amount / 100000).toFixed(1)}L</div>
          </div>
        </div>

        {/* Action Toggle */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className={`shrink-0 w-12 h-12 glass rounded-2xl flex items-center justify-center transition-all duration-500 ${
            expanded ? 'bg-gold-500/10 border-gold-500/20 text-gold-400 rotate-180' : 'text-cream/20 hover:text-gold-400 hover:border-gold-500/20'
          }`}
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Expanded Details Section */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 pt-4">
          <div className="section-line mb-8 opacity-10" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Ingress Point', value: new Date(booking.setupDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year: 'numeric' }), icon: Clock, desc: 'Setup Protocol' },
              { label: 'Event Segment', value: new Date(booking.eventDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year: 'numeric' }), icon: Calendar, desc: 'Primary Window' },
              { label: 'Egress Point', value: new Date(booking.dismantleDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year: 'numeric' }), icon: Clock, desc: 'Dismantle Phase' },
              { label: 'Principal Organiser', value: booking.organizer, icon: Users, desc: 'Commanding Officer' },
            ].map((item, i) => (
              <div key={i} className="glass-light rounded-2xl p-5 border border-white/05 hover:bg-white/05 transition-all">
                <div className="flex items-center gap-3 text-gold-500/40 text-[9px] tracking-[0.3em] uppercase mb-3">
                  <item.icon size={12} />
                  {item.label}
                </div>
                <div className="text-cream text-sm font-bold mb-1 tracking-wide">{item.value}</div>
                <div className="text-cream/20 text-[9px] tracking-widest uppercase italic">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {booking.status === 'tentative' && (
                <button className="btn-gold px-8 py-3 rounded-2xl text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle size={14} /> Formalize Booking
                </button>
              )}
              <button className="btn-outline px-8 py-3 rounded-2xl text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                <Download size={14} /> Contract Details
              </button>
            </div>
            
            {booking.status !== 'cancelled' && (
              <button className="px-6 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase border border-red-500/10 text-red-400/40 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-2">
                <Trash2 size={13} /> Withdraw Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyBookings() {
  useScrollReveal()
  const [filter, setFilter] = useState('all')

  const filtered = bookingRequests.filter(b => filter === 'all' || b.status === filter)
  const counts = {
    all: bookingRequests.length,
    confirmed: bookingRequests.filter(b => b.status === 'confirmed').length,
    tentative: bookingRequests.filter(b => b.status === 'tentative').length,
  }

  return (
    <div className="min-h-screen bg-navy-950 pb-32">
      <ScrollProgressBar />
      
      {/* Immersive Dashboard Header */}
      <div className="relative pt-40 pb-20 border-b border-gold-500/10 overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-teal-800/10 -right-40 -top-40" />
        <div className="orb w-[500px] h-[500px] bg-gold-500/05 -left-40 bottom-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div data-reveal="left">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-gold-500/50" />
                <span className="text-gold-400 text-[10px] tracking-[0.4em] uppercase font-sans font-medium">Personal Archive</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight">
                My <em className="animated-gradient-text not-italic">Engagements</em>
              </h1>
            </div>
            
            <Link to="/book" className="btn-gold px-10 py-5 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-3 self-start md:self-auto shadow-2xl shadow-gold-500/10" data-reveal="fade">
              <Plus size={18} /> Initiate New Protocol
            </Link>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16" data-reveal="up" data-delay="1">
            {[
              { label: 'Total Protocols', value: counts.all, color: 'text-cream' },
              { label: 'Success Ratio', value: '98%', color: 'text-gold-400' },
              { label: 'Confirmed', value: counts.confirmed, color: 'text-emerald-400' },
              { label: 'Awaiting Review', value: counts.tentative, color: 'text-amber-400' },
            ].map(({ label, value, color }, idx) => (
              <div key={label} className="glass rounded-3xl p-6 border border-white/05 hover:border-gold-500/20 transition-all text-center">
                <div className={`font-display text-4xl font-bold ${color} mb-1 animate-pulse-gold`}>{value}</div>
                <div className="text-white/20 text-[9px] tracking-widest uppercase font-sans font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* Elite Filtering Interface */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12" data-reveal="fade">
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
            {[
              { key: 'all', label: 'Complete Archive' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'tentative', label: 'In Verification' },
            ].map(({ key, label }) => (
              <button 
                key={key} 
                onClick={() => setFilter(key)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap border ${
                  filter === key
                    ? 'bg-gold-gradient text-navy-950 border-gold-400 shadow-xl shadow-gold-500/20'
                    : 'glass-light text-cream/40 border-white/05 hover:border-gold-500/30 hover:text-cream'
                }`}
              >
                {label} <span className="ml-2 opacity-50">({counts[key] ?? filtered.length})</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-white/20 text-[10px] tracking-widest uppercase">
            <span>Displaying Results</span>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-gold-400 font-bold tracking-normal">{filtered.length} Units</span>
          </div>
        </div>

        {/* Dynamic Booking Portal */}
        {filtered.length === 0 ? (
          <div className="text-center py-40 glass rounded-[40px] border border-white/05 relative overflow-hidden" data-reveal="fade">
             <div className="orb w-64 h-64 bg-gold-500/05 mx-auto -top-32" />
             <div className="relative z-10">
                <div className="w-24 h-24 bg-gold-500/05 rounded-full flex items-center justify-center mx-auto mb-10 border border-gold-500/10">
                  <FileText size={32} className="text-gold-400/40" />
                </div>
                <h3 className="font-display text-4xl text-cream mb-4">Archive Empty</h3>
                <p className="text-cream/30 text-lg max-w-sm mx-auto mb-12">No active engagement protocols found in your history.</p>
                <Link to="/venues" className="btn-gold px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase inline-flex items-center gap-3">
                  <Compass size={16} /> Discovery Portal <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((b, idx) => <BookingCard key={b.id} booking={b} idx={idx} />)}
          </div>
        )}

        {/* Concierge Support Note */}
        <div className="mt-20 relative px-10 py-12 rounded-[40px] overflow-hidden" data-reveal="up">
          <div className="absolute inset-0 bg-gold-gradient opacity-[0.03]" />
          <div className="absolute inset-0 border border-gold-500/10 rounded-[40px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0">
               <AlertCircle size={32} className="text-gold-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-display text-2xl text-cream mb-2">Protocol Assistance Required?</h4>
              <p className="text-cream/30 text-sm leading-relaxed max-w-2xl">
                Bookings marked <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Awaiting Verification</span> are currently under executive review. For priority acceleration, please contact the Elite Concierge at <span className="text-gold-400 font-bold">+91 120 696 6555</span>.
              </p>
            </div>
            <button className="btn-outline px-8 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase shrink-0 whitespace-nowrap">
              Secure Support Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

