import { Match } from "@/models/Match"
import { Prediction } from "@/models/Prediction"
import { TeamLogo } from "@/components/TeamLogo"
import { formatMatchDate } from "@/utils/date"
import { getCountdownText } from "@/utils/matchStatus"

type PredictionInputsProps = {
  match: Match
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

export function PredictionInputs({
  match,
  prediction,
  isNextMatch = false,
}: PredictionInputsProps) {
  const isPlaceholder = match.is_placeholder
  const isLocked =
    isPlaceholder || new Date(match.kickoff_at).getTime() <= Date.now()

  const hasResult = match.home_score !== null && match.away_score !== null

  return (
    <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl transition hover:border-zinc-600">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          {formatMatchDate(match.kickoff_at)}
        </p>

        {isNextMatch && !isPlaceholder && (
          <span className="rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-400">
            Nächstes Spiel · {getCountdownText(match.kickoff_at)}
          </span>
        )}

        {isPlaceholder && (
          <span className="rounded-xl bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-400">
            Teams noch offen
          </span>
        )}

        {!isPlaceholder && isLocked && (
          <span className="rounded-xl bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-400">
            Gesperrt
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-6">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamBlock logo={match.home_team_logo} name={match.home_team} />

          <input
            name={`homeScore-${match.id}`}
            type="number"
            min="0"
            defaultValue={prediction?.predicted_home_score ?? ""}
            disabled={isLocked || hasResult}
            className="h-11 w-full max-w-24 rounded-xl border border-zinc-500 bg-zinc-950/60 text-center text-lg font-bold outline-none focus:border-white disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col items-center pt-10">
          <div className="flex h-14 min-w-16 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-center text-lg font-black sm:h-auto sm:min-w-20 sm:py-3">
  {hasResult ? `${match.home_score} : ${match.away_score}` : "vs"}
</div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamBlock logo={match.away_team_logo} name={match.away_team} />

          <input
            name={`awayScore-${match.id}`}
            type="number"
            min="0"
            defaultValue={prediction?.predicted_away_score ?? ""}
            disabled={isLocked || hasResult}
            className="h-11 w-full max-w-24 rounded-xl border border-zinc-500 bg-zinc-950/60 text-center text-lg font-bold outline-none focus:border-white disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}