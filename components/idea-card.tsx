"use client"

import { useState } from "react"
import { ThumbsUp, Pencil, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { IdeaPublic } from "@/lib/idea-types"

type IdeaCardProps = {
  idea: IdeaPublic
  onUpdated: (idea: IdeaPublic) => void
  onVoted: (ideaId: string, votes: number) => void
}

export function IdeaCard({ idea, onUpdated, onVoted }: IdeaCardProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(idea.title)
  const [description, setDescription] = useState(idea.description)
  const [saving, setSaving] = useState(false)
  const [voteLoading, setVoteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function saveEdit() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
        credentials: "include",
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to save")
      }
      onUpdated({ ...(json.data as IdeaPublic), hasVoted: idea.hasVoted })
      setEditing(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function vote() {
    if (idea.hasVoted || voteLoading) return
    setVoteLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/ideas/${idea.id}/vote`, {
        method: "POST",
        credentials: "include",
      })
      const json = await res.json()
      if (!res.ok) {
        if (res.status === 409 && json.code === "ALREADY_VOTED") {
          onVoted(idea.id, idea.votes)
          return
        }
        throw new Error(json.error || "Vote failed")
      }
      const data = json.data as { votes: number }
      onVoted(idea.id, data.votes)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vote failed")
    } finally {
      setVoteLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold text-lg"
            />
          ) : (
            <CardTitle className="text-lg leading-tight">{idea.title}</CardTitle>
          )}
          {idea.canEdit && !editing && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => {
                setTitle(idea.title)
                setDescription(idea.description)
                setEditing(true)
              }}
              aria-label="Edit idea"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2" title={idea.rawInput}>
          Original: {idea.rawInput}
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        {editing ? (
          <textarea
            className={cn(
              "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <p className="text-sm text-muted-foreground">{idea.description}</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button type="button" size="sm" onClick={saveEdit} disabled={saving}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(false)
                  setTitle(idea.title)
                  setDescription(idea.description)
                }}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant={idea.hasVoted ? "secondary" : "default"}
              size="sm"
              onClick={vote}
              disabled={voteLoading || idea.hasVoted}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {idea.hasVoted ? "Voted" : "Vote"}
            </Button>
          )}
          <span className="text-sm text-muted-foreground tabular-nums">{idea.votes} votes</span>
        </div>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{idea.status}</span>
      </CardFooter>
    </Card>
  )
}
