import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Users, MapPin, Clock, CheckCircle, AlertCircle,
  XCircle, ChevronDown, Plus, FileText, Download, Trash2, ArrowRight,
  Compass, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  LayoutGrid, CalendarDays, Filter, Building2, Tag, Sparkles,
  Phone, Mail, Layers, IndianRupee, CalendarCheck, AlertTriangle
} from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'
import { venues, industries } from '../data/staticData'
import { getBookings, withdrawBooking } from '../utils/bookingStore'
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

/* ─── Status Config ──────────────────────────────────────────────────── */
const statusConfig = {
  confirmed: { label: 'Confirmed',  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: '#34d399', icon: CheckCircle },
  tentative: { label: 'Tentative',  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   dot: '#fbbf24', icon: AlertCircle },
  cancelled: { label: 'Cancelled',  color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20',     dot: '#f87171', icon: XCircle },
  completed: { label: 'Completed',  color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    dot: '#60a5fa', icon: Sparkles },
}

/* ─── Full Booking Detail Modal ──────────────────────────────────────── */
function BookingDetailModal({ booking, onClose, onWithdraw }) {
  const st = statusConfig[booking.status] || statusConfig.tentative
  const StatusIcon = st.icon
  const pdfRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return
    const toastId = toast.loading('Generating Contract PDF...')
    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true, logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`ExpoInn_Contract_${booking.id}.pdf`)
      toast.success('Contract Downloaded Successfully!', { id: toastId })
    } catch (error) {
      toast.error('Failed to generate PDF contract.', { id: toastId })
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(5,8,20,0.85)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
      <div
        className="relative w-full max-w-2xl glass rounded-[32px] border border-gold-500/20 overflow-hidden shadow-2xl shadow-gold-500/10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Gold orb accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold-500/08 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative z-10 px-8 pt-8 pb-6 border-b border-white/05">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-gold-400/70 text-xs tracking-[0.3em] uppercase mb-2">{booking.id}</div>
              <h3 className="font-display text-2xl text-cream leading-tight">
                {booking.eventName || booking.venue}
              </h3>
              <div className="text-cream/60 text-sm mt-1 flex items-center gap-1.5">
                <Building2 size={12} /> {booking.venue} — {booking.hall}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${st.bg} ${st.border} ${st.color}`}>
                <StatusIcon size={11} /> {st.label}
              </div>
              <button onClick={onClose}
                className="w-9 h-9 glass border border-white/10 rounded-xl flex items-center justify-center text-cream/60 hover:text-cream transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 px-8 py-6 max-h-[60vh] overflow-y-auto space-y-6">

          {/* Date Range */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Setup Date',    value: booking.setupDate    || '—', icon: Clock },
              { label: 'Event Date',    value: booking.eventDate    || '—', icon: CalendarCheck },
              { label: 'Dismantle',     value: booking.dismantleDate || '—', icon: Clock },
            ].map((item, i) => (
              <div key={i} className="glass-light rounded-2xl p-4 border border-white/05 text-center">
                <div className="flex items-center justify-center gap-1 text-gold-400/50 text-[10px] tracking-[0.2em] uppercase mb-2">
                  <item.icon size={10} /> {item.label}
                </div>
                <div className="text-cream text-sm font-bold">
                  {item.value !== '—'
                    ? new Date(item.value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Event Type',  value: booking.eventType  || '—', icon: CalendarDays },
              { label: 'Guests',      value: booking.guests?.toLocaleString() || '—', icon: Users },
              { label: 'Industry',    value: booking.industry   || '—', icon: Building2 },
              { label: 'Time Slot',   value: booking.timeSlot   || 'Full Day', icon: Clock },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 glass-light rounded-2xl p-4 border border-white/05">
                <div className="w-8 h-8 rounded-xl bg-gold-500/08 flex items-center justify-center shrink-0">
                  <item.icon size={14} className="text-gold-400/60" />
                </div>
                <div>
                  <div className="text-cream/50 text-[10px] tracking-widest uppercase">{item.label}</div>
                  <div className="text-cream text-sm font-semibold mt-0.5">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sectors */}
          {(booking.sector || []).length > 0 && (
            <div>
              <div className="text-cream/50 text-[10px] tracking-widest uppercase mb-2 flex items-center gap-1.5">
                <Tag size={10} /> Sectors
              </div>
              <div className="flex flex-wrap gap-2">
                {(booking.sector || []).map(s => (
                  <span key={s} className="px-3 py-1 rounded-full bg-gold-500/08 border border-gold-500/15 text-gold-400 text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Organizer */}
          <div className="glass-light rounded-2xl p-5 border border-white/05">
            <div className="text-gold-400/50 text-[10px] tracking-[0.3em] uppercase mb-4 font-sans">Organizer Details</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-cream/50 text-[10px] uppercase tracking-widest mb-1">Name</div>
                <div className="text-cream text-sm font-semibold">{booking.organizer || '—'}</div>
              </div>
              <div>
                <div className="text-cream/50 text-[10px] uppercase tracking-widest mb-1">Company</div>
                <div className="text-cream text-sm font-semibold">{booking.company || '—'}</div>
              </div>
              {booking.email && (
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-gold-400/50" />
                  <span className="text-cream/80 text-sm">{booking.email}</span>
                </div>
              )}
              {booking.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-gold-400/50" />
                  <span className="text-cream/80 text-sm">{booking.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial */}
          <div className="flex items-center justify-between glass-light rounded-2xl p-5 border border-gold-500/10">
            <div className="flex items-center gap-2 text-gold-400/60 text-sm tracking-widest uppercase">
              <IndianRupee size={14} /> Estimated Value
            </div>
            <div className="animated-gradient-text font-display text-2xl font-bold">
              ₹{booking.amount ? (booking.amount / 100000).toFixed(1) + 'L' : '—'}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 px-8 pb-8 pt-4 border-t border-white/05 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            {booking.status === 'tentative' && (
              <button className="btn-gold px-6 py-2.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <CheckCircle size={13} /> Formalize
              </button>
            )}
            <button onClick={handleDownloadPDF} className="btn-outline px-6 py-2.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all hover:bg-white/10">
              <Download size={13} /> Download PDF
            </button>
          </div>
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              onClick={() => onWithdraw(booking.id)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase border border-red-500/15 text-red-400/50 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-2"
            >
              <Trash2 size={12} /> Withdraw
            </button>
          )}
        </div>
        </div>
      </div>

      {/* Hidden PDF Printable Layout */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={pdfRef} className="w-[794px] bg-white p-12 text-navy-900 font-sans" style={{ minHeight: '1123px' }}>
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gold-500 pb-8 mb-8">
            <div>
              <div className="text-3xl font-display font-bold text-navy-900 mb-1">ExpoInn Booking Contract</div>
              <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">Booking Ref: {booking.id}</div>
              <div className="text-sm text-gray-500 font-medium tracking-wide uppercase mt-1">Generated: {new Date().toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-display text-gold-500 font-bold mb-1">EXPOINN WORLDWIDE</div>
              <p className="text-sm text-gray-600">100 Convention Blvd<br />Metropolis, EX 10001<br />billing@expoinn.com</p>
            </div>
          </div>

          {/* Client & Event Info */}
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4 border-b border-gray-200 pb-2">Client Details</h3>
              <p className="font-bold text-lg text-navy-900 mb-1">{booking.organizer || 'N/A'}</p>
              <p className="text-gray-700">{booking.company || 'N/A'}</p>
              <p className="text-gray-700 mt-2">{booking.email}</p>
              <p className="text-gray-700">{booking.phone}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4 border-b border-gray-200 pb-2">Event Specifications</h3>
              <p className="font-bold text-lg text-navy-900 mb-1">{booking.eventName || 'Unnamed Event'}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <span className="text-gray-500">Event Type:</span><span className="font-medium text-navy-900 text-right">{booking.eventType || 'N/A'}</span>
                <span className="text-gray-500">Expected Guests:</span><span className="font-medium text-navy-900 text-right">{booking.guests || 'N/A'}</span>
                <span className="text-gray-500">Industry:</span><span className="font-medium text-navy-900 text-right">{booking.industry || 'N/A'}</span>
                <span className="text-gray-500">Time Slot:</span><span className="font-medium text-navy-900 text-right">{booking.timeSlot || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Venue Schedule */}
          <h3 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4 border-b border-gray-200 pb-2">Schedule & Location</h3>
          <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg mb-10">
            <p className="text-xl font-bold text-navy-900 mb-4">{booking.venue} — {booking.hall}</p>
            <div className="flex justify-between items-center text-sm font-medium">
              <div className="text-center">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Setup Date</p>
                <p className="text-navy-900">{new Date(booking.setupDate).toLocaleDateString()}</p>
              </div>
              <div className="flex-1 h-px bg-gold-500/30 mx-4" />
              <div className="text-center">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Event Date</p>
                <p className="text-gold-500 font-bold">{new Date(booking.eventDate).toLocaleDateString()}</p>
              </div>
              <div className="flex-1 h-px bg-gold-500/30 mx-4" />
              <div className="text-center">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Dismantle Date</p>
                <p className="text-navy-900">{new Date(booking.dismantleDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Financials */}
          <h3 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4 border-b border-gray-200 pb-2">Financial Breakdown</h3>
          <table className="w-full text-sm mb-12">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-3 text-left text-gray-500 font-medium">Description</th>
                <th className="py-3 text-right text-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 text-navy-900 font-medium">Venue Rental ({booking.hall})</td>
                <td className="py-4 text-navy-900 text-right">₹{booking.amount?.toLocaleString()}</td>
              </tr>
              <tr className="border-b-2 border-navy-900">
                <td className="py-4 text-navy-900 font-bold text-right pr-8">Total Estimations</td>
                <td className="py-4 text-navy-900 font-bold text-right text-xl">₹{booking.amount?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Terms */}
          <div className="text-xs text-gray-500 leading-relaxed pt-10 border-t border-gray-200 space-y-2">
            <p className="font-bold text-gray-700">Contract Terms & Conditions:</p>
            <p>1. This document serves as a formal binding agreement between ExpoInn Worldwide and the aforementioned Client.</p>
            <p>2. A base deposit of 20% is required to secure the dates. The remaining balance must be paid 14 days prior to the Setup Date.</p>
            <p>3. Cancellations made within 30 days of the Setup Date are subject to a 50% retention fee.</p>
            <p>4. All structural setups and electrical wiring inside the venue must comply with ExpoInn Safety standards.</p>
          </div>
          
          <div className="mt-16 text-center text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">
            Thank you for choosing ExpoInn
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Booking Card (list view) ───────────────────────────────────────── */
function BookingCard({ booking, idx, onWithdraw, onViewDetail }) {
  const [expanded, setExpanded] = useState(false)
  const st = statusConfig[booking.status] || statusConfig.tentative
  const StatusIcon = st.icon

  return (
    <div
      className={`glass group rounded-3xl overflow-hidden border transition-all duration-700 ${
        expanded ? 'border-gold-500/30 shadow-2xl shadow-gold-500/10' : 'border-white/05 hover:border-gold-500/10'
      }`}
      data-reveal="up" data-delay={String((idx % 4) + 1)}
    >
      <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/03 rounded-full blur-3xl transition-opacity duration-700" style={{ opacity: expanded ? 1 : 0 }} />

        {/* Status + ID */}
        <div className="flex items-center gap-4 lg:w-52 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/05 border border-gold-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Calendar size={20} className="text-gold-400/60" />
          </div>
          <div>
            <div className="font-mono text-gold-400/80 text-[11px] tracking-widest uppercase mb-1">{booking.id}</div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${st.bg} ${st.border}`}>
              <StatusIcon size={11} className={st.color} />
              <span className={`text-[11px] font-sans font-bold uppercase tracking-wider ${st.color}`}>{st.label}</span>
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="text-gold-500/80 text-[11px] tracking-[0.2em] uppercase mb-1">{booking.eventType} · {booking.company}</div>
          <h3 className="font-display text-xl text-cream group-hover:text-gold-400 transition-colors truncate">
            {booking.eventName || booking.venue}
          </h3>
          <div className="text-cream/60 text-sm mt-0.5 flex items-center gap-1.5">
            <Building2 size={10} />{booking.venue} — {booking.hall}
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-4 shrink-0 text-center lg:text-left">
          <div className="px-3 border-l border-white/05">
            <div className="text-cream/60 text-[10px] tracking-[0.2em] uppercase mb-1">Date</div>
            <div className="text-cream text-sm font-bold">
              {new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>
          <div className="px-3 border-l border-white/05">
            <div className="text-cream/60 text-[10px] tracking-[0.2em] uppercase mb-1">Guests</div>
            <div className="text-cream text-sm font-bold">{booking.guests?.toLocaleString()}</div>
          </div>
          <div className="px-3 border-l border-white/05">
            <div className="text-cream/60 text-[10px] tracking-[0.2em] uppercase mb-1">Value</div>
            <div className="text-gold-400 text-sm font-bold">₹{(booking.amount / 100000).toFixed(1)}L</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onViewDetail(booking)}
            className="px-4 py-2 glass border border-gold-500/15 rounded-xl text-[11px] text-gold-400 hover:bg-gold-500/10 transition-all tracking-widest uppercase font-bold"
          >
            Details
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className={`w-10 h-10 glass rounded-xl flex items-center justify-center transition-all duration-500 ${
              expanded ? 'bg-gold-500/10 border border-gold-500/20 text-gold-400 rotate-180' : 'text-cream/50 hover:text-gold-400'
            }`}>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Expanded Panel */}
      {expanded && (
        <div className="animate-slide-up opacity-100">
          <div className="px-8 pb-8 pt-2">
          <div className="h-px bg-white/05 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Setup',      value: booking.setupDate    || '—', icon: Clock },
              { label: 'Event Date', value: booking.eventDate    ? new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—', icon: Calendar },
              { label: 'Dismantle',  value: booking.dismantleDate || '—', icon: Clock },
              { label: 'Organizer',  value: booking.organizer    || '—', icon: Users },
            ].map((item, i) => (
              <div key={i} className="glass-light rounded-2xl p-4 border border-white/05">
                <div className="flex items-center gap-1.5 text-gold-500/40 text-[9px] tracking-[0.3em] uppercase mb-2">
                  <item.icon size={10} />{item.label}
                </div>
                <div className="text-cream text-sm font-bold">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {booking.industry && (
              <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[11px] font-medium">
                {booking.industry}
              </span>
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
              <button
                onClick={() => onWithdraw(booking.id)}
                className="px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase border border-red-500/10 text-red-400/40 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-2"
              >
                <Trash2 size={12} /> Withdraw
              </button>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

/* ─── Calendar View ──────────────────────────────────────────────────── */
function CalendarView({ bookings, onViewDetail }) {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Map: day -> array of bookings for this month/year
  const dayMap = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      if (!b.eventDate) return
      // Mark every day in the full range (setup → dismantle) that falls in this month
      const setup    = new Date(b.setupDate    || b.eventDate)
      const dismantle = new Date(b.dismantleDate || b.eventDate)
      let cursor = new Date(setup)
      while (cursor <= dismantle) {
        if (cursor.getFullYear() === year && cursor.getMonth() === month) {
          const d = cursor.getDate()
          if (!map[d]) map[d] = []
          // Only add once per booking (avoid duplicates)
          if (!map[d].find(x => x.id === b.id)) map[d].push(b)
        }
        cursor.setDate(cursor.getDate() + 1)
      }
    })
    return map
  }, [bookings, year, month])

  const changeMonth = (dir) => {
    let m = month + dir, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m); setYear(y); setSelectedDay(null)
  }

  return (
    <div className="glass rounded-3xl border border-gold-500/15 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/05">
        <div>
          <h3 className="font-display text-2xl text-cream">{monthNames[month]} {year}</h3>
          <p className="text-gold-400/40 text-[11px] tracking-widest uppercase mt-0.5">Booking Calendar — click any date to view details</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cream/70 hover:text-gold-400 transition-colors border border-white/05">
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => { setMonth(now.getMonth()); setYear(now.getFullYear()); setSelectedDay(null) }}
            className="px-4 h-9 glass rounded-xl text-[11px] text-cream/70 hover:text-gold-400 font-sans uppercase tracking-widest transition-colors border border-white/05"
          >Today</button>
          <button onClick={() => changeMonth(1)}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cream/70 hover:text-gold-400 transition-colors border border-white/05">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Day Labels */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-cream/40 text-[10px] font-sans py-2 tracking-widest uppercase">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dayBookings = dayMap[day] || []
            const isToday     = year === now.getFullYear() && month === now.getMonth() && day === now.getDate()
            const isSelected  = selectedDay === day
            const hasBookings = dayBookings.length > 0
            // Primary status for visual coloring
            const primaryStatus = dayBookings[0]?.status

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`relative min-h-[56px] flex flex-col items-center pt-1.5 pb-1 px-1 rounded-xl text-sm font-sans transition-all duration-200 ${
                  isSelected   ? 'bg-gold-500/20 border border-gold-500/40 shadow-sm shadow-gold-500/10'
                  : isToday    ? 'bg-white/08 border border-white/10'
                  : hasBookings ? 'hover:bg-white/05 border border-transparent hover:border-gold-500/15'
                  :               'border border-transparent hover:bg-white/03'
                }`}
              >
                <span className={`text-[13px] font-semibold ${
                  isToday     ? 'text-gold-400'
                  : hasBookings ? 'text-cream'
                  :               'text-cream/50'
                }`}>{day}</span>

                {/* Booking dots + event label */}
                {hasBookings && (
                  <div className="mt-0.5 w-full flex flex-col items-center gap-0.5">
                    <div className="flex gap-0.5 justify-center">
                      {dayBookings.slice(0, 3).map((b, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: statusConfig[b.status]?.dot || '#c9a84c' }} />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="text-gold-400 text-[7px] font-bold">+{dayBookings.length - 3}</span>
                      )}
                    </div>
                    {/* Event name label (visible on larger cells) */}
                    <div className="text-[8px] text-cream/50 truncate w-full text-center leading-tight hidden sm:block">
                      {dayBookings[0].eventName
                        ? dayBookings[0].eventName.split(' ')[0]
                        : dayBookings[0].eventType?.split(' ')[0] || 'Event'}
                      {dayBookings.length > 1 && ` +${dayBookings.length - 1}`}
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Day Detail Popup ── */}
        {selectedDay && (
          <div className="mt-6 border-t border-white/05 pt-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-6 bg-gold-400" />
              <span className="text-gold-400 text-[11px] tracking-[0.3em] uppercase font-sans">
                {monthNames[month]} {selectedDay}
              </span>
              {dayMap[selectedDay] && (
                <span className="text-cream/50 text-[11px]">
                  — {dayMap[selectedDay].length} booking{dayMap[selectedDay].length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {dayMap[selectedDay] ? (
              <div className="space-y-3">
                {dayMap[selectedDay].map(b => {
                  const bSt = statusConfig[b.status] || statusConfig.tentative
                  const BIcon = bSt.icon
                  return (
                    <div
                      key={b.id}
                      className="glass-light rounded-2xl p-4 border border-white/05 hover:border-gold-500/15 transition-all cursor-pointer group"
                      onClick={() => onViewDetail(b)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Status dot */}
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: bSt.dot }} />

                        {/* Detail */}
                        <div className="flex-1 min-w-0">
                          <div className="text-cream text-base font-semibold truncate group-hover:text-gold-400 transition-colors">
                            {b.eventName || b.venue}
                          </div>
                          <div className="text-cream/60 text-sm mt-0.5 flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1"><Building2 size={10} />{b.venue}</span>
                            <span className="flex items-center gap-1"><Layers size={10} />{b.hall}</span>
                            {b.organizer && <span className="flex items-center gap-1"><Users size={10} />{b.organizer}</span>}
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${bSt.bg} ${bSt.border} ${bSt.color}`}>
                            <BIcon size={10} /> {bSt.label}
                          </div>
                          <div className="text-gold-400 text-sm font-bold hidden sm:block">
                            ₹{(b.amount / 100000).toFixed(1)}L
                          </div>
                          <div className="text-cream/30 group-hover:text-gold-400/60 transition-colors">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Date range ribbon */}
                      <div className="mt-3 flex items-center gap-4 text-[10px] text-cream/40 tracking-widest uppercase border-t border-white/03 pt-3">
                        <span className="flex items-center gap-1"><Clock size={9} /> Setup: {b.setupDate || b.eventDate}</span>
                        <span className="flex items-center gap-1"><Calendar size={9} /> Event: {b.eventDate}</span>
                        <span className="flex items-center gap-1"><Clock size={9} /> Dismantle: {b.dismantleDate || b.eventDate}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-cream/50 text-base py-6">
                No bookings on {monthNames[month]} {selectedDay}
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 border-t border-white/05 pt-4">
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: val.dot }} />
              <span className="text-cream/60 text-[11px] font-sans">{val.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main MyBookings Page ───────────────────────────────────────────── */
export default function MyBookings() {
  useScrollReveal()
  const [viewMode,     setViewMode]     = useState('list')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [search,       setSearch]       = useState('')
  const [advFilters,   setAdvFilters]   = useState({ venue: '', industry: '', dateFrom: '', dateTo: '', status: '' })
  const [allBookings,  setAllBookings]  = useState([])
  const [detailBooking, setDetailBooking] = useState(null) // booking to show in modal
  const [withdrawConfirm, setWithdrawConfirm] = useState(null) // id to confirm withdraw

  // ── Load (and reload) bookings from store ──
  const loadBookings = useCallback(() => {
    setAllBookings(getBookings())
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const setAdv = (k, v) => setAdvFilters(f => ({ ...f, [k]: v }))

  // ── Handle withdraw ──
  const handleWithdraw = useCallback((id) => {
    withdrawBooking(id)
    loadBookings()
    setDetailBooking(null)
    setWithdrawConfirm(null)
  }, [loadBookings])

  // ── Filtered bookings ──
  const filtered = useMemo(() => {
    return allBookings.filter(b => {
      if (search) {
        const q = search.toLowerCase()
        const hit = [b.eventName, b.organizer, b.venue, b.company, b.hall, b.industry]
          .some(f => (f || '').toLowerCase().includes(q))
        if (!hit) return false
      }
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      if (advFilters.venue    && b.venue    !== advFilters.venue)    return false
      if (advFilters.industry && b.industry !== advFilters.industry) return false
      if (advFilters.dateFrom && new Date(b.eventDate) < new Date(advFilters.dateFrom)) return false
      if (advFilters.dateTo   && new Date(b.eventDate) > new Date(advFilters.dateTo))   return false
      if (advFilters.status   && b.status !== advFilters.status.toLowerCase())           return false
      return true
    })
  }, [allBookings, search, statusFilter, advFilters])

  const counts = useMemo(() => ({
    all:       allBookings.length,
    confirmed: allBookings.filter(b => b.status === 'confirmed').length,
    tentative: allBookings.filter(b => b.status === 'tentative').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
  }), [allBookings])

  const clearAdvanced  = () => setAdvFilters({ venue: '', industry: '', dateFrom: '', dateTo: '', status: '' })
  const hasAdvFilters  = Object.values(advFilters).some(v => v !== '')

  return (
    <div className="min-h-screen bg-navy-950 pb-32">
      <ScrollProgressBar />

      {/* ── Booking Detail Modal ── */}
      {detailBooking && (
        <BookingDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
          onWithdraw={(id) => {
            handleWithdraw(id)
            setDetailBooking(null)
          }}
        />
      )}

      {/* ── Withdraw Confirm ── */}
      {withdrawConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(5,8,20,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div className="glass rounded-3xl border border-red-500/20 p-8 max-w-sm w-full text-center animate-slide-up">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h3 className="font-display text-2xl text-cream mb-2">Withdraw Booking?</h3>
            <p className="text-cream/60 text-sm mb-8">
              Booking <span className="font-mono text-red-300">{withdrawConfirm}</span> will be marked as cancelled. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setWithdrawConfirm(null)}
                className="flex-1 btn-outline py-3 rounded-2xl text-sm font-bold">
                Keep It
              </button>
              <button onClick={() => handleWithdraw(withdrawConfirm)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all">
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
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
              { label: 'Total Bookings',  value: counts.all,       color: 'text-cream' },
              { label: 'Confirmed',       value: counts.confirmed,  color: 'text-emerald-400' },
              { label: 'Awaiting Review', value: counts.tentative,  color: 'text-amber-400' },
              { label: 'Completed',       value: counts.completed,  color: 'text-blue-400' },
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
              placeholder="Search by event name, organizer, venue, company…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-4 bg-navy-950/60 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-5 py-4 rounded-2xl text-sm font-sans tracking-widest uppercase border transition-all ${
                showAdvanced || hasAdvFilters ? 'bg-gold-500/10 border-gold-400 text-gold-400' : 'glass border-white/10 text-cream/80 hover:text-cream'
              }`}
            >
              <Filter size={14} />
              Filters
              {hasAdvFilters && (
                <span className="w-5 h-5 rounded-full bg-gold-400 text-navy-950 text-[11px] font-bold flex items-center justify-center">
                  {Object.values(advFilters).filter(v => v).length}
                </span>
              )}
            </button>
            <div className="flex glass rounded-2xl border border-white/10 overflow-hidden">
              <button onClick={() => setViewMode('list')}
                className={`px-4 py-2 flex items-center gap-1.5 text-sm transition-all ${viewMode === 'list' ? 'bg-gold-500/15 text-gold-400' : 'text-cream/60 hover:text-cream'}`}>
                <LayoutGrid size={14} />
              </button>
              <button onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 flex items-center gap-1.5 text-sm transition-all border-l border-white/10 ${viewMode === 'calendar' ? 'bg-gold-500/15 text-gold-400' : 'text-cream/60 hover:text-cream'}`}>
                <CalendarDays size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
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
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase flex items-center gap-1"><Building2 size={10} />Venue</label>
                <select value={advFilters.venue} onChange={e => setAdv('venue', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none">
                  <option value="">All Venues</option>
                  {venues.map(v => <option key={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase flex items-center gap-1"><Tag size={10} />Industry</label>
                <select value={advFilters.industry} onChange={e => setAdv('industry', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none">
                  <option value="">All Industries</option>
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase">Status</label>
                <select value={advFilters.status} onChange={e => setAdv('status', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none">
                  <option value="">All Statuses</option>
                  {['confirmed', 'tentative', 'cancelled', 'completed'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-cream/70 text-[11px] tracking-widest uppercase flex items-center gap-1"><Calendar size={10} />Date From</label>
                <input type="date" value={advFilters.dateFrom} onChange={e => setAdv('dateFrom', e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-950/50 border border-gold-500/10 rounded-xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
              </div>
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
              { key: 'all',       label: 'All Bookings',  count: counts.all },
              { key: 'confirmed', label: 'Confirmed',     count: counts.confirmed },
              { key: 'tentative', label: 'Tentative',     count: counts.tentative },
              { key: 'completed', label: 'Completed',     count: counts.completed },
            ].map(({ key, label, count }) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`px-5 py-2.5 rounded-full text-[12px] font-bold tracking-widest uppercase transition-all whitespace-nowrap border ${
                  statusFilter === key
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
            <CalendarView bookings={filtered} onViewDetail={setDetailBooking} />
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
                    <button onClick={() => { setSearch(''); clearAdvanced() }} className="btn-outline px-8 py-3 rounded-full text-sm">
                      Clear All Filters
                    </button>
                  ) : (
                    <Link to="/venues" className="btn-gold px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-3">
                      <Compass size={16} /> Browse Venues <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map((b, idx) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    idx={idx}
                    onViewDetail={setDetailBooking}
                    onWithdraw={(id) => setWithdrawConfirm(id)}
                  />
                ))}
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
                Tentative bookings are held for <span className="text-amber-400 font-bold">48 hours</span> pending verification.
                For priority processing, contact our concierge at{' '}
                <span className="text-gold-400 font-bold">+91 120 696 6555</span>.
              </p>
            </div>
            <button className="btn-outline px-8 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase shrink-0 whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
