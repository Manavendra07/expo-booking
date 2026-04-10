import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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
  const { pathname } = useLocation()

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="relative">
        <div 
          key={pathname} 
          className="animate-slide-up"
          style={{ animationDuration: '0.4s' }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:slug" element={<VenueDetail />} />
            <Route path="/book" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  )
}
