import { calculateTotals } from '@/utils/calculateTotals'
import { Card, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useProperty } from '@/utils/store'
import { formatCurrency } from '@/utils/format'
function BookingForm() {
  const { range, price } = useProperty((state) => state)
  const checkIn = range?.from
  const checkOut = range?.to

  const { totalNights, subTotal, cleaning, service, tax, orderTotal } =
    calculateTotals({
      checkIn,
      checkOut,
      price,
    })

  // Show different content based on whether dates are selected
  if (!checkIn || !checkOut) {
    return (
      <Card className="p-8 mb-4">
        <CardTitle className="mb-4">Booking Summary</CardTitle>
        <p className="text-muted-foreground">
          Please select your dates to see pricing
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 mb-4">
      <CardTitle className="mb-8">Summary </CardTitle>
      <FormRow
        label={`$${price} x ${totalNights} night${
          totalNights !== 1 ? 's' : ''
        }`}
        amount={subTotal}
      />
      <FormRow label="Cleaning Fee" amount={cleaning} />
      <FormRow label="Service Fee" amount={service} />
      <FormRow label="Tax" amount={tax} />
      <Separator className="mt-4" />
      <CardTitle className="mt-8">
        <FormRow label="Booking Total" amount={orderTotal} />
      </CardTitle>
    </Card>
  )
}

function FormRow({ label, amount }: { label: string; amount: number }) {
  return (
    <p className="flex justify-between text-sm mb-2">
      <span>{label}</span>
      <span>{formatCurrency(amount)}</span>
    </p>
  )
}

export default BookingForm
