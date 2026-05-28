import Link from "next/link"
import { LogoutButton } from "@/components/LogoutButton"

type AppShellProps = {
  children: React.ReactNode
  tippspielId?: string
  tippspielName?: string
}

export function AppShell({
  children,
  tippspielId,
  tippspielName = "WM 2026 Tippspiel",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-zinc-800 bg-zinc-950/95 p-6 md:block">
        <div className="mb-10">
          <p className="text-sm text-zinc-500">Tippspiel</p>
          <h1 className="text-2xl font-bold">WM Tippspiel</h1>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
          >
            Startseite
          </Link>

          {tippspielId && (
            <div className="pt-4">
              <p className="mb-2 px-4 text-xs uppercase text-zinc-500">
                {tippspielName}
              </p>

              <Link
                href={`/tippspiele/${tippspielId}/tippen`}
                className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
              >
                Tippen
              </Link>

              <Link
                href={`/tippspiele/${tippspielId}/rangliste`}
                className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
              >
                Rangliste
              </Link>

              <Link
                href={`/tippspiele/${tippspielId}/regeln`}
                className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
              >
                Regeln
              </Link>
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/dashboard#create"
              className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
            >
              Tippspiel erstellen
            </Link>

            <Link
              href="/dashboard#join"
              className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
            >
              Tippspiel beitreten
            </Link>

            <Link
              href="/profile"
              className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
            >
              Konto
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <LogoutButton />
        </div>
      </aside>

      <main className="md:pl-72">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
          {children}
        </div>
      </main>
    </div>
  )
}