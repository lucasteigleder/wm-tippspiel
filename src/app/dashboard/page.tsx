import Link from "next/link"
import { redirect } from "next/navigation"
import { PlusCircle, LogIn, Trophy } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { ProfileRepository } from "@/repositories/ProfileRepository"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profiles = await ProfileRepository.getAll()
  const profile = profiles.find((profile) => profile.id === user.id)

  const displayName =
    profile?.display_name ?? profile?.username ?? user.email

  const tippspiele = await TippspielRepository.getByUser(user.id)

  return (
    <AppShell>
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Startseite
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Willkommen zurück, {displayName}
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Verwalte deine Tipprunden, gib deine WM-Tipps ab und verfolge die
          Rangliste live.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tippspiele/erstellen"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            <PlusCircle size={18} />
            Tippspiel erstellen
          </Link>

          <Link
            href="/tippspiele/beitreten"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-100 transition hover:bg-zinc-900"
          >
            <LogIn size={18} />
            Tippspiel beitreten
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Deine Tippspiele</h2>
            <p className="mt-1 text-zinc-400">
              Wähle eine Tipprunde aus, um zu tippen oder die Rangliste zu sehen.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {tippspiele.map((tippspiel) => (
            <Link
              key={tippspiel.id}
              href={`/tippspiele/${tippspiel.id}`}
              className="group rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-950">
                    <Trophy size={22} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold group-hover:text-white">
                      {tippspiel.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-400">
                      Invite Code: {tippspiel.invite_code}
                    </p>
                  </div>
                </div>

                <span className="hidden rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 md:block">
                  Öffnen
                </span>
              </div>
            </Link>
          ))}

          {tippspiele.length === 0 && (
            <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
              <h3 className="text-xl font-bold">Noch keine Tipprunde</h3>
              <p className="mt-2 text-zinc-400">
                Erstelle dein erstes Tippspiel oder tritt einer bestehenden Runde bei.
              </p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  )
}