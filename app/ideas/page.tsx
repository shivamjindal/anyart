"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { IdeaForm } from "@/components/idea-form"
import { IdeaCard } from "@/components/idea-card"
import type { IdeaPublic } from "@/lib/idea-types"

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<IdeaPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch("/api/ideas", { credentials: "include" })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to load ideas")
      }
      setIdeas(json.data as IdeaPublic[])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCreated = useCallback((idea: IdeaPublic) => {
    setIdeas((prev) => [idea, ...prev])
  }, [])

  const handleUpdated = useCallback((updated: IdeaPublic) => {
    setIdeas((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
  }, [])

  const handleVoted = useCallback((ideaId: string, votes: number) => {
    setIdeas((prev) =>
      prev.map((i) =>
        i.id === ideaId ? { ...i, votes, hasVoted: true } : i,
      ),
    )
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center space-y-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            ← Back to gallery
          </Link>
          <h1 className="text-4xl font-bold">Feature ideas</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Share what you&apos;d like to see built on AnyArt. Vote on ideas you like.
          </p>
        </div>

        <section className="mb-12">
          <IdeaForm onCreated={handleCreated} />
        </section>

        {loading && (
          <p className="text-center text-muted-foreground">Loading ideas…</p>
        )}
        {error && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {!loading && !error && ideas.length === 0 && (
          <p className="text-center text-muted-foreground">No ideas yet. Be the first to submit one.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onUpdated={handleUpdated}
              onVoted={handleVoted}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
