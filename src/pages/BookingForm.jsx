import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  CheckCircle, ChevronRight, AlertCircle, Calendar, Users, 
  Building2, FileText, ChevronLeft, ArrowRight, Shield, Award, Sparkles
} from 'lucide-react'
import { venues, eventTypes, sectors } from '../data/staticData'
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

const steps = [
  { id: 1, label: 'Selection', icon: Building2, desc: 'Choose Space' },
  { id: 2, label: 'Engagement', icon: Calendar, desc: 'Event Scope' },
  { id: 3, label: 'Identity', icon: Users, desc: 'Contact Info' },
  { id: 4, label: 'Accord', icon: FileText, desc: 'Agreement' },
]

export default function BookingForm() {
  useScrollReveal()
  const [searchParams] = useSearchParams()
  const preselectedVenueId = searchParams.get('venue')
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [bookingId] = useState(`BK-2024-${String(Math.floor(Math.random() * 900) + 100)}`)

  const [form, setForm] = useState({
    venueId: preselectedVenueId || '',
    eventType: '',
    sector: '',
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
  const selectedVenue = venues.find(v => v.id === parseInt(form.venueId))

  const canNext = () => {
    if (step === 1) return !!form.venueId
    if (step === 2) return form.eventType && form.eventDate && form.expectedGuests
    if (step === 3) return form.organizerName && form.email && form.phone
    return true
  }

  const handleSubmit = () => setSubmitted(true)

  if (submitted) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6 bg-navy-950">
      <div className="max-w-2xl w-full text-center">
        <div className="glass rounded-[40px] p-12 md:p-16 border border-gold-500/20 gold-glow relative overflow-hidden">
          <div className="orb w-64 h-64 bg-gold-500/10 -top-20 -right-20" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-gold-500/10 border-2 border-gold-400 flex items-center justify-center mx-auto mb-10 animate-pulse-gold">
              <CheckCircle size={48} className="text-gold-400" />
            </div>
            
            <div className="gold-shimmer font-display text-5xl font-bold mb-4 tracking-tight">Booking Accord Initiated</div>
            <p className="text-cream/50 text-xl max-w-lg mx-auto mb-12">
              Your request for <span className="text-cream font-medium">{selectedVenue?.name}</span> has been securely transmitted.
            </p>
            
            <div className="glass-light rounded-3xl p-8 mb-10 text-left border border-white/05">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <div className="text-gold-500/40 text-[10px] tracking-widest uppercase mb-1">Confirmation ID</div>
                  <div className="text-gold-400 font-mono text-lg font-bold">{bookingId}</div>
                </div>
                <div>
                  <div className="text-gold-500/40 text-[10px] tracking-widest uppercase mb-1">Date Segment</div>
                  <div className="text-cream font-medium">{form.eventDate}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gold-500/40 text-[10px] tracking-widest uppercase mb-1">Status Protocol</div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20 uppercase tracking-widest">
                    <Sparkles size={10} /> Pending Executive Review
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/my-bookings" className="btn-gold flex-1 py-4 rounded-2xl text-sm font-bold">
                Access Portfolio
              </Link>
              <Link to="/venues" className="btn-outline flex-1 py-4 rounded-2xl text-sm font-bold">
                Discovery New Spaces
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

      {/* Header Segment */}
      <div className="max-w-5xl mx-auto px-6 mb-16 text-center" data-reveal="fade">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10 bg-gold-500/50" />
          <span className="text-gold-400 text-[10px] tracking-[0.4em] uppercase font-sans font-medium">Concierge Service</span>
          <div className="h-px w-10 bg-gold-500/50" />
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-cream mb-6 leading-tight">
          Initiate Your <em className="animated-gradient-text not-italic">Event Protocol</em>
        </h1>
        <p className="text-cream/40 text-lg max-w-2xl mx-auto">Complete the form below to request a private booking of our premier facilities.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Stepper Navigation */}
          <div className="lg:col-span-3 space-y-2 sticky top-28" data-reveal="left">
            {steps.map((s, idx) => {
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
                    {done ? <CheckCircle size={18} className="text-navy-950" /> : <s.icon size={18} className={active ? 'text-gold-400' : 'text-cream/50'} />}
                  </div>
                  <div>
                    <div className={`text-[10px] tracking-widest uppercase ${active ? 'text-gold-400' : 'text-cream/40'}`}>{s.label}</div>
                    <div className={`text-xs font-semibold ${active ? 'text-cream' : 'text-cream/20'}`}>{s.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Active Form Step */}
          <div className="lg:col-span-9" data-reveal="fade" data-delay="1">
            <div className="glass rounded-[40px] p-8 md:p-12 border border-gold-500/10 shadow-3xl min-h-[500px] flex flex-col justify-between">
              
              <div className="animate-slide-up">
                {/* Step 1: Venue Selection */}
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Select Your Environment</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {venues.map(v => (
                        <button 
                          key={v.id} 
                          onClick={() => set('venueId', String(v.id))}
                          className={`text-left rounded-3xl overflow-hidden border-2 transition-all duration-500 group relative ${
                            form.venueId === String(v.id)
                              ? 'border-gold-400 gold-glow'
                              : 'border-white/05 bg-white/05 hover:border-gold-500/30'
                          }`}
                        >
                          <div className="relative h-44 overflow-hidden">
                            <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                            {form.venueId === String(v.id) && (
                              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg">
                                <CheckCircle size={18} className="text-navy-950" />
                              </div>
                            )}
                            <div className="absolute bottom-4 left-5">
                              <div className="text-cream text-lg font-display mb-1">{v.name}</div>
                              <div className="text-gold-400/80 text-[10px] tracking-widest uppercase">{v.type}</div>
                            </div>
                          </div>
                          <div className="p-4 flex items-center justify-between bg-navy-950/40">
                             <div className="flex items-center gap-3">
                               <div className="text-cream/40 text-[10px] tracking-widest uppercase">Capacity</div>
                               <div className="text-cream/80 text-xs font-bold">{v.capacity.toLocaleString()}</div>
                             </div>
                             <div className="text-gold-400 font-display font-bold text-lg">₹{(v.price/1000).toFixed(0)}K</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Event Details */}
                {step === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Technical Directives</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                      <div className="md:col-span-2 glass-light rounded-3xl p-6 mb-4 flex items-center gap-6 border border-white/05">
                        <img src={selectedVenue?.image} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                        <div>
                          <div className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase mb-1">Target Space</div>
                          <div className="font-display text-2xl text-cream">{selectedVenue?.name}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Engagement Type *</label>
                        <select value={form.eventType} onChange={e => set('eventType', e.target.value)}
                          className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none cursor-pointer">
                          <option value="">Select Protocol</option>
                          {eventTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Primary Date *</label>
                        <input type="date" value={form.eventDate} onChange={e => set('eventDate', e.target.value)}
                          className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all shadow-inner" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Total Presence *</label>
                        <input type="number" placeholder={`Max ${selectedVenue?.capacity || 2000}`}
                          value={form.expectedGuests} onChange={e => set('expectedGuests', e.target.value)}
                          className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Temporal Window</label>
                        <select value={form.timeSlot} onChange={e => set('timeSlot', e.target.value)}
                          className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all appearance-none cursor-pointer">
                          <option value="">Select Slot</option>
                          {(selectedVenue?.availableSlots || ['Full Day', 'Evening Only']).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Executive Summary</label>
                        <textarea rows={4} placeholder="Describe the vision and requirements of your event..."
                          value={form.eventDescription} onChange={e => set('eventDescription', e.target.value)}
                          className="w-full px-6 py-5 bg-navy-950/50 border border-gold-500/10 rounded-3xl text-sm text-cream outline-none focus:border-gold-400 transition-all resize-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Identity & Contact */}
                {step === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Principal Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Full Legal Name *</label>
                        <input type="text" placeholder="Principal Organizer" value={form.organizerName}
                          onChange={e => set('organizerName', e.target.value)} className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Corporate Institution</label>
                        <input type="text" placeholder="Establishment Name" value={form.company}
                          onChange={e => set('company', e.target.value)} className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Secure Email *</label>
                        <input type="email" placeholder="official@domain.com" value={form.email}
                          onChange={e => set('email', e.target.value)} className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Direct Contact *</label>
                        <input type="tel" placeholder="+91 Protocol" value={form.phone}
                          onChange={e => set('phone', e.target.value)} className="w-full px-6 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-gold-500/50 text-[10px] tracking-[0.3em] uppercase ml-2">Prerogative Demands</label>
                        <textarea rows={4} placeholder="Security, technical, or gastronomic requirements..."
                          value={form.specialRequirements} onChange={e => set('specialRequirements', e.target.value)}
                          className="w-full px-6 py-5 bg-navy-950/50 border border-gold-500/10 rounded-3xl text-sm text-cream outline-none focus:border-gold-400 transition-all resize-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Final Accord (Review) */}
                {step === 4 && (
                  <div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-px w-8 bg-gold-400" />
                      <h2 className="font-display text-3xl text-cream tracking-tight">Booking Accord</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="glass-light rounded-3xl p-8 border border-gold-500/20 shadow-xl">
                        <div className="flex flex-col md:flex-row gap-10">
                          <div className="md:w-1/3">
                            <img src={selectedVenue?.image} alt="" className="w-full h-48 rounded-2xl object-cover border border-white/05 shadow-2xl" />
                          </div>
                          <div className="flex-1 space-y-6">
                            <div>
                              <div className="text-gold-400 text-[10px] tracking-[0.3em] uppercase mb-1">Subject Environment</div>
                              <div className="font-display text-4xl text-cream">{selectedVenue?.name}</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {[
                                { k: 'Directive Type', v: form.eventType },
                                { k: 'Temporal Point', v: form.eventDate },
                                { k: 'Expected Presence', v: form.expectedGuests },
                                { k: 'Executive Contact', v: form.organizerName },
                              ].map((item, idx) => (
                                <div key={idx}>
                                  <div className="text-cream/30 text-[9px] tracking-widest uppercase mb-1">{item.k}</div>
                                  <div className="text-cream text-sm font-medium">{item.v}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="glass-light rounded-2xl p-6 border border-white/05 flex items-center justify-between">
                            <div className="text-cream/40 text-xs tracking-widest uppercase">Administrative Fee</div>
                            <div className="text-cream text-sm font-bold">Waived</div>
                         </div>
                         <div className="glass-light rounded-2xl p-6 border border-gold-500/10 flex items-center justify-between">
                            <div className="text-gold-400 text-xs tracking-widest uppercase">Estimated Value</div>
                            <div className="animated-gradient-text text-2xl font-display font-bold">₹{selectedVenue ? (selectedVenue.price / 1000).toFixed(0) + 'K' : '—'}</div>
                         </div>
                      </div>

                      <div className="flex items-start gap-4 p-5 glass-light rounded-2xl border border-white/05">
                        <Shield size={18} className="text-gold-500 mt-0.5 shrink-0" />
                        <p className="text-cream/40 text-xs leading-relaxed">
                          By submitting this protocol, you acknowledge that the booking is subject to verified availability and formal confirmation by our executive team within standard operational hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Segment */}
              <div className="flex justify-between items-center mt-12 pt-10 border-t border-gold-500/10 relative">
                {step > 1 ? (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 text-cream/30 hover:text-gold-400 transition-all text-sm font-medium tracking-widest uppercase group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retract Step
                  </button>
                ) : <div />}

                <div className="flex gap-4">
                  {step < 4 ? (
                    <button 
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canNext()}
                      className={`btn-gold px-10 py-4 rounded-full text-xs font-bold flex items-center gap-3 tracking-[0.2em] shadow-lg shadow-gold-500/10 ${!canNext() ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95 transition-transform'}`}>
                      PROCEED <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      className="btn-gold px-12 py-4 rounded-full text-sm font-bold flex items-center gap-3 tracking-[0.2em] shadow-2xl shadow-gold-500/20 hover:scale-105 active:scale-95 transition-transform">
                      RATIFY BOOKING <Award size={18} />
                    </button>
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
