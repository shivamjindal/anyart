import { render, screen, fireEvent } from '@testing-library/react'
import { ArtworkCard } from '@/components/artwork-card'
import { Artwork } from '@/lib/artic-api'

describe('ArtworkCard', () => {
  const mockArtwork: Artwork = {
    id: 1,
    title: 'Test Artwork Title',
    artist_display: 'Test Artist Name',
    date_display: '2024',
    image_id: 'test-image-id',
    thumbnail: {
      lqip: 'data:image/jpeg;base64,test',
      width: 100,
      height: 100,
      alt_text: 'Test alt text',
    },
  }

  it('should render artwork with all details', () => {
    render(<ArtworkCard artwork={mockArtwork} />)

    expect(screen.getByText('Test Artwork Title')).toBeInTheDocument()
    expect(screen.getByText('Test Artist Name')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('should render artwork with image', () => {
    render(<ArtworkCard artwork={mockArtwork} />)

    const image = screen.getByAltText('Test alt text')
    expect(image).toBeInTheDocument()
  })

  it('should render placeholder when no image_id', () => {
    const artworkNoImage = { ...mockArtwork, image_id: null, thumbnail: null }
    render(<ArtworkCard artwork={artworkNoImage} />)

    expect(screen.getByText('No Image Available')).toBeInTheDocument()
  })

  it('should display "Unknown Artist" when artist_display is empty', () => {
    const artworkNoArtist = { ...mockArtwork, artist_display: '' }
    render(<ArtworkCard artwork={artworkNoArtist} />)

    expect(screen.getByText('Unknown Artist')).toBeInTheDocument()
  })

  it('should display "Date Unknown" when date_display is empty', () => {
    const artworkNoDate = { ...mockArtwork, date_display: '' }
    render(<ArtworkCard artwork={artworkNoDate} />)

    expect(screen.getByText('Date Unknown')).toBeInTheDocument()
  })

  it('should not render favorite button without handler', () => {
    render(<ArtworkCard artwork={mockArtwork} />)
    expect(screen.queryByRole('button', { name: /favorite/i })).not.toBeInTheDocument()
  })

  it('should toggle favorite via button', () => {
    const onFavoriteToggle = jest.fn()
    render(
      <ArtworkCard
        artwork={mockArtwork}
        onFavoriteToggle={onFavoriteToggle}
        isFavorite={false}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }))
    expect(onFavoriteToggle).toHaveBeenCalledWith(mockArtwork)
  })

  it('should show remove label when favorited', () => {
    render(
      <ArtworkCard
        artwork={mockArtwork}
        onFavoriteToggle={jest.fn()}
        isFavorite={true}
      />
    )
    expect(
      screen.getByRole('button', { name: /remove from favorites/i })
    ).toBeInTheDocument()
  })
})

