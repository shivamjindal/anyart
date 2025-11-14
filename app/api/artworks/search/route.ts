import { NextRequest, NextResponse } from 'next/server'
import { searchArtworks } from '@/lib/api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    )
  }

  try {
    const data = await searchArtworks(query, page, limit)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API Route] Error searching artworks:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search artworks' },
      { status: 500 }
    )
  }
}

