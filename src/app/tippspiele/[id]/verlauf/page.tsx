import Link from "next/link"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { ProfileRepository } from "@/repositories/ProfileRepository"
import { RankingHistoryService } from "@/services/RankingHistoryService"
import { formatStageName } from "@/utils/stage"

type VerlaufPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function VerlaufPage({ params }: VerlaufPageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [matches, predictions, profiles] = await Promise.all([
    MatchRepository.getAll(),
    PredictionRepository.getByTippspiel(id),
    ProfileRepository.getAll(),
  ])

  const userNameById = new Map(
    profiles.map((profile) => [
      profile.id,
      profile.display_name ?? profile.username,
    ])
  )

  const history = RankingHistoryService.calculate(
    matches,
    predictions,
    userNameById
  )

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Verlauf
        </p>

        <h1 className="mt-3 text-4xl font-black">Platzierungsverlauf</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Hier siehst du, wie sich die Platzierungen nach den abgeschlossenen
          Spieltagen entwickelt haben.
        </p>
      </section>

      <section className="mt-8 grid gap-5">
        {history.map((row) => (
          <div
            key={row.stage}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-black">
              {formatStageName(row.stage)}
            </h2>

            <div className="mt-5 grid gap-2">
              {row.rankings.map((ranking) => (
                <div
                  key={ranking.userId}
                  className="flex items-center justify-between rounded-2xl bg-zinc-950/70 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-black text-zinc-950">
                      {ranking.placement}
                    </span>

                    <span className="font-bold">{ranking.name}</span>
                  </div>

                  <span className="font-black">{ranking.points} Pkt.</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
            Noch keine abgeschlossenen Spiele vorhanden.
          </div>
        )}
      </section>
    </AppShell>
  )
}