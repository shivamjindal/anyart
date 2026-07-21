import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/theme-toggle'

const mockSetTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

import { useTheme } from 'next-themes'

const mockedUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows moon icon and dark mode label in light mode', () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      theme: 'light',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'light',
      forcedTheme: undefined,
    })

    render(<ThemeToggle />)

    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('switches to dark mode when clicked in light mode', () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      theme: 'light',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'light',
      forcedTheme: undefined,
    })

    render(<ThemeToggle />)

    fireEvent.click(screen.getByLabelText('Switch to dark mode'))

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('switches to light mode when clicked in dark mode', () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
      theme: 'dark',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'dark',
      forcedTheme: undefined,
    })

    render(<ThemeToggle />)

    fireEvent.click(screen.getByLabelText('Switch to light mode'))

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
