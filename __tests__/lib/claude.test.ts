import { expandIdea } from "@/lib/claude"

describe("expandIdea", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key"
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: '{"title":"Dark mode","description":"Add a toggle for dark theme."}' }],
      }),
    }) as unknown as typeof fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it("returns parsed title and description from Anthropic response", async () => {
    const result = await expandIdea("dark mode")
    expect(result.title).toBe("Dark mode")
    expect(result.description).toContain("toggle")
  })
})
