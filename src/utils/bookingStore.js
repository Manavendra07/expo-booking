/**
 * bookingStore.js
 * Central utility for reading / writing bookings from sessionStorage.
 * All pages must go through this module so that data is always consistent.
 */
import { bookingRequests, venues } from '../data/staticData'

const STORAGE_KEY = 'expoinn_bookings'

/* ─── Read ──────────────────────────────────────────────────────────────── */

/** Returns ALL bookings = static seed + user-submitted */
export function getBookings() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
    return [...bookingRequests, ...stored].reverse()
  } catch {
    return [...bookingRequests].reverse()
  }
}

/** Returns only the user-submitted bookings (from sessionStorage) */
export function getUserBookings() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

/* ─── Write ─────────────────────────────────────────────────────────────── */

/** Appends a new booking to sessionStorage */
export function saveBooking(booking) {
  const existing = getUserBookings()
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, booking]))
}

/** Cancel/withdraw a booking by ID */
export function withdrawBooking(id) {
  const all = getBookings()
  const updated = all
    .filter(b => b.id !== id || bookingRequests.some(s => s.id === id)) // keep static ones
    .map(b => (b.id === id ? { ...b, status: 'cancelled', eventStatus: 'Cancelled' } : b))

  // Persist only the user portion
  const userPortion = getUserBookings().map(b =>
    b.id === id ? { ...b, status: 'cancelled', eventStatus: 'Cancelled' } : b
  )
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userPortion))
  return updated
}

/** Confirm a tentative booking by ID */
export function formalizeBooking(id) {
  const all = getBookings()
  const updated = all.map(b => (b.id === id ? { ...b, status: 'confirmed' } : b))

  // Persist only the user portion
  const userPortion = getUserBookings().map(b =>
    b.id === id ? { ...b, status: 'confirmed' } : b
  )
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userPortion))
  return updated
}

/* ─── Conflict / Availability Helpers ──────────────────────────────────── */

/**
 * Returns true if `[startDate, endDate]` overlaps with any existing booking
 * for the given venue + optional hall (non-cancelled bookings only).
 */
export function isSlotBooked(venueId, hall, startDate, endDate) {
  const venue = venues.find(v => v.id === parseInt(venueId))
  if (!venue) return false

  const bookings = getBookings()
  const start = new Date(startDate)
  const end   = endDate ? new Date(endDate) : new Date(startDate)

  for (const b of bookings) {
    if (b.status === 'cancelled') continue
    if (b.venue !== venue.name) continue
    if (hall && b.hall && b.hall !== hall) continue

    const bStart = new Date(b.setupDate || b.eventDate)
    const bEnd   = new Date(b.dismantleDate || b.eventDate)

    if (start <= bEnd && end >= bStart) return true
  }
  return false
}

/**
 * Returns an array of conflicting bookings for the given slot.
 */
export function getConflicts(venueId, hall, startDate, endDate) {
  const venue = venues.find(v => v.id === parseInt(venueId))
  if (!venue) return []

  const bookings = getBookings()
  const start = new Date(startDate)
  const end   = endDate ? new Date(endDate) : new Date(startDate)

  return bookings.filter(b => {
    if (b.status === 'cancelled') return false
    if (b.venue !== venue.name) return false
    if (hall && b.hall && b.hall !== hall) return false

    const bStart = new Date(b.setupDate || b.eventDate)
    const bEnd   = new Date(b.dismantleDate || b.eventDate)
    return start <= bEnd && end >= bStart
  })
}

/**
 * For a given venue, returns a map of `{ day: 'confirmed' | 'tentative' }` 
 * for all bookings whose eventDate falls in `year/month`.
 */
export function getBookedDaysForVenue(venueId, year, month) {
  const venue = venues.find(v => v.id === parseInt(venueId))
  if (!venue) return {}

  const bookings = getBookings()
  const map = {}

  bookings.forEach(b => {
    if (b.status === 'cancelled') return
    if (b.venue !== venue.name) return

    // Mark every day in the setup→dismantle range that falls in this month
    const setup    = new Date(b.setupDate || b.eventDate)
    const dismantle = new Date(b.dismantleDate || b.eventDate)

    let cursor = new Date(setup)
    while (cursor <= dismantle) {
      if (cursor.getFullYear() === year && cursor.getMonth() === month) {
        const d = cursor.getDate()
        // confirmed takes priority over tentative
        if (!map[d] || map[d] === 'tentative') {
          map[d] = b.status === 'confirmed' ? 'confirmed' : 'tentative'
        }
        // store the full booking info for tooltip use
        if (!map[`_b_${d}`]) map[`_b_${d}`] = b
      }
      cursor.setDate(cursor.getDate() + 1)
    }
  })

  return map
}

/**
 * Returns which halls of a venue are booked for the given date (event date).
 * Returns: { hallName: booking }
 */
export function getBookedHallsForDate(venueId, date) {
  const venue = venues.find(v => v.id === parseInt(venueId))
  if (!venue || !date) return {}

  const bookings = getBookings()
  const check = new Date(date)
  const result = {}

  bookings.forEach(b => {
    if (b.status === 'cancelled') return
    if (b.venue !== venue.name) return

    const bStart = new Date(b.setupDate || b.eventDate)
    const bEnd   = new Date(b.dismantleDate || b.eventDate)

    if (check >= bStart && check <= bEnd) {
      result[b.hall] = b
    }
  })

  return result
}
