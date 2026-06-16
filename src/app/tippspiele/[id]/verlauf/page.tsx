import Link from "next/link"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { RankingHistoryService } from "@/services/RankingHistoryService"
import { formatStageName } from "@/utils/stage"
import { RankingHistoryChart } from "@/components/RankingHistoryChart"

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

  const [matches, predictions, members] = await Promise.all([
    MatchRepository.getAll(),
    PredictionRepository.getByTippspiel(id),
    TippspielRepository.getMembers(id),
  ])

  const userNameById = new Map(
    members.map((member) => [
      member.user_id,
      member.profile?.display_name ??
        member.profile?.username ??
        "Unbekannt",
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

      <section className="mt-8">
  {history.length > 0 ? (
    <RankingHistoryChart history={history} />
  ) : (
    <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
      Noch keine abgeschlossenen Spiele vorhanden.
    </div>
  )}
</section>
    </AppShell>
  )
}