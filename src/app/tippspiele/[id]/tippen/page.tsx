import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { AppShell } from "@/components/AppShell"
import { MatchPredictionCard } from "@/components/MatchPredictionCard"
import { StageAccordion } from "@/components/StageAccordion"
import { getNextMatch } from "@/utils/matchStatus"

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
  const nextMatch = getNextMatch(matches)
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
        {Array.from(matchesByStage.entries()).map(([stage, matches], index) => (
          <StageAccordion
  key={stage}
  title={stage}
  defaultOpen={index === 0}
>
  <div className="grid gap-4">
    {matches.map((match) => (
      <MatchPredictionCard
        key={match.id}
        match={match}
        tippspielId={id}
        prediction={predictionByMatchId.get(match.id)}
        isNextMatch={nextMatch?.id === match.id}
      />
    ))}
  </div>
</StageAccordion>
        ))}
      </div>
    </AppShell>
  )
}