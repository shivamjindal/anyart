import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { expandIdea } from "@/lib/claude"
import { applyFingerprintCookie, FINGERPRINT_COOKIE, getOrCreateFingerprint } from "@/lib/fingerprint"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await cookies()
  const fp = store.get(FINGERPRINT_COOKIE)?.value ?? null

  const [ideas, myVotes] = await Promise.all([
    prisma.idea.findMany({
      orderBy: [{ votes: "desc" }, { createdAt: "desc" }],
    }),
    fp
      ? prisma.vote.findMany({
          where: { fingerprint: fp },
          select: { ideaId: true },
        })
      : Promise.resolve([] as { ideaId: string }[]),
  ])

  const votedIds = new Set(myVotes.map((v) => v.ideaId))

  const data = ideas.map(({ creatorFingerprint, ...idea }) => ({
    ...idea,
    canEdit: fp !== null && creatorFingerprint === fp,
    hasVoted: votedIds.has(idea.id),
  }))

  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const rawInput =
    typeof body === "object" && body !== null && "rawInput" in body
      ? String((body as { rawInput: unknown }).rawInput ?? "").trim()
      : ""

  if (!rawInput || rawInput.length > 2000) {
    return NextResponse.json(
      { error: "rawInput is required and must be 2000 characters or less" },
      { status: 400 },
    )
  }

  const { fingerprint, setCookie } = await getOrCreateFingerprint()

  let title: string
  let description: string
  try {
    const expanded = await expandIdea(rawInput)
    title = expanded.title
    description = expanded.description
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to expand idea"
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const created = await prisma.idea.create({
    data: {
      rawInput,
      title,
      description,
      creatorFingerprint: fingerprint,
    },
  })

  const { creatorFingerprint: _c, ...idea } = created
  const res = NextResponse.json(
    { data: { ...idea, canEdit: true, hasVoted: false } },
    { status: 201 },
  )
  applyFingerprintCookie(res, fingerprint, setCookie)
  return res
}
