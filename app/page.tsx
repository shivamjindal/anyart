'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { Artwork } from '@/lib/artic-api'
import {
  artworkToStored,
  loadFavoriteArtworks,
  saveFavoriteArtworks,
  storedToArtwork,
} from '@/lib/favorite-artworks'
import { ArtworkGrid } from '@/components/artwork-grid'
import { Pagination } from '@/components/pagination'
import { SearchBar } from '@/components/search-bar'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())
  const [galleryView, setGalleryView] = useState<'browse' | 'favorites'>('browse')

  useEffect(() => {
    setFavoriteIds(new Set(loadFavoriteArtworks().map((item) => item.id)))
  }, [])

  const favoriteArtworks = loadFavoriteArtworks().map(storedToArtwork)

  const toggleFavorite = useCallback((artwork: Artwork) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      const storedList = loadFavoriteArtworks()
      if (next.has(artwork.id)) {
        next.delete(artwork.id)
        saveFavoriteArtworks(storedList.filter((item) => item.id !== artwork.id))
      } else {
        next.add(artwork.id)
        saveFavoriteArtworks([
          ...storedList.filter((item) => item.id !== artwork.id),
          artworkToStored(artwork),
        ])
      }
      return next
    })
  }, [])

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
          <p className="text-muted-foreground text-center mb-2">
            Explore artworks from the Art Institute of Chicago
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Link
              href="/ideas"
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'text-base font-semibold shadow-md hover:shadow-lg transition-shadow'
              )}
            >
              Suggest a feature
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              type="button"
              variant={galleryView === 'browse' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setGalleryView('browse')}
            >
              Browse gallery
            </Button>
            <Button
              type="button"
              variant={galleryView === 'favorites' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setGalleryView('favorites')}
            >
              My favorites{favoriteIds.size > 0 ? ` (${favoriteIds.size})` : ''}
            </Button>
          </div>
          {galleryView === 'browse' ? (
            <div className="flex justify-center">
              <SearchBar onSearch={handleSearch} />
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm mb-2">
              Saved on this device only — tap the heart on any piece to add or remove.
            </p>
          )}
        </div>

        {error && galleryView === 'browse' ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : galleryView === 'favorites' ? (
          <ArtworkGrid
            artworks={favoriteArtworks}
            isLoading={false}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            emptyMessage="No favorites yet — heart a piece while browsing."
          />
        ) : (
          <>
            <ArtworkGrid
              artworks={artworks}
              isLoading={isLoading}
              favoriteIds={favoriteIds}
              onFavoriteToggle={toggleFavorite}
            />
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

