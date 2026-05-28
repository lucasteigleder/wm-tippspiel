"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  Home,
  Trophy,
  ListChecks,
  BarChart3,
  BookOpen,
  PlusCircle,
  LogIn,
  User,
  Table2,
} from "lucide-react"

type MobileSidebarProps = {
  tippspielId?: string
  tippspielName?: string
}

function MobileNavItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-4 py-4 text-zinc-200 transition hover:bg-zinc-900"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export function MobileSidebar({
  tippspielId,
  tippspielName = "WM 2026 Tippspiel",
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-3 backdrop-blur md:hidden"
      >
        <Menu size={22} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Tippspiel
                </p>

                <h1 className="text-xl font-bold">
                  WM Tippspiel
                </h1>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 hover:bg-zinc-900"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              <MobileNavItem
                href="/dashboard"
                icon={<Home size={18} />}
                label="Startseite"
                onClick={() => setOpen(false)}
              />

              {tippspielId && (
                <>
                  <p className="px-4 pt-5 text-xs uppercase tracking-widest text-zinc-500">
                    {tippspielName}
                  </p>

                  <MobileNavItem
                    href={`/tippspiele/${tippspielId}/tippen`}
                    icon={<ListChecks size={18} />}
                    label="Tippen"
                    onClick={() => setOpen(false)}
                  />

                  <MobileNavItem
                    href={`/tippspiele/${tippspielId}/rangliste`}
                    icon={<BarChart3 size={18} />}
                    label="Rangliste"
                    onClick={() => setOpen(false)}
                  />

                  <MobileNavItem
                    href={`/tippspiele/${tippspielId}/regeln`}
                    icon={<BookOpen size={18} />}
                    label="Regeln"
                    onClick={() => setOpen(false)}
                  />

                  <MobileNavItem
                    href={`/tippspiele/${tippspielId}/gruppen`}
                    icon={<Table2 size={18} />}
                    label="Gruppen"
                    onClick={() => setOpen(false)}
                  />
                </>
              )}

              <div className="pt-5">
                <MobileNavItem
                  href="/tippspiele/erstellen"
                  icon={<PlusCircle size={18} />}
                  label="Tippspiel erstellen"
                  onClick={() => setOpen(false)}
                />

                <MobileNavItem
                  href="/tippspiele/beitreten"
                  icon={<LogIn size={18} />}
                  label="Tippspiel beitreten"
                  onClick={() => setOpen(false)}
                />

                <MobileNavItem
                  href="/profile"
                  icon={<User size={18} />}
                  label="Konto"
                  onClick={() => setOpen(false)}
                />
              </div>
            </nav>
          </aside>
        </>
      )}
    </>
  )
}