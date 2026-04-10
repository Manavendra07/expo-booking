import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, Calendar, BarChart2, Bot } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/venues', label: 'Venues' },
    { to: '/book', label: 'Book Now' },
    { to: '/my-bookings', label: 'My Bookings' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3 shadow-[0_4px_40px_rgba(0,0,0,0.5)]' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center shadow-lg">
              <span className="text-navy-900 font-display font-bold text-lg">E</span>
            </div>
            <div className="absolute inset-0 rounded-lg bg-gold-gradient opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-300" />
          </div>
          <div>
            <span className="font-display text-2xl text-cream tracking-wide">ExpoInn</span>
            <span className="block text-gold-500 text-[10px] tracking-[0.25em] uppercase font-sans font-light leading-none">
              Smart Booking Engine
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-sans font-medium tracking-wide transition-all duration-200 relative group flex items-center gap-1.5 ${
                location.pathname === link.to ? 'text-gold-400' : 'text-cream/60 hover:text-cream'
              }`}
            >
              {link.icon && <link.icon size={11} className="opacity-70" />}
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-gold-400 transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
          <Link
            to="/book"
            className="btn-gold px-5 py-2.5 rounded-lg text-base flex items-center gap-1.5 ml-2"
          >
            Request Booking <ChevronRight size={13} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-cream p-2 glass rounded-lg border border-gold-500/20"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-gold-500/10 mt-1 animate-slide-up">
          <div className="px-6 py-5 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-sans py-1 flex items-center gap-2 ${
                  location.pathname === link.to ? 'text-gold-400' : 'text-cream/60'
                }`}
              >
                {link.icon && <link.icon size={13} />}
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="btn-gold px-5 py-3 rounded-lg text-xs text-center mt-2"
            >
              Request Booking
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
