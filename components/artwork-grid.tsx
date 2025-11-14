import { Artwork } from '@/lib/artic-api'
import { ArtworkCard } from './artwork-card'
import { Skeleton } from './ui/skeleton'

interface ArtworkGridProps {
  artworks: Artwork[]
  isLoading?: boolean
}

export function ArtworkGrid({ artworks, isLoading = false }: ArtworkGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No artworks found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  )
}

