import { calculateTotals } from '@/utils/calculateTotals'

describe('calculateTotals', () => {
  it('should calculate totals correctly for a 3-night stay', () => {
    const checkIn = new Date('2024-01-01')
    const checkOut = new Date('2024-01-04')
    const price = 100

    const result = calculateTotals({ checkIn, checkOut, price })

    expect(result.totalNights).toBe(3)
    expect(result.subTotal).toBe(300) // 3 nights * $100
    expect(result.cleaning).toBe(21)
    expect(result.service).toBe(40)
    expect(result.tax).toBe(30) // 10% of $300
    expect(result.orderTotal).toBe(391) // 300 + 21 + 40 + 30
  })

  it('should calculate totals correctly for a 1-night stay', () => {
    const checkIn = new Date('2024-01-01')
    const checkOut = new Date('2024-01-02')
    const price = 150

    const result = calculateTotals({ checkIn, checkOut, price })

    expect(result.totalNights).toBe(1)
    expect(result.subTotal).toBe(150)
    expect(result.cleaning).toBe(21)
    expect(result.service).toBe(40)
    expect(result.tax).toBe(15) // 10% of $150
    expect(result.orderTotal).toBe(226) // 150 + 21 + 40 + 15
  })

  it('should calculate totals correctly for a 7-night stay', () => {
    const checkIn = new Date('2024-01-01')
    const checkOut = new Date('2024-01-08')
    const price = 200

    const result = calculateTotals({ checkIn, checkOut, price })

    expect(result.totalNights).toBe(7)
    expect(result.subTotal).toBe(1400) // 7 nights * $200
    expect(result.cleaning).toBe(21)
    expect(result.service).toBe(40)
    expect(result.tax).toBe(140) // 10% of $1400
    expect(result.orderTotal).toBe(1601) // 1400 + 21 + 40 + 140
  })

  it('should handle zero price correctly', () => {
    const checkIn = new Date('2024-01-01')
    const checkOut = new Date('2024-01-02')
    const price = 0

    const result = calculateTotals({ checkIn, checkOut, price })

    expect(result.totalNights).toBe(1)
    expect(result.subTotal).toBe(0)
    expect(result.cleaning).toBe(21)
    expect(result.service).toBe(40)
    expect(result.tax).toBe(0) // 10% of $0
    expect(result.orderTotal).toBe(61) // 0 + 21 + 40 + 0
  })

  it('should handle undefined dates', () => {
    const checkIn = undefined
    const checkOut = undefined
    const price = 100

    const result = calculateTotals({ checkIn, checkOut, price })

    expect(result.totalNights).toBe(0)
    expect(result.subTotal).toBe(0)
    expect(result.cleaning).toBe(21)
    expect(result.service).toBe(40)
    expect(result.tax).toBe(0)
    expect(result.orderTotal).toBe(61) // 21 + 40
  })

  it('should handle partial undefined dates', () => {
    const checkIn = new Date('2024-01-01')
    const checkOut = undefined
    const price = 100

    const result = calculateTotals({ checkIn, checkOut, price })

    expect(result.totalNights).toBe(0)
    expect(result.subTotal).toBe(0)
    expect(result.cleaning).toBe(21)
    expect(result.service).toBe(40)
    expect(result.tax).toBe(0)
    expect(result.orderTotal).toBe(61) // 21 + 40
  })

  it('should handle decimal prices correctly', () => {
    const checkIn = new Date('2024-01-01')
    const checkOut = new Date('2024-01-03')
    const price = 99.99

    const result = calculateTotals({ checkIn, checkOut, price })

    expect(result.totalNights).toBe(2)
    expect(result.subTotal).toBe(199.98) // 2 nights * $99.99
    expect(result.cleaning).toBe(21)
    expect(result.service).toBe(40)
    expect(result.tax).toBe(19.998) // 10% of $199.98
    expect(result.orderTotal).toBe(280.978) // 199.98 + 21 + 40 + 19.998
  })
})
