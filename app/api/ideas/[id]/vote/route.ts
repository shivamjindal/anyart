import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { applyFingerprintCookie, getOrCreateFingerprint } from "@/lib/fingerprint"

export const dynamic = "force-dynamic"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_req: Request, context: RouteContext) {
  const { id } = await context.params

  const idea = await prisma.idea.findUnique({ where: { id } })
  if (!idea) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { fingerprint, setCookie } = await getOrCreateFingerprint()

  try {
    await prisma.$transaction(async (tx) => {
      await tx.vote.create({
        data: {
          ideaId: id,
          fingerprint,
        },
      })
      await tx.idea.update({
        where: { id },
        data: { votes: { increment: 1 } },
      })
    })
  } catch {
    // Unique constraint: already voted
    return NextResponse.json(
      { error: "You have already voted for this idea", code: "ALREADY_VOTED" },
      { status: 409 },
    )
  }

  const full = await prisma.idea.findUnique({ where: { id } })
  if (!full) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const { creatorFingerprint: _c, ...payload } = full
  const res = NextResponse.json({ data: payload })
  applyFingerprintCookie(res, fingerprint, setCookie)
  return res
}
