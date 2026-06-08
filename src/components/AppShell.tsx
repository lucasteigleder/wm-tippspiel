import Link from "next/link"
import {
  Home,
  Trophy,
  ListChecks,
  BarChart3,
  BookOpen,
  PlusCircle,
  LogIn,
  User,
  Table2,
  Megaphone,
  Gift,
} from "lucide-react"
import { LogoutButton } from "@/components/LogoutButton"
import { MobileSidebar } from "@/components/MobileSidebar"

type AppShellProps = {
  children: React.ReactNode
  tippspielId?: string
  tippspielName?: string
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
    >
      {icon}
      {label}
    </Link>
  )
}

export function AppShell({
  children,
  tippspielId,
  tippspielName = "WM 2026 Tippspiel",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#1e293b,_#09090b_35%)] text-zinc-100">
      <MobileSidebar tippspielId={tippspielId} tippspielName={tippspielName} />

      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-zinc-800/80 bg-zinc-950/80 p-6 backdrop-blur-xl md:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-zinc-950">
            <Trophy size={22} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Tippspiel
            </p>
            <h1 className="text-xl font-bold">WM Tippspiel</h1>
          </div>
        </div>

        <nav className="space-y-2">
          <NavItem
            href="/dashboard"
            icon={<Home size={18} />}
            label="Startseite"
          />

          {tippspielId && (
            <div className="pt-5">
              <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                {tippspielName}
              </p>

              <NavItem
                href={`/tippspiele/${tippspielId}/tippen`}
                icon={<ListChecks size={18} />}
                label="Tippen"
              />

              <NavItem
                href={`/tippspiele/${tippspielId}/rangliste`}
                icon={<BarChart3 size={18} />}
                label="Rangliste"
              />

              <NavItem
                href={`/tippspiele/${tippspielId}/regeln`}
                icon={<BookOpen size={18} />}
                label="Regeln"
              />

              <NavItem
                href={`/tippspiele/${tippspielId}/gruppen`}
                icon={<Table2 size={18} />}
                label="Gruppen"
              />

              <NavItem
                href={`/tippspiele/${tippspielId}/infos`}
                icon={<Megaphone size={18} />}
                label="Infos"
              />

              <NavItem
                href={`/tippspiele/${tippspielId}/bonus`}
                icon={<Gift size={18} />}
                label="Bonusfragen"
              />
            </div>
          )}

          <div className="pt-5">
            <NavItem
              href="/tippspiele/erstellen"
              icon={<PlusCircle size={18} />}
              label="Tippspiel erstellen"
            />

            <NavItem
              href="/tippspiele/beitreten"
              icon={<LogIn size={18} />}
              label="Tippspiel beitreten"
            />

            <NavItem href="/profile" icon={<User size={18} />} label="Konto" />
          </div>
        </nav>

        <div className="absolute bottom-24 left-6 right-6">
          <Link
            href="/impressum"
            className="block px-4 text-sm text-zinc-500 hover:text-zinc-300"
          >
            Impressum
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <LogoutButton />
        </div>
      </aside>

      <main className="md:pl-72">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-24 md:px-10 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}