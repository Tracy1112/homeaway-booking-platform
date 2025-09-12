import { render, screen } from '@testing-library/react'
import BookingForm from '@/components/booking/BookingForm'
import { useProperty } from '@/utils/store'

// Mock the store
jest.mock('@/utils/store', () => ({
  useProperty: jest.fn(),
}))

const mockUseProperty = useProperty as jest.MockedFunction<typeof useProperty>

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ className }: { className?: string }) => (
    <hr data-testid="separator" className={className} />
  ),
}))

describe('BookingForm', () => {
  beforeEach(() => {
    mockUseProperty.mockReturnValue({
      range: {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-04'),
      },
      price: 100,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render booking summary with correct title', () => {
    render(<BookingForm />)

    expect(screen.getByText('Summary')).toBeInTheDocument()
  })

  it('should display correct price calculation for 3 nights', () => {
    render(<BookingForm />)

    expect(screen.getByText('$100 x 3 nights')).toBeInTheDocument()
    expect(screen.getByText('$300')).toBeInTheDocument() // subtotal
  })

  it('should display all fee breakdowns', () => {
    render(<BookingForm />)

    expect(screen.getByText('Cleaning Fee')).toBeInTheDocument()
    expect(screen.getByText('$21')).toBeInTheDocument()
    expect(screen.getByText('Service Fee')).toBeInTheDocument()
    expect(screen.getByText('$40')).toBeInTheDocument()
    expect(screen.getByText('Tax')).toBeInTheDocument()
    expect(screen.getByText('$30')).toBeInTheDocument() // 10% of $300
  })

  it('should display total booking amount', () => {
    render(<BookingForm />)

    expect(screen.getByText('Booking Total')).toBeInTheDocument()
    expect(screen.getByText('$391')).toBeInTheDocument() // 300 + 21 + 40 + 30
  })

  it('should handle different price ranges', () => {
    mockUseProperty.mockReturnValue({
      range: {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-02'),
      },
      price: 200,
    })

    render(<BookingForm />)

    expect(screen.getByText('$200 x 1 night')).toBeInTheDocument()
    expect(screen.getByText('$200')).toBeInTheDocument() // subtotal
    expect(screen.getByText('$20')).toBeInTheDocument() // tax (10% of $200)
    expect(screen.getByText('$281')).toBeInTheDocument() // total (200 + 21 + 40 + 20)
  })

  it('should handle zero price', () => {
    mockUseProperty.mockReturnValue({
      range: {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-02'),
      },
      price: 0,
    })

    render(<BookingForm />)

    expect(screen.getByText('$0 x 1 night')).toBeInTheDocument()
    expect(screen.getAllByText('$0')).toHaveLength(2) // subtotal and tax
    expect(screen.getByText('$61')).toBeInTheDocument() // total (0 + 21 + 40 + 0)
  })

  it('should handle undefined range gracefully', () => {
    mockUseProperty.mockReturnValue({
      range: undefined,
      price: 100,
    })

    render(<BookingForm />)

    // Should show the message for selecting dates
    expect(screen.getByText('Booking Summary')).toBeInTheDocument()
    expect(
      screen.getByText('Please select your dates to see pricing')
    ).toBeInTheDocument()
  })
})
