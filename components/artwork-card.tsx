import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Artwork, getImageUrl } from '@/lib/artic-api'

interface ArtworkCardProps {
  artwork: Artwork
  isFavorite?: boolean
  onFavoriteToggle?: (artwork: Artwork) => void
}

export function ArtworkCard({
  artwork,
  isFavorite = false,
  onFavoriteToggle,
}: ArtworkCardProps) {
  const imageUrl = artwork.image_id 
    ? getImageUrl(artwork.image_id, 400) 
    : '/placeholder.jpg'

  return (
    <Card className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="relative aspect-square bg-muted">
        {artwork.image_id ? (
          <Image
            src={imageUrl}
            alt={artwork.thumbnail?.alt_text || artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image Available
          </div>
        )}
        {onFavoriteToggle ? (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-9 w-9 rounded-full bg-background/90 shadow-md hover:bg-background"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            onClick={() => onFavoriteToggle(artwork)}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`}
              aria-hidden
            />
          </Button>
        ) : null}
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-lg line-clamp-2 mb-2">
          {artwork.title}
        </CardTitle>
        <CardDescription className="line-clamp-1 mb-1">
          {artwork.artist_display || 'Unknown Artist'}
        </CardDescription>
        <CardDescription className="text-xs">
          {artwork.date_display || 'Date Unknown'}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

