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

export function MatchPredictionCard({
  match,
  tippspielId,
  prediction,
  isNextMatch = false,
}: MatchPredictionCardProps) {
  const hasResult = match.home_score !== null && match.away_score !== null

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl transition hover:border-zinc-600">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {formatMatchDate(match.kickoff_at)}
        </p>

        {isNextMatch && (
  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
    Nächstes Spiel · {getCountdownText(match.kickoff_at)}
  </span>
)}

        {hasResult && (
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            Beendet
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
        <div className="flex items-center gap-3">
          <TeamLogo src={match.home_team_logo} alt={match.home_team} />
          <span className="font-bold">{match.home_team}</span>
        </div>

        <div className="rounded-2xl bg-zinc-950 px-5 py-3 text-center text-lg font-black">
          {hasResult ? `${match.home_score} : ${match.away_score}` : "vs"}
        </div>

        <div className="flex items-center justify-end gap-3 text-right">
          <span className="font-bold">{match.away_team}</span>
          <TeamLogo src={match.away_team_logo} alt={match.away_team} />
        </div>
      </div>

      {hasResult && prediction && (
        <p className="mt-5 text-sm text-zinc-400">
          Dein Tipp:{" "}
          <span className="font-semibold text-zinc-200">
            {prediction.predicted_home_score} : {prediction.predicted_away_score}
          </span>
        </p>
      )}

      {!hasResult && (
        <div className="mt-5">
          <PredictionForm
            tippspielId={tippspielId}
            matchId={match.id}
            kickoffAt={match.kickoff_at}
            initialHomeScore={prediction?.predicted_home_score}
            initialAwayScore={prediction?.predicted_away_score}
          />
        </div>
      )}
    </div>
  )
}