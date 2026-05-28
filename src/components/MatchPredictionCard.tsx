import { Match } from "@/models/Match"
import { Prediction } from "@/models/Prediction"
import { PredictionForm } from "@/components/PredictionForm"
import { TeamLogo } from "@/components/TeamLogo"
import { formatMatchDate } from "@/utils/date"
import { getCountdownText } from "@/utils/matchStatus"

type MatchPredictionCardProps = {
  match: Match
  tippspielId: string
  prediction?: Prediction
  isNextMatch?: boolean
}

function TeamBlock({
  logo,
  name,
}: {
  logo: string | null
  name: string
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <TeamLogo src={logo} alt={name} />
      <span className="max-w-full break-words text-center text-sm font-black leading-tight sm:text-lg">
        {name}
      </span>
    </div>
  )
}

export function MatchPredictionCard({
  match,
  tippspielId,
  prediction,
  isNextMatch = false,
}: MatchPredictionCardProps) {
  const hasResult = match.home_score !== null && match.away_score !== null

  const homeSlot = (
    <TeamBlock logo={match.home_team_logo} name={match.home_team} />
  )

  const awaySlot = (
    <TeamBlock logo={match.away_team_logo} name={match.away_team} />
  )

  const resultSlot = (
    <div className="rounded-2xl bg-zinc-950 px-5 py-3 text-center text-lg font-black">
      {hasResult ? `${match.home_score} : ${match.away_score}` : "vs"}
    </div>
  )

  return (
    <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl transition hover:border-zinc-600">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          {formatMatchDate(match.kickoff_at)}
        </p>

        {isNextMatch && (
          <span className="rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-400">
            Nächstes Spiel · {getCountdownText(match.kickoff_at)}
          </span>
        )}

        {hasResult && (
          <span className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
            Beendet
          </span>
        )}
      </div>

      {hasResult ? (
        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {homeSlot}
          {resultSlot}
          {awaySlot}
        </div>
      ) : (
        <PredictionForm
          tippspielId={tippspielId}
          matchId={match.id}
          kickoffAt={match.kickoff_at}
          initialHomeScore={prediction?.predicted_home_score}
          initialAwayScore={prediction?.predicted_away_score}
          homeSlot={homeSlot}
          awaySlot={awaySlot}
          resultSlot={resultSlot}
        />
      )}

      {hasResult && prediction && (
        <p className="mt-6 text-center text-sm text-zinc-400">
          Dein Tipp:{" "}
          <span className="font-semibold text-zinc-200">
            {prediction.predicted_home_score} : {prediction.predicted_away_score}
          </span>
        </p>
      )}
    </div>
  )
}