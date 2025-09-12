import { calculateDaysBetween } from '@/utils/calendar'

type BookingDetails = {
  checkIn: Date | undefined
  checkOut: Date | undefined
  price: number
}

export const calculateTotals = ({
  checkIn,
  checkOut,
  price,
}: BookingDetails) => {
  // Return default values if dates are not provided
  if (!checkIn || !checkOut) {
    return {
      totalNights: 0,
      subTotal: 0,
      cleaning: 21,
      service: 40,
      tax: 0,
      orderTotal: 61, // 21 + 40
    }
  }

  const totalNights = calculateDaysBetween({ checkIn, checkOut })
  const subTotal = totalNights * price
  const cleaning = 21
  const service = 40
  const tax = subTotal * 0.1
  const orderTotal = subTotal + cleaning + service + tax
  return { totalNights, subTotal, cleaning, service, tax, orderTotal }
}
