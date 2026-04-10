import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { FINGERPRINT_COOKIE } from "@/lib/fingerprint"

export const dynamic = "force-dynamic"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params
  const store = await cookies()
  const fingerprint = store.get(FINGERPRINT_COOKIE)?.value
  if (!fingerprint) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await prisma.idea.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (existing.creatorFingerprint !== fingerprint) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const b = body as { title?: unknown; description?: unknown }
  const title = typeof b.title === "string" ? b.title.trim() : undefined
  const description = typeof b.description === "string" ? b.description.trim() : undefined

  if (title === undefined && description === undefined) {
    return NextResponse.json({ error: "Provide title and/or description" }, { status: 400 })
  }
  if (title !== undefined && !title) {
    return NextResponse.json({ error: "title cannot be empty" }, { status: 400 })
  }
  if (description !== undefined && !description) {
    return NextResponse.json({ error: "description cannot be empty" }, { status: 400 })
  }

  const updated = await prisma.idea.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
    },
  })

  const { creatorFingerprint: _c, ...safe } = updated
  return NextResponse.json({ data: { ...safe, canEdit: true } })
}
