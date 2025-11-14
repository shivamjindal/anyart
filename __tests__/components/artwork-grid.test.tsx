import { render, screen } from '@testing-library/react'
import { ArtworkGrid } from '@/components/artwork-grid'
import { Artwork } from '@/lib/api'

describe('ArtworkGrid', () => {
  const mockArtworks: Artwork[] = [
    {
      id: 1,
      title: 'Artwork 1',
      artist_display: 'Artist 1',
      date_display: '2024',
      image_id: 'image-1',
      thumbnail: null,
    },
    {
      id: 2,
      title: 'Artwork 2',
      artist_display: 'Artist 2',
      date_display: '2023',
      image_id: 'image-2',
      thumbnail: null,
    },
  ]

  it('should render all artworks in a grid', () => {
    render(<ArtworkGrid artworks={mockArtworks} />)

    expect(screen.getByText('Artwork 1')).toBeInTheDocument()
    expect(screen.getByText('Artwork 2')).toBeInTheDocument()
    expect(screen.getByText('Artist 1')).toBeInTheDocument()
    expect(screen.getByText('Artist 2')).toBeInTheDocument()
  })

  it('should render loading skeletons when isLoading is true', () => {
    const { container } = render(<ArtworkGrid artworks={[]} isLoading={true} />)

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should show "No artworks found" when empty', () => {
    render(<ArtworkGrid artworks={[]} isLoading={false} />)

    expect(screen.getByText('No artworks found')).toBeInTheDocument()
  })

  it('should not show loading skeletons when isLoading is false', () => {
    const { container } = render(<ArtworkGrid artworks={mockArtworks} isLoading={false} />)

    expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument()
  })
})

