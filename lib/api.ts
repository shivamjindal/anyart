const BASE_URL = 'https://api.artic.edu/api/v1'

export interface Artwork {
  id: number
  title: string
  artist_display: string
  date_display: string
  image_id: string | null
  thumbnail: {
    lqip: string
    width: number
    height: number
    alt_text: string
  } | null
}

export interface ArtworkResponse {
  data: Artwork[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
  }
}

export interface SearchResponse {
  data: Artwork[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
  }
}

/**
 * Fetches a list of artworks from the Art Institute of Chicago API
 * @param page - The page number (1-indexed)
 * @param limit - Number of results per page
 * @returns Promise with artwork data and pagination info
 */
export async function fetchArtworks(
  page: number = 1,
  limit: number = 12
): Promise<ArtworkResponse> {
  const fields = 'id,title,artist_display,date_display,image_id,thumbnail'
  const url = `${BASE_URL}/artworks?page=${page}&limit=${limit}&fields=${fields}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch artworks: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

/**
 * Searches for artworks based on a query string
 * @param query - The search query
 * @param page - The page number (1-indexed)
 * @param limit - Number of results per page
 * @returns Promise with search results and pagination info
 */
export async function searchArtworks(
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<SearchResponse> {
  const fields = 'id,title,artist_display,date_display,image_id,thumbnail'
  const url = `${BASE_URL}/artworks/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&fields=${fields}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to search artworks: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

/**
 * Generates an image URL using the IIIF Image API
 * @param imageId - The artwork's image_id
 * @param size - The desired image size (e.g., 400, 843)
 * @returns The complete image URL
 */
export function getImageUrl(imageId: string, size: number = 843): string {
  return `https://www.artic.edu/iiif/2/${imageId}/full/${size},/0/default.jpg`
}

