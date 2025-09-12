import { render, screen } from '@testing-library/react'

// Simple test component to demonstrate testing setup
function SimpleComponent({ message }: { message: string }) {
  return <div data-testid="simple-component">{message}</div>
}

describe('SimpleComponent', () => {
  it('should render the message correctly', () => {
    render(<SimpleComponent message="Hello, Testing!" />)

    expect(screen.getByTestId('simple-component')).toBeInTheDocument()
    expect(screen.getByText('Hello, Testing!')).toBeInTheDocument()
  })

  it('should handle different messages', () => {
    render(<SimpleComponent message="Test Message" />)

    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })
})

