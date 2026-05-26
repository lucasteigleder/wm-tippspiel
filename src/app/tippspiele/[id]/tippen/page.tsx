import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { formatMatchDate } from "@/utils/date"
import { PredictionForm } from "@/components/PredictionForm"
import { PredictionRepository } from "@/repositories/PredictionRepository"

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

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href={`/tippspiele/${id}`} className="text-sm text-gray-400">
        ← Zurück zum Tippspiel
      </Link>

      <h1 className="mt-8 text-3xl font-bold">Tippen</h1>

      <div className="mt-8 grid gap-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="rounded-xl border border-gray-800 p-5"
          >
            <p className="text-sm text-gray-400">
              Spieltag {match.matchday} ·{" "}
            {formatMatchDate(match.kickoff_at)}
            </p>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-semibold">{match.home_team}</span>
              <span className="text-gray-400">vs.</span>
              <span className="font-semibold">{match.away_team}</span>
            </div>
            <PredictionForm
  tippspielId={id}
  matchId={match.id}
  userId={user.id}
  initialHomeScore={
    predictionByMatchId.get(match.id)?.predicted_home_score
  }
  initialAwayScore={
    predictionByMatchId.get(match.id)?.predicted_away_score
  }
  kickoffAt={match.kickoff_at}
/>
          </div>
        ))}
      </div>
    </main>
  )
}