'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchArtworks, searchArtworks, Artwork } from '@/lib/api'
import { ArtworkGrid } from '@/components/artwork-grid'
import { Pagination } from '@/components/pagination'
import { SearchBar } from '@/components/search-bar'

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const loadArtworks = useCallback(async (page: number, query: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = query
        ? await searchArtworks(query, page)
        : await fetchArtworks(page)

      setArtworks(response.data)
      setTotalPages(response.pagination.total_pages)
      setCurrentPage(response.pagination.current_page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artworks')
      setArtworks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadArtworks(1, searchQuery)
  }, [searchQuery, loadArtworks])

  const handlePageChange = useCallback((page: number) => {
    loadArtworks(page, searchQuery)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [searchQuery, loadArtworks])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center">AnyArt Gallery</h1>
          <p className="text-muted-foreground text-center mb-6">
            Explore artworks from the Art Institute of Chicago
          </p>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : (
          <>
            <ArtworkGrid artworks={artworks} isLoading={isLoading} />
            {!isLoading && artworks.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}

