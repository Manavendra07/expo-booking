import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Users, Maximize, Star, MapPin, CheckCircle, ArrowRight, 
  ChevronLeft, Calendar, Shield, Share2, Heart, Info, Clock, ArrowUpRight
} from 'lucide-react'
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

export default function VenueDetail() {
  useScrollReveal()
  const { slug } = useParams()
  const venue = venues.find(v => v.slug === slug)
  const [activeImg, setActiveImg] = useState(0)
  const allImages = venue ? [venue.image, ...venue.gallery] : []

  if (!venue) return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-navy-950">
      <div className="text-center">
        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info size={32} className="text-gold-400/40" />
        </div>
        <h2 className="font-display text-4xl text-cream mb-4">Venue not found</h2>
        <Link to="/venues" className="btn-gold px-8 py-3 rounded-full text-xs">Back to Portfoilo</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-950 pb-20">
      <ScrollProgressBar />

      {/* Cinematic Hero */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Main Background with Curtain Reveal */}
        <div className="absolute inset-0 z-0" data-reveal="img-slide">
          <img 
            src={allImages[activeImg]} 
            alt={venue.name} 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Link to="/venues" className="inline-flex items-center gap-2 text-gold-400/60 hover:text-gold-400 transition-all text-xs tracking-widest uppercase mb-8" data-reveal="fade">
              <ChevronLeft size={16} /> Portfolio
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div data-reveal="up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold-400 text-[10px] tracking-[0.4em] uppercase font-sans font-medium px-3 py-1 glass rounded-full border border-gold-500/20">
                    {venue.type}
                  </span>
                  <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1 border border-white/05">
                    <Star size={12} className="text-gold-400 fill-gold-400" />
                    <span className="text-cream/80 text-[11px] font-bold">{venue.rating}</span>
                    <span className="text-cream/30 text-[10px]">({venue.reviews} Reviews)</span>
                  </div>
                </div>
                <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight mb-4">
                  {venue.name}
                </h1>
                <div className="flex items-center gap-2 text-gold-500/60 text-sm">
                  <MapPin size={16} />
                  <span className="tracking-wide">{venue.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3" data-reveal="fade" data-delay="2">
                <button className="w-12 h-12 rounded-full glass flex items-center justify-center text-cream/40 hover:text-gold-400 transition-all border border-white/05">
                  <Heart size={20} />
                </button>
                <button className="w-12 h-12 rounded-full glass flex items-center justify-center text-cream/40 hover:text-gold-400 transition-all border border-white/05">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Details & Gallery */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar" data-reveal="fade">
                {allImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      i === activeImg ? 'border-gold-400 scale-105 shadow-xl shadow-gold-500/10' : 'border-transparent grayscale hover:grayscale-0 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Overview */}
            <div data-reveal="up">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-gold-400" />
                <h2 className="text-gold-400 text-xs tracking-[0.4em] uppercase font-sans font-medium">The Experience</h2>
              </div>
              <p className="text-cream/60 text-xl leading-relaxed italic font-display">
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
                  <div className="text-cream/20 text-[10px] tracking-[0.2em] uppercase mb-4">{item.label}</div>
                  <div className="section-line mb-4 opacity-20" />
                  <div className="text-gold-500/40 text-[9px] tracking-widest uppercase">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Amenities Grid */}
            <div data-reveal="up">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-8 bg-gold-400" />
                <h2 className="text-gold-400 text-xs tracking-[0.4em] uppercase font-sans font-medium">Curated Amenities</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 glass-light rounded-2xl px-6 py-5 border border-white/05 hover:bg-white/05 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-gold-400" />
                    </div>
                    <span className="text-cream/70 text-sm font-medium">{a}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Concierge Booking Widget */}
          <div className="lg:col-span-4" data-reveal="fade" data-delay="3">
            <div className="sticky top-28 glass rounded-[32px] p-8 border border-gold-500/20 gold-glow overflow-hidden">
              <div className="orb w-48 h-48 bg-gold-500/05 -top-10 -right-10" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-gold-400/50 text-[10px] tracking-widest uppercase mb-1">Elite Booking Rate</span>
                    <div className="flex items-baseline gap-2">
                      <span className="animated-gradient-text font-display text-5xl font-bold">₹{(venue.price / 1000).toFixed(0)}K</span>
                      <span className="text-cream/40 text-sm">{venue.priceUnit}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-gold-500/20">
                    <ArrowUpRight size={24} className="text-navy-950" />
                  </div>
                </div>

                <div className="section-line mb-8 opacity-20" />

                <div className="space-y-6 mb-10">
                  <div className="group">
                    <label className="text-gold-500/70 text-[10px] tracking-[0.3em] uppercase mb-2.5 block px-1">Engagement Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" />
                      <input type="date" className="w-full pl-12 pr-4 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="text-gold-500/70 text-[10px] tracking-[0.3em] uppercase mb-2.5 block px-1">Presence Size</label>
                    <div className="relative">
                      <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" />
                      <input type="number" placeholder={`Select up to ${venue.capacity}`} className="w-full pl-12 pr-4 py-4 bg-navy-950/50 border border-gold-500/10 rounded-2xl text-sm text-cream outline-none focus:border-gold-400 transition-all" />
                    </div>
                  </div>
                </div>

                <Link to={`/book?venue=${venue.id}`} className="btn-gold w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold shadow-xl shadow-gold-500/10 transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Initiate Booking <ArrowRight size={18} />
                </Link>

                <div className="mt-8 pt-8 border-t border-gold-500/10 space-y-4">
                  {[
                    { text: 'Best Price Guaranteed', icon: Shield },
                    { text: 'Concierge Event Manager', icon: ArrowUpRight },
                    { text: 'Priority Processing', icon: Clock }
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-cream/40 text-xs">
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

      {/* Suggested Curations */}
      <div className="max-w-7xl mx-auto px-6 py-32" data-reveal="up">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-gold-400" />
              <h2 className="text-gold-400 text-xs tracking-[0.4em] uppercase font-sans font-medium">The Collection</h2>
            </div>
            <h3 className="font-display text-4xl text-cream">Similar Statement Venues</h3>
          </div>
          <Link to="/venues" className="btn-outline px-8 py-3 rounded-full text-xs hidden md:flex">
            View All Venues
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {venues.filter(v => v.id !== venue.id).slice(0, 3).map((v, i) => (
            <Link key={v.id} to={`/venues/${v.slug}`} className="glass rounded-[32px] overflow-hidden group border border-white/05 hover:border-gold-500/20 transition-all duration-500">
              <div className="h-48 overflow-hidden relative">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent opacity-60" />
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 border border-white/10">
                  <span className="text-gold-400 font-bold text-xs">₹{(v.price/1000).toFixed(0)}K</span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-gold-500/50 text-[10px] tracking-[0.2em] uppercase mb-2 font-sans">{v.type}</div>
                <div className="font-display text-2xl text-cream group-hover:text-gold-400 transition-colors">{v.name}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cream/30 text-xs">
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

