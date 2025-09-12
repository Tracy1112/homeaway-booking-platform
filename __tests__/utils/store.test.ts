import { renderHook, act } from '@testing-library/react'
import { useProperty } from '@/utils/store'
import { Booking } from '@/utils/types'

describe('useProperty store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useProperty.setState({
      propertyId: '',
      price: 0,
      bookings: [],
      range: undefined,
    })
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useProperty())

    expect(result.current.propertyId).toBe('')
    expect(result.current.price).toBe(0)
    expect(result.current.bookings).toEqual([])
    expect(result.current.range).toBeUndefined()
  })

  it('should update propertyId', () => {
    const { result } = renderHook(() => useProperty())

    act(() => {
      useProperty.setState({ propertyId: 'property-123' })
    })

    expect(result.current.propertyId).toBe('property-123')
  })

  it('should update price', () => {
    const { result } = renderHook(() => useProperty())

    act(() => {
      useProperty.setState({ price: 150 })
    })

    expect(result.current.price).toBe(150)
  })

  it('should update bookings', () => {
    const { result } = renderHook(() => useProperty())
    const mockBookings: Booking[] = [
      {
        checkIn: new Date('2024-01-01'),
        checkOut: new Date('2024-01-04'),
      },
      {
        checkIn: new Date('2024-01-10'),
        checkOut: new Date('2024-01-15'),
      },
    ]

    act(() => {
      useProperty.setState({ bookings: mockBookings })
    })

    expect(result.current.bookings).toEqual(mockBookings)
    expect(result.current.bookings).toHaveLength(2)
  })

  it('should update date range', () => {
    const { result } = renderHook(() => useProperty())
    const mockRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-04'),
    }

    act(() => {
      useProperty.setState({ range: mockRange })
    })

    expect(result.current.range).toEqual(mockRange)
  })

  it('should update multiple properties at once', () => {
    const { result } = renderHook(() => useProperty())
    const mockBookings: Booking[] = [
      {
        checkIn: new Date('2024-01-01'),
        checkOut: new Date('2024-01-04'),
      },
    ]
    const mockRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-04'),
    }

    act(() => {
      useProperty.setState({
        propertyId: 'property-456',
        price: 200,
        bookings: mockBookings,
        range: mockRange,
      })
    })

    expect(result.current.propertyId).toBe('property-456')
    expect(result.current.price).toBe(200)
    expect(result.current.bookings).toEqual(mockBookings)
    expect(result.current.range).toEqual(mockRange)
  })

  it('should handle partial updates', () => {
    const { result } = renderHook(() => useProperty())

    // Set initial state
    act(() => {
      useProperty.setState({
        propertyId: 'property-123',
        price: 100,
        bookings: [],
        range: undefined,
      })
    })

    // Update only price
    act(() => {
      useProperty.setState({ price: 150 })
    })

    expect(result.current.propertyId).toBe('property-123') // Should remain unchanged
    expect(result.current.price).toBe(150) // Should be updated
    expect(result.current.bookings).toEqual([]) // Should remain unchanged
    expect(result.current.range).toBeUndefined() // Should remain unchanged
  })

  it('should handle selector function', () => {
    const { result } = renderHook(() => useProperty((state) => state.price))

    act(() => {
      useProperty.setState({ price: 250 })
    })

    expect(result.current).toBe(250)
  })

  it('should handle complex selector', () => {
    const { result } = renderHook(() =>
      useProperty((state) => ({
        totalBookings: state.bookings.length,
        hasRange: !!state.range,
      }))
    )

    const mockBookings: Booking[] = [
      {
        checkIn: new Date('2024-01-01'),
        checkOut: new Date('2024-01-04'),
      },
    ]
    const mockRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-04'),
    }

    act(() => {
      useProperty.setState({
        bookings: mockBookings,
        range: mockRange,
      })
    })

    expect(result.current.totalBookings).toBe(1)
    expect(result.current.hasRange).toBe(true)
  })
})

