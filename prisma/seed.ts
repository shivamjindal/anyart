import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // No sample ideas by default — clean slate for demos
  await prisma.vote.deleteMany()
  await prisma.idea.deleteMany()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
