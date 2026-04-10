import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-gold-500/10 mt-24">
      <div className="orb w-96 h-96 bg-teal-800/20 -top-20 left-1/2 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-sm bg-gold-gradient flex items-center justify-center">
                <span className="text-navy-900 font-display font-bold text-lg">E</span>
              </div>
              <span className="font-display text-xl text-cream">ExpoInn</span>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed mb-5">
              India's premier integrated venue booking platform for events, exhibitions, and corporate gatherings.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 glass-light rounded flex items-center justify-center text-gold-500/60 hover:text-gold-400 transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold-400 text-xs tracking-[0.2em] uppercase mb-5 font-sans">Navigate</h4>
            <ul className="space-y-2.5">
              {['Home', 'Venues', 'Book Now', 'My Bookings'].map(item => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-cream/50 text-sm hover:text-gold-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Venue Types */}
          <div>
            <h4 className="text-gold-400 text-xs tracking-[0.2em] uppercase mb-5 font-sans">Venues</h4>
            <ul className="space-y-2.5">
              {['Convention Centre', 'Ballroom', 'Boardrooms', 'Exhibition Hall', 'Outdoor Venues'].map(item => (
                <li key={item}>
                  <Link to="/venues" className="text-cream/50 text-sm hover:text-gold-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold-400 text-xs tracking-[0.2em] uppercase mb-5 font-sans">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-cream/50 text-sm">
                <MapPin size={14} className="text-gold-500 mt-0.5 shrink-0" />
                India Exposition Mart, Gate 11, Knowledge Park II, Greater Noida
              </li>
              <li className="flex gap-3 text-cream/50 text-sm">
                <Phone size={14} className="text-gold-500 mt-0.5 shrink-0" />
                +91 120 696 6555
              </li>
              <li className="flex gap-3 text-cream/50 text-sm">
                <Mail size={14} className="text-gold-500 mt-0.5 shrink-0" />
                bookings@expoinn.com
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-cream/30 text-xs">
          <span>© 2024 ExpoInn Suites & Convention. All Rights Reserved.</span>
          <span>A unit of India Exposition Mart Limited</span>
        </div>
      </div>
    </footer>
  )
}
