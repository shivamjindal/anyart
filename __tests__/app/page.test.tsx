import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  const mockArtworksResponse = {
    data: [
      {
        id: 1,
        title: 'Test Artwork 1',
        artist_display: 'Artist 1',
        date_display: '2024',
        image_id: 'image-1',
        thumbnail: null,
      },
      {
        id: 2,
        title: 'Test Artwork 2',
        artist_display: 'Artist 2',
        date_display: '2023',
        image_id: 'image-2',
        thumbnail: null,
      },
    ],
    pagination: {
      total: 100,
      limit: 12,
      offset: 0,
      total_pages: 9,
      current_page: 1,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockArtworksResponse,
    } as Response)
  })

  it('should render page title and description', () => {
    render(<Home />)

    expect(screen.getByText('AnyArt Gallery')).toBeInTheDocument()
    expect(
      screen.getByText('Explore artworks from the Art Institute of Chicago')
    ).toBeInTheDocument()
  })

  it('should render search bar', () => {
    render(<Home />)

    expect(screen.getByPlaceholderText('Search artworks...')).toBeInTheDocument()
  })

  it('should fetch and display artworks on mount', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/artworks?page=1'))
    })

    await waitFor(() => {
      expect(screen.getByText('Test Artwork 1')).toBeInTheDocument()
      expect(screen.getByText('Test Artwork 2')).toBeInTheDocument()
    })
  })

  it('should show loading state initially', () => {
    const { container } = render(<Home />)

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should display error message when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Network error' }),
    } as Response)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })

  it('should search artworks when query is entered', async () => {
    jest.useFakeTimers()
    
    const searchResponse = {
      ...mockArtworksResponse,
      data: [
        {
          id: 3,
          title: 'Cat Painting',
          artist_display: 'Cat Artist',
          date_display: '2022',
          image_id: 'cat-image',
          thumbnail: null,
        },
      ],
    }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockArtworksResponse,
    } as Response).mockResolvedValueOnce({
      ok: true,
      json: async () => searchResponse,
    } as Response)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Test Artwork 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search artworks...')
    fireEvent.change(searchInput, { target: { value: 'cats' } })

    jest.advanceTimersByTime(500)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/artworks/search?q=cats'))
    })

    await waitFor(() => {
      expect(screen.getByText('Cat Painting')).toBeInTheDocument()
    })

    jest.useRealTimers()
  })

  it('should render pagination', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Test Artwork 1')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
  })

  it('should change page when pagination is clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockArtworksResponse,
    } as Response).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArtworksResponse,
    } as Response)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Test Artwork 1')).toBeInTheDocument()
    })

    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/artworks?page=2'))
    })
  })

  it('should not render pagination when no artworks', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [],
        pagination: {
          total: 0,
          limit: 12,
          offset: 0,
          total_pages: 0,
          current_page: 1,
        },
      }),
    } as Response)

    render(<Home />)

    await waitFor(() => {
      expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument()
    })
  })
})

