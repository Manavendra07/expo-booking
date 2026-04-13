import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  CheckCircle, ChevronRight, AlertCircle, Calendar, Users,
  Building2, FileText, ChevronLeft, Award, Sparkles, Shield,
  MapPin, Tag, Layers, Clock, AlertTriangle, X
} from 'lucide-react'
import { venues, eventTypes, industries, sectors, eventStatuses, availabilityTypes } from '../data/staticData'
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

const steps = [
  { id: 1, label: 'Venue & Hall', icon: Building2, desc: 'Choose Space' },
  { id: 2, label: 'Event Scope', icon: Calendar, desc: 'Dates & Details' },
  { id: 3, label: 'Classification', icon: Tag, desc: 'Industry & Sectors' },
  { id: 4, label: 'Organizer', icon: Users, desc: 'Contact Info' },
  { id: 5, label: 'Review', icon: FileText, desc: 'Confirm & Submit' },
]

/* Helper: check for date conflicts with existing bookings */
function detectConflict(form, existingBookings) {
  if (!form.venueId || !form.eventDate) return null
  const selectedVenue = venues.find(v => v.id === parseInt(form.venueId))
  if (!selectedVenue) return null

  for (const b of existingBookings) {
    if (b.venue !== selectedVenue.name) continue
    if (form.hallSelection && b.hall && b.hall !== form.hallSelection) continue
    if (b.availability === 'Booked' || b.eventStatus === 'Confirmed') {
      const bSetup = new Date(b.setupDate)
      const bDismantle = new Date(b.dismantleDate)
      const fSetup = form.setupDate ? new Date(form.setupDate) : new Date(form.eventDate)
      const fDismantle = form.dismantleDate ? new Date(form.dismantleDate) : new Date(form.eventDate)
      if (fSetup <= bDismantle && fDismantle >= bSetup) {
        return { conflictWith: b.id, venue: b.venue, hall: b.hall, dates: `${b.setupDate} → ${b.dismantleDate}` }
      }
    }
  }
  return null
}

/* Get existing bookings from sessionStorage */
function getStoredBookings() {
  try {
    const stored = JSON.parse(sessionStorage.getItem('expoinn_bookings') || '[]')
    return stored
  } catch {
    return []
  }
}

