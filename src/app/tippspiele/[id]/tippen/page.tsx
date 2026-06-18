import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { AppShell } from "@/components/AppShell"
import { PredictionInputs } from "@/components/PredictionInputs"
import { savePredictions } from "@/app/tippspiele/[id]/tippen/actions"
import { StageAccordion } from "@/components/StageAccordion"
import { getNextMatch } from "@/utils/matchStatus"
import { formatStageName } from "@/utils/stage"

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

  const [matches, predictions] = await Promise.all([
  MatchRepository.getAll(),
  PredictionRepository.getByTippspielAndUser(id, user.id),
])

  const nextMatch = getNextMatch(matches)

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
  title={formatStageName(stage)}
  defaultOpen={index === 0}
>
  <form action={savePredictions}>
  <input type="hidden" name="tippspielId" value={id} />

  <div className="grid gap-4">
    {matches.map((match) => (
      <PredictionInputs
        key={match.id}
        match={match}
        prediction={predictionByMatchId.get(match.id)}
        isNextMatch={nextMatch?.id === match.id}
        tippspielId={id}
      />
    ))}
  </div>

  <div className="sticky bottom-4 mt-5 flex justify-center">
    <button className="rounded-2xl bg-white px-6 py-3 font-black text-zinc-950 shadow-2xl transition hover:bg-zinc-200">
      Alle Tipps speichern
    </button>
  </div>
</form>
</StageAccordion>
        ))}
      </div>
    </AppShell>
  )
}