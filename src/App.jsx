import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Venues from './pages/Venues'
import VenueDetail from './pages/VenueDetail'
import BookingForm from './pages/BookingForm'
import MyBookings from './pages/MyBookings'
import SmartDashboard from './components/dashboard/SmartDashboard'
import DashboardDemo from './pages/DashboardDemo'
import './styles/dashboard.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <>
      <ScrollToTop />
      {!isDashboard && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:slug" element={<VenueDetail />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/dashboard-demo" element={<DashboardDemo />} />
          <Route path="/dashboard" element={<SmartDashboard />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </>
  )
}