export default function BookingForm() {
  useScrollReveal()
  const [searchParams] = useSearchParams()
  const preselectedVenueId = searchParams.get('venue')
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'tentative' | 'confirmed'
  const [conflict, setConflict] = useState(null)
  const [bookingId] = useState(`BK-2026-${String(Math.floor(Math.random() * 900) + 100)}`)

  const [form, setForm] = useState({
    venueId: preselectedVenueId || '',
    hallSelection: '',
    eventType: '',
    eventStatus: 'Tentative',
    availability: 'Required',
    industry: '',
    sectors: [],
    setupDate: '',
    eventDate: '',
    dismantleDate: '',
    timeSlot: '',
    expectedGuests: '',
    eventDescription: '',
    organizerName: '',
    company: '',
    email: '',
    phone: '',
    specialRequirements: '',
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const toggleSector = (sector) => {
    setForm(f => ({
      ...f,
      sectors: f.sectors.includes(sector)
        ? f.sectors.filter(s => s !== sector)
        : [...f.sectors, sector]
    }))
  }

  const selectedVenue = venues.find(v => v.id === parseInt(form.venueId))

  // Re-check conflict whenever dates/venue/hall changes
  useEffect(() => {
    if (form.venueId && form.eventDate) {
      const stored = getStoredBookings()
      const c = detectConflict(form, stored)
      setConflict(c)
    } else {
      setConflict(null)
    }
  }, [form.venueId, form.hallSelection, form.setupDate, form.eventDate, form.dismantleDate])

  const canNext = () => {
    if (step === 1) return !!(form.venueId && form.hallSelection)
    if (step === 2) return !!(form.eventType && form.eventDate && form.expectedGuests && !conflict)
    if (step === 3) return !!(form.industry && form.sectors.length > 0)
    if (step === 4) return !!(form.organizerName && form.email && form.phone)
    return true
  }

  const handleSubmit = (status) => {
    // Save to sessionStorage
    const stored = getStoredBookings()
    const newBooking = {
      id: bookingId,
      venue: selectedVenue?.name,
      hall: form.hallSelection,
      eventType: form.eventType,
      organizer: form.organizerName,
      company: form.company,
      industry: form.industry,
      sector: form.sectors,
      setupDate: form.setupDate || form.eventDate,
      eventDate: form.eventDate,
      dismantleDate: form.dismantleDate || form.eventDate,
      status: status === 'confirmed' ? 'confirmed' : 'tentative',
      eventStatus: status === 'confirmed' ? 'Confirmed' : 'Tentative',
      availability: status === 'confirmed' ? 'Booked' : 'Required',
      guests: parseInt(form.expectedGuests) || 0,
      amount: selectedVenue?.price || 0,
      timeSlot: form.timeSlot,
      email: form.email,
      phone: form.phone,
    }
    sessionStorage.setItem('expoinn_bookings', JSON.stringify([...stored, newBooking]))
    setSubmitStatus(status)
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6 bg-navy-950">
      <div className="max-w-2xl w-full text-center">
        <div className="glass rounded-[40px] p-12 md:p-16 border border-gold-500/20 gold-glow relative overflow-hidden">
          <div className="orb w-64 h-64 bg-gold-500/10 -top-20 -right-20" />
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-gold-500/10 border-2 border-gold-400 flex items-center justify-center mx-auto mb-10 animate-pulse-gold">
              <CheckCircle size={48} className="text-gold-400" />
            </div>
            <div className="gold-shimmer font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Booking Initiated</div>
            <p className="text-cream/90 text-lg max-w-lg mx-auto mb-12">
              Your request for <span className="text-cream font-semibold">{selectedVenue?.name}</span> has been securely submitted.
            </p>
            <div className="glass-light rounded-3xl p-8 mb-10 text-left border border-white/05">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <div className="text-gold-400/60 text-sm tracking-widest uppercase mb-1">Booking ID</div>
                  <div className="text-gold-400 font-mono text-lg font-bold">{bookingId}</div>
                </div>
                <div>
                  <div className="text-gold-400/60 text-sm tracking-widest uppercase mb-1">Event Date</div>
                  <div className="text-cream font-semibold">{form.eventDate}</div>
                </div>
                <div>
                  <div className="text-gold-400/60 text-sm tracking-widest uppercase mb-1">Hall</div>
                  <div className="text-cream font-semibold">{form.hallSelection}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gold-400/60 text-sm tracking-widest uppercase mb-1">Status</div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-widest ${
                    submitStatus === 'confirmed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    <Sparkles size={11} /> {submitStatus === 'confirmed' ? 'Confirmed' : 'Tentative – Pending Review'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/my-bookings" className="btn-gold flex-1 py-4 rounded-2xl text-base font-bold">
                View My Bookings
              </Link>
              <Link to="/venues" className="btn-outline flex-1 py-4 rounded-2xl text-base font-bold">
                Explore More Venues
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-32">
      <ScrollProgressBar />

      {/* Header */}
      <div className="section-container mb-16 text-center" data-reveal="fade">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10 bg-gold-500/50" />
          <span className="text-gold-400 text-sm tracking-[0.4em] uppercase font-sans font-medium">Smart Booking Engine</span>
          <div className="h-px w-10 bg-gold-500/50" />
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-cream mb-6 leading-tight">
          Initiate Your <em className="animated-gradient-text not-italic">Booking Request</em>
        </h1>
        <p className="text-cream/80 text-lg max-w-2xl mx-auto">Complete the form below to request a private booking of our premier facilities.</p>
      </div>

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left: Stepper Navigation */}
          <div className="lg:col-span-3 space-y-2 sticky top-28" data-reveal="left">
            {steps.map((s) => {
              const active = step === s.id
              const done = step > s.id
              return (
                <div key={s.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border ${
                  active ? 'glass border-gold-500/30 gold-glow' : 'border-transparent opacity-40'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                    done ? 'bg-gold-gradient border-gold-400' :
                    active ? 'bg-gold-500/10 border-gold-400' :
                    'bg-white/05 border-white/10'
                  }`}>
                    {done ? <CheckCircle size={18} className="text-navy-950" /> : <s.icon size={18} className={active ? 'text-gold-400' : 'text-cream/80'} />}
                  </div>
                  <div>
                    <div className={`text-sm tracking-widest uppercase ${active ? 'text-gold-400' : 'text-cream/70'}`}>{s.label}</div>
                    <div className={`text-sm font-semibold ${active ? 'text-cream' : 'text-cream/50'}`}>{s.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Active Form Step */}
          <div className="lg:col-span-9" data-reveal="fade" data-delay="1">
            <div className="glass rounded-[40px] p-8 md:p-12 border border-gold-500/10 shadow-3xl min-h-[500px] flex flex-col justify-between">
              <div className="animate-slide-up">

                {/* ── STEP 1: Venue & Hall Selection ── */}
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Select Venue & Hall</h2>
                    </div>

                    {/* Venue cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      {venues.map(v => (
                        <button
                          key={v.id}
                          onClick={() => { set('venueId', String(v.id)); set('hallSelection', '') }}
                          className={`text-left rounded-3xl overflow-hidden border-2 transition-all duration-500 group relative ${
                            form.venueId === String(v.id)
                              ? 'border-gold-400 gold-glow'
                              : 'border-white/05 bg-white/05 hover:border-gold-500/30'
                          }`}
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                            {form.venueId === String(v.id) && (
                              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg">
                                <CheckCircle size={18} className="text-navy-950" />
                              </div>
                            )}
                            <div className="absolute bottom-4 left-5">
                              <div className="text-cream text-base font-display mb-0.5">{v.name}</div>
                              <div className="text-gold-400/80 text-sm tracking-widest uppercase">{v.type}</div>
                            </div>
                          </div>
                          <div className="p-4 flex items-center justify-between bg-navy-950/40">
                            <div className="flex items-center gap-3">
                              <div className="text-gold-400/60 text-sm tracking-widest uppercase">Capacity</div>
                              <div className="text-cream/90 text-base font-bold">{v.capacity.toLocaleString()}</div>
                            </div>
                            <div className="text-gold-400 font-display font-bold text-base">₹{(v.price/1000).toFixed(0)}K</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Hall selection — only shows when a venue is selected */}
                    {selectedVenue && (
                      <div className="space-y-3">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2 flex items-center gap-2">
                          <Layers size={13} /> Hall Selection *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedVenue.halls.map(hall => (
                            <button
                              key={hall}
                              onClick={() => set('hallSelection', hall)}
                              className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                                form.hallSelection === hall
                                  ? 'border-gold-400 bg-gold-500/10 gold-glow'
                                  : 'border-white/05 bg-white/05 hover:border-gold-500/30 hover:bg-white/08'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                form.hallSelection === hall ? 'border-gold-400 bg-gold-400' : 'border-white/20'
                              }`}>
                                {form.hallSelection === hall && <CheckCircle size={12} className="text-navy-950" />}
                              </div>
                              <span className={`text-base font-medium ${form.hallSelection === hall ? 'text-gold-400' : 'text-cream/90'}`}>
                                {hall}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 2: Event Dates & Details ── */}
                {step === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Event Dates & Details</h2>
                    </div>

                    {/* Venue Summary */}
                    <div className="glass-light rounded-3xl p-5 mb-8 flex items-center gap-5 border border-white/05">
                      <img src={selectedVenue?.image} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                      <div>
                        <div className="text-gold-400/60 text-sm tracking-[0.3em] uppercase mb-1">Selected Venue & Hall</div>
                        <div className="font-display text-xl text-cream">{selectedVenue?.name}</div>
                        <div className="text-gold-400/80 text-sm mt-1 flex items-center gap-1.5">
                          <Layers size={11} />{form.hallSelection}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">

                      {/* Event Type */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Event Type *</label>
                        <select value={form.eventType} onChange={e => set('eventType', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all appearance-none cursor-pointer">
                          <option value="">Select Event Type</option>
                          {eventTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>

                      {/* Expected Guests */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Expected Guests *</label>
                        <input type="number" placeholder={`Max ${selectedVenue?.capacity || 2000}`}
                          value={form.expectedGuests} onChange={e => set('expectedGuests', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>

                      {/* Setup Date */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2 flex items-center gap-1.5">
                          <Clock size={11} /> Setup Date (Start–End)
                        </label>
                        <input type="date" value={form.setupDate} onChange={e => set('setupDate', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>

                      {/* Event Date */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2 flex items-center gap-1.5">
                          <Calendar size={11} /> Event Date *
                        </label>
                        <input type="date" value={form.eventDate} onChange={e => set('eventDate', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>

                      {/* Dismantle Date */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2 flex items-center gap-1.5">
                          <Clock size={11} /> Dismantle Date
                        </label>
                        <input type="date" value={form.dismantleDate} onChange={e => set('dismantleDate', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>

                      {/* Time Slot */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Time Slot</label>
                        <select value={form.timeSlot} onChange={e => set('timeSlot', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all appearance-none cursor-pointer">
                          <option value="">Select Slot</option>
                          {(selectedVenue?.availableSlots || ['Full Day', 'Evening Only']).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Event Status */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Event Status</label>
                        <select value={form.eventStatus} onChange={e => set('eventStatus', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all appearance-none cursor-pointer">
                          {eventStatuses.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Availability */}
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Availability</label>
                        <select value={form.availability} onChange={e => set('availability', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all appearance-none cursor-pointer">
                          <option>Booked</option>
                          <option>Required</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Event Description</label>
                        <textarea rows={3} placeholder="Describe the vision and requirements of your event..."
                          value={form.eventDescription} onChange={e => set('eventDescription', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-3xl text-base text-cream outline-none focus:border-gold-400 transition-all resize-none" />
                      </div>
                    </div>

                    {/* Conflict Alert */}
                    {conflict && (
                      <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-500/08">
                        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-red-400 text-base font-bold mb-1">Date Conflict Detected</div>
                          <div className="text-cream/90 text-sm">
                            Booking <span className="text-red-300 font-mono font-bold">{conflict.conflictWith}</span> already occupies{' '}
                            <span className="text-cream/90">{conflict.venue} – {conflict.hall}</span> for dates{' '}
                            <span className="text-cream/90">{conflict.dates}</span>. Please adjust your dates or choose a different hall.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date validation hint */}
                    {form.setupDate && form.eventDate && new Date(form.setupDate) > new Date(form.eventDate) && (
                      <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/08">
                        <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-amber-400 text-sm">Setup Date must be ≤ Event Date.</div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 3: Industry & Sector Classification ── */}
                {step === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Industry & Sector</h2>
                    </div>

                    <div className="space-y-8">
                      {/* Industry */}
                      <div className="space-y-3">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2 flex items-center gap-2">
                          <Building2 size={13} /> Industry *
                        </label>
                        <select value={form.industry} onChange={e => set('industry', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all appearance-none cursor-pointer">
                          <option value="">Select Industry</option>
                          {industries.map(i => <option key={i}>{i}</option>)}
                        </select>
                      </div>

                      {/* Sectors - multi select */}
                      <div className="space-y-3">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2 flex items-center gap-2">
                          <Tag size={13} /> Sectors (Multi-select) *
                        </label>
                        <p className="text-cream/70 text-sm ml-2">Select all relevant sectors for this event</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {sectors.map(sector => {
                            const selected = form.sectors.includes(sector)
                            return (
                              <button key={sector} onClick={() => toggleSector(sector)}
                                className={`p-3 rounded-xl border-2 text-left text-base transition-all duration-300 flex items-center gap-2 ${
                                  selected
                                    ? 'border-gold-400 bg-gold-500/10 text-gold-400'
                                    : 'border-white/05 bg-white/05 text-cream/90 hover:border-gold-500/30 hover:text-cream'
                                }`}>
                                <div className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center ${
                                  selected ? 'border-gold-400 bg-gold-400' : 'border-white/20'
                                }`}>
                                  {selected && <CheckCircle size={11} className="text-navy-950" />}
                                </div>
                                <span className="font-medium text-sm leading-tight">{sector}</span>
                              </button>
                            )
                          })}
                        </div>
                        {form.sectors.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {form.sectors.map(s => (
                              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium">
                                {s}
                                <button onClick={() => toggleSector(s)} className="hover:text-red-400 transition-colors">
                                  <X size={10} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Organizer Identity ── */}
                {step === 4 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Organizer Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Full Name *</label>
                        <input type="text" placeholder="Principal Organizer" value={form.organizerName}
                          onChange={e => set('organizerName', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Company / Organization</label>
                        <input type="text" placeholder="Establishment Name" value={form.company}
                          onChange={e => set('company', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Email Address *</label>
                        <input type="email" placeholder="official@domain.com" value={form.email}
                          onChange={e => set('email', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Phone Number *</label>
                        <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
                          onChange={e => set('phone', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-2xl text-base text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-gold-400/70 text-sm tracking-[0.3em] uppercase ml-2">Special Requirements</label>
                        <textarea rows={3} placeholder="Security, technical, or catering requirements..."
                          value={form.specialRequirements} onChange={e => set('specialRequirements', e.target.value)}
                          className="w-full px-5 py-4 bg-navy-950/50 border border-gold-500/15 rounded-3xl text-base text-cream outline-none focus:border-gold-400 transition-all resize-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 5: Review & Submit ── */}
                {step === 5 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Review & Confirm</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Venue + Hall */}
                      <div className="glass-light rounded-3xl p-7 border border-gold-500/20 shadow-xl">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-1/3 shrink-0">
                            <img src={selectedVenue?.image} alt="" className="w-full h-44 rounded-2xl object-cover border border-white/05 shadow-2xl" />
                          </div>
                          <div className="flex-1 space-y-5">
                            <div>
                              <div className="text-gold-400/60 text-sm tracking-[0.3em] uppercase mb-1">Venue</div>
                              <div className="font-display text-3xl text-cream">{selectedVenue?.name}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {[
                                { k: 'Hall', v: form.hallSelection },
                                { k: 'Event Type', v: form.eventType },
                                { k: 'Event Date', v: form.eventDate },
                                { k: 'Setup Date', v: form.setupDate || '—' },
                                { k: 'Dismantle Date', v: form.dismantleDate || '—' },
                                { k: 'Guests', v: form.expectedGuests },
                                { k: 'Industry', v: form.industry },
                                { k: 'Organizer', v: form.organizerName },
                              ].map((item, idx) => (
                                <div key={idx}>
                                  <div className="text-cream/70 text-sm tracking-widest uppercase mb-1">{item.k}</div>
                                  <div className="text-cream text-base font-semibold">{item.v}</div>
                                </div>
                              ))}
                              <div className="col-span-2">
                                <div className="text-cream/70 text-sm tracking-widest uppercase mb-2">Sectors</div>
                                <div className="flex flex-wrap gap-2">
                                  {form.sectors.map(s => (
                                    <span key={s} className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price + Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="glass-light rounded-2xl p-6 border border-white/05 flex items-center justify-between">
                          <div className="text-gold-400/70 text-base tracking-widest uppercase">Estimated Value</div>
                          <div className="animated-gradient-text text-2xl font-display font-bold">
                            ₹{selectedVenue ? (selectedVenue.price / 1000).toFixed(0) + 'K' : '—'}
                          </div>
                        </div>
                        <div className="glass-light rounded-2xl p-6 border border-white/05 flex items-center justify-between">
                          <div className="text-gold-400/70 text-base tracking-widest uppercase">Current Status</div>
                          <div className="text-amber-400 text-base font-bold">{form.eventStatus}</div>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="flex items-start gap-4 p-5 glass-light rounded-2xl border border-white/05">
                        <Shield size={18} className="text-gold-500 mt-0.5 shrink-0" />
                        <p className="text-cream/80 text-base leading-relaxed">
                          By submitting, you acknowledge that the booking is subject to verified availability. Tentative bookings are held for 48 hours pending formal confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gold-500/10">
                {step > 1 ? (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 text-cream/70 hover:text-gold-400 transition-all text-base font-medium tracking-widest uppercase group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                  </button>
                ) : <div />}

                <div className="flex gap-4">
                  {step < 5 ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canNext()}
                      className={`btn-gold px-10 py-4 rounded-full text-sm font-bold flex items-center gap-3 tracking-[0.2em] shadow-lg shadow-gold-500/10 ${!canNext() ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95 transition-transform'}`}>
                      PROCEED <ChevronRight size={16} />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSubmit('tentative')}
                        className="btn-outline px-8 py-4 rounded-full text-sm font-bold flex items-center gap-3 tracking-[0.2em] hover:scale-105 active:scale-95 transition-transform">
                        <AlertCircle size={16} /> SAVE TENTATIVE
                      </button>
                      <button
                        onClick={() => handleSubmit('confirmed')}
                        className="btn-gold px-10 py-4 rounded-full text-sm font-bold flex items-center gap-3 tracking-[0.2em] shadow-2xl shadow-gold-500/20 hover:scale-105 active:scale-95 transition-transform">
                        CONFIRM BOOKING <Award size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
