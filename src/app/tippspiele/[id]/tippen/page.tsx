import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { PredictionForm } from "@/components/PredictionForm"
import { TeamLogo } from "@/components/TeamLogo"
import { AppShell } from "@/components/AppShell"
import { formatMatchDate } from "@/utils/date"

type TippenPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function TippenPage({ params }: TippenPageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const matches = await MatchRepository.getAll()
  const predictions = await PredictionRepository.getByTippspielAndUser(
    id,
    user.id
  )

  const predictionByMatchId = new Map(
    predictions.map((prediction) => [prediction.match_id, prediction])
  )

  const matchesByStage = Map.groupBy(
    matches,
    (match) => match.stage ?? "Unbekannte Runde"
  )

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <h1 className="mt-8 text-4xl font-bold">Tippen</h1>

      <div className="mt-8 space-y-10">
        {Array.from(matchesByStage.entries()).map(([stage, matches]) => (
          <section key={stage}>
            <h2 className="mb-4 text-2xl font-semibold">{stage}</h2>

            <div className="grid gap-4">
              {matches.map((match) => {
                const prediction = predictionByMatchId.get(match.id)
                const hasResult =
                  match.home_score !== null && match.away_score !== null

                return (
                  <div
                    key={match.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl"
                  >
                    <p className="text-sm text-zinc-400">
                      {formatMatchDate(match.kickoff_at)}
                    </p>

                    <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                      <div className="flex items-center gap-3">
                        <TeamLogo
                          src={match.home_team_logo}
                          alt={match.home_team}
                        />
                        <span className="font-semibold">{match.home_team}</span>
                      </div>

                      <div className="rounded-xl bg-zinc-950 px-4 py-2 text-center font-bold">
                        {hasResult
                          ? `${match.home_score} : ${match.away_score}`
                          : "vs"}
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <span className="font-semibold">{match.away_team}</span>
                        <TeamLogo
                          src={match.away_team_logo}
                          alt={match.away_team}
                        />
                      </div>
                    </div>

                    {hasResult && prediction && (
                      <p className="mt-3 text-sm text-zinc-400">
                        Dein Tipp: {prediction.predicted_home_score} :{" "}
                        {prediction.predicted_away_score}
                      </p>
                    )}

                    {!hasResult && (
                      <PredictionForm
                        tippspielId={id}
                        matchId={match.id}
                        kickoffAt={match.kickoff_at}
                        initialHomeScore={prediction?.predicted_home_score}
                        initialAwayScore={prediction?.predicted_away_score}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  )
}