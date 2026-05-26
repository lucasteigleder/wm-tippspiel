import Link from "next/link"
import { LogoutButton } from "@/components/LogoutButton"

export function AppHeader() {
  return (
    <header className="border-b border-gray-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-xl font-bold">
          WM Tippspiel
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-400">
            Dashboard
          </Link>

          <LogoutButton />
        </nav>
      </div>
    </header>
  )
}