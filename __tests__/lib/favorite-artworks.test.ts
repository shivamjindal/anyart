import type { Artwork } from '@/lib/artic-api'
import {
  FAVORITE_ARTWORKS_STORAGE_KEY,
  artworkToStored,
  loadFavoriteArtworks,
  saveFavoriteArtworks,
  storedToArtwork,
} from '@/lib/favorite-artworks'

describe('favorite-artworks', () => {
  const mockArtwork: Artwork = {
    id: 42,
    title: 'Night Cafe',
    artist_display: 'Van Gogh',
    date_display: '1888',
    image_id: 'abc',
    thumbnail: {
      lqip: '',
      width: 1,
      height: 1,
      alt_text: 'Interior',
    },
  }

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('round-trips artwork via stored shape', () => {
    const stored = artworkToStored(mockArtwork)
    expect(stored).toEqual({
      id: 42,
      title: 'Night Cafe',
      artist_display: 'Van Gogh',
      date_display: '1888',
      image_id: 'abc',
      thumbnail_alt_text: 'Interior',
    })
    const back = storedToArtwork(stored)
    expect(back.id).toBe(42)
    expect(back.title).toBe('Night Cafe')
    expect(back.thumbnail?.alt_text).toBe('Interior')
  })

  it('loadFavoriteArtworks reads valid JSON array', () => {
    window.localStorage.setItem(
      FAVORITE_ARTWORKS_STORAGE_KEY,
      JSON.stringify([artworkToStored(mockArtwork)])
    )
    const loaded = loadFavoriteArtworks()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe(42)
  })

  it('loadFavoriteArtworks returns empty on invalid JSON', () => {
    window.localStorage.setItem(FAVORITE_ARTWORKS_STORAGE_KEY, 'not-json')
    expect(loadFavoriteArtworks()).toEqual([])
  })

  it('saveFavoriteArtworks persists array', () => {
    saveFavoriteArtworks([artworkToStored(mockArtwork)])
    const raw = window.localStorage.getItem(FAVORITE_ARTWORKS_STORAGE_KEY)
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toHaveLength(1)
  })
})
