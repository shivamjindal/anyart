"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { IdeaPublic } from "@/lib/idea-types"

type IdeaFormProps = {
  onCreated: (idea: IdeaPublic) => void
}

export function IdeaForm({ onCreated }: IdeaFormProps) {
  const [rawInput, setRawInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = rawInput.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: trimmed }),
        credentials: "include",
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit idea")
      }
      onCreated(json.data as IdeaPublic)
      setRawInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-xl mx-auto">
      <label htmlFor="raw-idea" className="text-sm font-medium text-foreground">
        Your idea in a few words
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          id="raw-idea"
          placeholder='e.g. "dark mode" or "save favorite artworks"'
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          disabled={loading}
          maxLength={2000}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !rawInput.trim()}>
          {loading ? "Expanding…" : "Submit"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We use AI to turn your phrase into a clear title and description. You can edit them after
        submitting.
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
