import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight hover:text-primary transition-colors"
        >
          AnyArt
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
