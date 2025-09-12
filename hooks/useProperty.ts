import { useProperty as usePropertyStore } from '@/utils/store'
import type { Booking, DateRange } from '@/types'

export const useProperty = () => {
  const store = usePropertyStore()

  const setProperty = (propertyId: string, price: number) => {
    store.setProperty(propertyId, price)
  }

  const setBookings = (bookings: Booking[]) => {
    store.setBookings(bookings)
  }

  const setRange = (range: DateRange | undefined) => {
    store.setRange(range)
  }

  const reset = () => {
    store.reset()
  }

  const hasValidRange = (): boolean => {
    return !!(store.range?.from && store.range?.to)
  }

  const getTotalNights = (): number => {
    if (!hasValidRange()) return 0

    const checkIn = store.range!.from!
    const checkOut = store.range!.to!

    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  return {
    // State
    propertyId: store.propertyId,
    price: store.price,
    bookings: store.bookings,
    range: store.range,

    // Actions
    setProperty,
    setBookings,
    setRange,
    reset,

    // Computed values
    hasValidRange: hasValidRange(),
    totalNights: getTotalNights(),
  }
}

