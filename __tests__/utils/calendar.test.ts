import {
  generateBlockedPeriods,
  generateDisabledDates,
  generateDateRange,
  calculateDaysBetween,
  defaultSelected,
} from '@/utils/calendar'
import { Booking } from '@/utils/types'

describe('calendar utilities', () => {
  describe('defaultSelected', () => {
    it('should have undefined from and to dates', () => {
      expect(defaultSelected.from).toBeUndefined()
      expect(defaultSelected.to).toBeUndefined()
    })
  })

  describe('calculateDaysBetween', () => {
    it('should calculate 1 day difference', () => {
      const checkIn = new Date('2024-01-01')
      const checkOut = new Date('2024-01-02')

      const result = calculateDaysBetween({ checkIn, checkOut })

      expect(result).toBe(1)
    })

    it('should calculate 3 days difference', () => {
      const checkIn = new Date('2024-01-01')
      const checkOut = new Date('2024-01-04')

      const result = calculateDaysBetween({ checkIn, checkOut })

      expect(result).toBe(3)
    })

    it('should calculate 7 days difference', () => {
      const checkIn = new Date('2024-01-01')
      const checkOut = new Date('2024-01-08')

      const result = calculateDaysBetween({ checkIn, checkOut })

      expect(result).toBe(7)
    })

    it('should handle same day (0 days)', () => {
      const checkIn = new Date('2024-01-01')
      const checkOut = new Date('2024-01-01')

      const result = calculateDaysBetween({ checkIn, checkOut })

      expect(result).toBe(0)
    })
  })

  describe('generateBlockedPeriods', () => {
    it('should generate blocked periods for past dates and bookings', () => {
      const today = new Date('2024-01-15')
      const bookings: Booking[] = [
        {
          checkIn: new Date('2024-01-20'),
          checkOut: new Date('2024-01-25'),
        },
        {
          checkIn: new Date('2024-01-30'),
          checkOut: new Date('2024-02-02'),
        },
      ]

      const result = generateBlockedPeriods({ bookings, today })

      expect(result).toHaveLength(3) // 2 bookings + 1 past period

      // Check that past dates are blocked
      const pastPeriod = result.find(
        (period) => period.from.getTime() === new Date(0).getTime()
      )
      expect(pastPeriod).toBeDefined()
      expect(pastPeriod?.to.getTime()).toBeLessThan(today.getTime())

      // Check that booking periods are included
      const bookingPeriods = result.filter(
        (period) => period.from.getTime() !== new Date(0).getTime()
      )
      expect(bookingPeriods).toHaveLength(2)
    })

    it('should handle empty bookings array', () => {
      const today = new Date('2024-01-15')
      const bookings: Booking[] = []

      const result = generateBlockedPeriods({ bookings, today })

      expect(result).toHaveLength(1) // Only past period
    })
  })

  describe('generateDisabledDates', () => {
    it('should generate disabled dates from blocked periods', () => {
      // Use future dates since the function only includes today or future dates
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)

      const blockedPeriods = [
        {
          from: new Date(futureDate.getTime() + 24 * 60 * 60 * 1000), // +1 day
          to: new Date(futureDate.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
        },
        {
          from: new Date(futureDate.getTime() + 10 * 24 * 60 * 60 * 1000), // +10 days
          to: new Date(futureDate.getTime() + 12 * 24 * 60 * 60 * 1000), // +12 days
        },
      ]

      const result = generateDisabledDates(blockedPeriods)

      // Check that dates in blocked periods are disabled
      const date1 = new Date(futureDate.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      const date2 = new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      const date3 = new Date(futureDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      expect(result[date1]).toBe(true)
      expect(result[date2]).toBe(true)
      expect(result[date3]).toBe(true)

      // Check that dates outside blocked periods are not disabled
      const outsideDate = new Date(
        futureDate.getTime() + 5 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0]
      expect(result[outsideDate]).toBeUndefined()
    })

    it('should handle empty blocked periods', () => {
      const result = generateDisabledDates([])
      expect(Object.keys(result)).toHaveLength(0)
    })
  })

  describe('generateDateRange', () => {
    it('should generate date range from DateRange object', () => {
      const range = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-03'),
      }

      const result = generateDateRange(range)

      expect(result).toHaveLength(3)
      expect(result[0]).toBe('2024-01-01')
      expect(result[1]).toBe('2024-01-02')
      expect(result[2]).toBe('2024-01-03')
    })

    it('should handle single day range', () => {
      const range = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-01'),
      }

      const result = generateDateRange(range)

      expect(result).toHaveLength(1)
      expect(result[0]).toBe('2024-01-01')
    })

    it('should handle undefined range', () => {
      const result = generateDateRange(undefined)
      expect(result).toHaveLength(0)
    })

    it('should handle range with only from date', () => {
      const range = {
        from: new Date('2024-01-01'),
        to: undefined,
      }

      const result = generateDateRange(range)
      expect(result).toHaveLength(0)
    })
  })
})
