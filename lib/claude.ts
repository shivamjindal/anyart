const ANTHROPIC_API = "https://api.anthropic.com/v1/messages"
const ANTHROPIC_VERSION = "2023-06-01"

export type ExpandedIdea = {
  title: string
  description: string
}

function getApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set")
  }
  return key
}

/**
 * Expand a short user phrase into a title and description for AnyArt (AIC gallery app).
 */
export async function expandIdea(rawInput: string): Promise<ExpandedIdea> {
  const key = getApiKey()
  const system = `You are helping design features for AnyArt, a Next.js web app that browses and searches artworks from the Art Institute of Chicago API.
Respond with ONLY valid JSON, no markdown, in this exact shape:
{"title":"...","description":"..."}
title: under 80 characters, Title Case.
description: 2-4 sentences explaining the feature and user value in the context of browsing art.`

  const user = `The user suggested this feature in their own words:\n"${rawInput.trim()}"\n\nProduce title and description JSON.`

  const resolvedModel =
    process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5"

  const body = {
    model: resolvedModel,
    max_tokens: 512,
    system,
    messages: [{ role: "user", content: user }],
  }

  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${text}`)
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text?: string }>
  }
  const text = data.content?.find((c) => c.type === "text")?.text ?? ""
  const parsed = parseJsonObject(text)
  if (!parsed.title || !parsed.description) {
    throw new Error("Invalid expansion response from model")
  }
  return {
    title: String(parsed.title).trim(),
    description: String(parsed.description).trim(),
  }
}

function parseJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("No JSON object in model response")
  }
  return JSON.parse(jsonMatch[0]) as Record<string, unknown>
}
