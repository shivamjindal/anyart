import { fetchArtworks, searchArtworks, getImageUrl } from '@/lib/artic-api'

describe('API Functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('fetchArtworks', () => {
    it('should fetch artworks successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Test Artwork',
            artist_display: 'Test Artist',
            date_display: '2024',
            image_id: 'test-image-id',
            thumbnail: null,
          },
        ],
        pagination: {
          total: 100,
          limit: 12,
          offset: 0,
          total_pages: 9,
          current_page: 1,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await fetchArtworks(1, 12)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/artworks?page=1&limit=12'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'AIC-User-Agent': 'anyart (shivam@anysphere.co)',
          }),
        })
      )
      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].title).toBe('Test Artwork')
    })

    it('should throw error on failed fetch', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      })

      await expect(fetchArtworks()).rejects.toThrow('Failed to fetch artworks: Not Found')
    })

    it('should use default parameters', async () => {
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 12,
          offset: 0,
          total_pages: 0,
          current_page: 1,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await fetchArtworks()

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1&limit=12'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'AIC-User-Agent': 'anyart (shivam@anysphere.co)',
          }),
        })
      )
    })
  })

  describe('searchArtworks', () => {
    it('should search artworks successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 2,
            title: 'Cat Artwork',
            artist_display: 'Cat Artist',
            date_display: '2023',
            image_id: 'cat-image-id',
            thumbnail: null,
          },
        ],
        pagination: {
          total: 50,
          limit: 12,
          offset: 0,
          total_pages: 5,
          current_page: 1,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await searchArtworks('cats', 1, 12)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/artworks/search?q=cats'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'AIC-User-Agent': 'anyart (shivam@anysphere.co)',
          }),
        })
      )
      expect(result).toEqual(mockResponse)
      expect(result.data[0].title).toBe('Cat Artwork')
    })

    it('should encode special characters in query', async () => {
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 12,
          offset: 0,
          total_pages: 0,
          current_page: 1,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await searchArtworks('test & query', 1, 12)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('test%20%26%20query'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'AIC-User-Agent': 'anyart (shivam@anysphere.co)',
          }),
        })
      )
    })

    it('should throw error on failed search', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      })

      await expect(searchArtworks('test')).rejects.toThrow(
        'Failed to search artworks: Bad Request'
      )
    })
  })

  describe('getImageUrl', () => {
    it('should generate correct image URL with default size', () => {
      const imageId = 'test-image-id-123'
      const url = getImageUrl(imageId)

      expect(url).toBe(
        'https://www.artic.edu/iiif/2/test-image-id-123/full/843,/0/default.jpg'
      )
    })

    it('should generate correct image URL with custom size', () => {
      const imageId = 'test-image-id-456'
      const url = getImageUrl(imageId, 400)

      expect(url).toBe(
        'https://www.artic.edu/iiif/2/test-image-id-456/full/400,/0/default.jpg'
      )
    })
  })
})

