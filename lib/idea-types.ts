/** Public API shape for an idea (no creator fingerprint). */
export type IdeaPublic = {
  id: string
  rawInput: string
  title: string
  description: string
  votes: number
  status: string
  jiraKey: string | null
  createdAt: string
  updatedAt: string
  canEdit: boolean
  hasVoted: boolean
}
