import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import SafeImage from '@/components/ui/safe-image'

// Mock next/image to a simple img element and capture props
const mockNextImage = jest.fn(
  ({ src, alt, ...props }: any) => (
    // Use a test id so we can distinguish Next.js Image from native img
    <img data-testid="next-image" src={src} alt={alt} {...props} />
  )
)

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => mockNextImage(props),
}))

describe('SafeImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders Next.js Image with correct src and alt', () => {
    render(
      <SafeImage
        src="/images/test.jpg"
        alt="Test Image"
        width={100}
        height={100}
        className="rounded"
      />
    )

    const img = screen.getByTestId('next-image') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.src).toContain('/images/test.jpg')
    expect(img.alt).toBe('Test Image')
  })

  it('uses unoptimized mode for Supabase URLs to avoid 400 errors', () => {
    const supabaseUrl =
      'https://ziiabtjfoefytlefvpir.supabase.co/storage/v1/object/public/home-away-draft/test.jpg'

    render(
      <SafeImage
        src={supabaseUrl}
        alt="Supabase Image"
        width={100}
        height={100}
      />
    )

    expect(mockNextImage).toHaveBeenCalled()
    const props = mockNextImage.mock.calls[0][0]
    expect(props.unoptimized).toBe(true)
  })

  it('falls back to native img when Next.js Image fails to load', () => {
    render(
      <SafeImage
        src="/images/fail.jpg"
        alt="Fail Image"
        width={100}
        height={100}
      />
    )

    // First render: Next.js Image (mocked as img with data-testid)
    const nextImg = screen.getByTestId('next-image')
    expect(nextImg).toBeInTheDocument()

    // Trigger error to switch to native img
    fireEvent.error(nextImg)

    // After error, SafeImage should render a native img without data-testid
    const nativeImg = screen.getByAltText('Fail Image') as HTMLImageElement
    expect(nativeImg).toBeInTheDocument()
    expect(nativeImg).not.toHaveAttribute('data-testid', 'next-image')
  })

  it('shows fallback icon after repeated errors', () => {
    render(
      <SafeImage
        src="/images/fail-twice.jpg"
        alt="Fail Twice"
        width={100}
        height={100}
      />
    )

    // First error: switch to native img
    const nextImg = screen.getByTestId('next-image')
    fireEvent.error(nextImg)

    // Second error on native img: show fallback
    const nativeImg = screen.getByAltText('Fail Twice')
    fireEvent.error(nativeImg)

    // Fallback is a div containing the LuImageOff icon; we can assert by role/structure
    const fallbackIcon = screen.getByTestId('safe-image-fallback')
    expect(fallbackIcon).toBeInTheDocument()
  })
})
