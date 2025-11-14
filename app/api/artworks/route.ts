import { NextRequest, NextResponse } from 'next/server'
import { fetchArtworks } from '@/lib/api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  try {
    const data = await fetchArtworks(page, limit)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API Route] Error fetching artworks:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}

