import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchBar } from '@/components/search-bar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    mockOnSearch.mockClear()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render search input with placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Search for art" />)

    expect(screen.getByPlaceholderText('Search for art')).toBeInTheDocument()
  })

  it('should use default placeholder when not provided', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    expect(screen.getByPlaceholderText('Search artworks...')).toBeInTheDocument()
  })

  it('should debounce search calls', async () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search artworks...')
    
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled()

    // Fast-forward time
    jest.advanceTimersByTime(500)

    // Should call after debounce delay
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test')
    })
  })

  it('should show clear button when input has value', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search artworks...')
    fireEvent.change(input, { target: { value: 'test query' } })

    const clearButton = screen.getByLabelText('Clear search')
    expect(clearButton).toBeInTheDocument()
  })

  it('should not show clear button when input is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('should clear input when clear button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search artworks...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test query' } })

    const clearButton = screen.getByLabelText('Clear search')
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  it('should update input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search artworks...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'cats' } })

    expect(input.value).toBe('cats')
  })

  it('should not call onSearch multiple times during typing', async () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('Search artworks...')
    
    // Type multiple characters quickly
    fireEvent.change(input, { target: { value: 't' } })
    jest.advanceTimersByTime(100)
    fireEvent.change(input, { target: { value: 'te' } })
    jest.advanceTimersByTime(100)
    fireEvent.change(input, { target: { value: 'tes' } })
    jest.advanceTimersByTime(100)
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Fast-forward past debounce delay
    jest.advanceTimersByTime(500)

    // Should only call once with final value
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1)
      expect(mockOnSearch).toHaveBeenCalledWith('test')
    })
  })
})

