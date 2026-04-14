import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Users, Maximize, Star, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react'

export default function VenueCard({ venue, delay = 1 }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`
    el.style.boxShadow = `${-x * 30}px ${y * 20}px 50px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.15)`

    // Light effect
    const light = el.querySelector('.card-light')
    if (light) {
      light.style.opacity = '1'
      light.style.transform = `translate(${x * 100}%, ${y * 100}%)`
    }
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)'
    el.style.boxShadow = ''
    const light = el.querySelector('.card-light')
    if (light) light.style.opacity = '0'
  }

  const formatPrice = (price) => `₹${(price / 1000).toFixed(0)}K`

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative group transition-all duration-200 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="glass rounded-[32px] overflow-hidden border border-white/05 bg-navy-900/40 relative h-full">
        {/* Shine/Light Effect */}
        <div className="card-light absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 pointer-events-none transition-opacity duration-500 blur-3xl z-10" />

        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

          {/* Rating Prompt */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-white/10 z-20">
            <Star size={12} className="text-gold-400 fill-gold-400" />
            <span className="text-gold-400 text-sm font-sans font-bold">{venue.rating}</span>
          </div>

          {/* Pricing Overlay */}
          <div className="absolute bottom-5 right-5 glass rounded-2xl px-4 py-2 text-right z-20 border border-white/05 shadow-2xl">
            <div className="text-gold-400 font-display text-2xl font-bold">{formatPrice(venue.price)}</div>
            <div className="text-cream/60 text-[9px] tracking-widest uppercase font-medium">per day segment</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-gold-400/40" />
            <span className="text-gold-500 text-[12px] tracking-[0.3em] uppercase font-sans font-medium">{venue.type}</span>
          </div>

          <h3 className="font-display text-2xl text-cream mb-2 leading-tight group-hover:text-gold-400 transition-colors duration-500">{venue.name}</h3>

          <div className="flex items-center gap-2 text-cream/80 text-[12px] mb-6 font-sans">
            <MapPin size={12} className="text-gold-500/80" />
            <span>{venue.location}</span>
          </div>

          {/* Luxury Stats Bar */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-light rounded-2xl p-3 border border-white/05">
              <div className="flex items-center gap-2 text-gold-500/80 text-[12px] tracking-widest uppercase mb-1.5">
                <Users size={14} /> Capacity
              </div>
              <div className="text-cream text-base font-bold">{venue.capacity.toLocaleString()} guests</div>
            </div>
            <div className="glass-light rounded-2xl p-3 border border-white/05">
              <div className="flex items-center gap-2 text-gold-500/80 text-[12px] tracking-widest uppercase mb-1.5">
                <Maximize size={14} /> Dimensions
              </div>
              <div className="text-cream text-base font-bold">{venue.area}</div>
            </div>
          </div>

          {/* Primary Action */}
          <div className="flex items-center gap-3">
            <Link
              to={`/venues/${venue.slug}`}
              className="flex-1 btn-gold py-4 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-gold-500/10"
            >
              Examine Space <ArrowUpRight size={14} />
            </Link>
            <Link
              to={`/book?venue=${venue.id}`}
              className="w-14 h-14 glass flex items-center justify-center rounded-2xl text-cream/60 hover:text-gold-400 hover:border-gold-500/30 transition-all duration-300"
              title="Quick Booking Accord"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

