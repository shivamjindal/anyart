import type { Artwork } from '@/lib/artic-api'

export const FAVORITE_ARTWORKS_STORAGE_KEY = 'anyart:favorite-artworks'

/** Minimal fields persisted for gallery cards (full thumbnail not needed). */
export interface StoredFavoriteArtwork {
  id: number
  title: string
  artist_display: string
  date_display: string
  image_id: string | null
  thumbnail_alt_text: string | null
}

export function artworkToStored(artwork: Artwork): StoredFavoriteArtwork {
  return {
    id: artwork.id,
    title: artwork.title,
    artist_display: artwork.artist_display,
    date_display: artwork.date_display,
    image_id: artwork.image_id,
    thumbnail_alt_text: artwork.thumbnail?.alt_text ?? null,
  }
}

export function storedToArtwork(stored: StoredFavoriteArtwork): Artwork {
  return {
    id: stored.id,
    title: stored.title,
    artist_display: stored.artist_display,
    date_display: stored.date_display,
    image_id: stored.image_id,
    thumbnail: stored.thumbnail_alt_text
      ? {
          lqip: '',
          width: 0,
          height: 0,
          alt_text: stored.thumbnail_alt_text,
        }
      : null,
  }
}

export function loadFavoriteArtworks(): StoredFavoriteArtwork[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(FAVORITE_ARTWORKS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isStoredFavoriteArtwork)
  } catch {
    return []
  }
}

export function saveFavoriteArtworks(items: StoredFavoriteArtwork[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      FAVORITE_ARTWORKS_STORAGE_KEY,
      JSON.stringify(items)
    )
  } catch {
    // quota or private mode — ignore
  }
}

function isStoredFavoriteArtwork(value: unknown): value is StoredFavoriteArtwork {
  if (value === null || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.artist_display === 'string' &&
    typeof v.date_display === 'string' &&
    (v.image_id === null || typeof v.image_id === 'string') &&
    (v.thumbnail_alt_text === null || typeof v.thumbnail_alt_text === 'string')
  )
}
