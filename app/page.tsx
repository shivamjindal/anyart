'use client'

import { useState, useEffect, useCallback } from 'react'
import { Artwork } from '@/lib/api'
import { ArtworkGrid } from '@/components/artwork-grid'
import { Pagination } from '@/components/pagination'
import { SearchBar } from '@/components/search-bar'

interface ArtworkResponse {
  data: Artwork[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
  }
}

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
      const url = query
        ? `/api/artworks/search?q=${encodeURIComponent(query)}&page=${page}`
        : `/api/artworks?page=${page}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load artworks')
      }

      const data: ArtworkResponse = await response.json()
      setArtworks(data.data)
      setTotalPages(data.pagination.total_pages)
      setCurrentPage(data.pagination.current_page)
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

