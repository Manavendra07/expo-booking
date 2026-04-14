import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Venues from './pages/Venues'
import VenueDetail from './pages/VenueDetail'
import BookingForm from './pages/BookingForm'
import MyBookings from './pages/MyBookings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      
      {/* Premium Notification Toaster */}
      <Toaster 
        theme="dark" 
        position="bottom-right"
        toastOptions={{
          className: 'glass !bg-[#070d1a]/90 !border-gold-500/20 !text-cream',
          style: { backdropFilter: 'blur(12px)' }
        }}
      />
      
      <Navbar />
      <main className="relative min-h-screen">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:slug" element={<VenueDetail />} />
            <Route path="/book" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
