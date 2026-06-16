import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import {
  LeaderboardService,
  LeaderboardEntry,
} from "@/services/LeaderboardService"
import { AppShell } from "@/components/AppShell"
import { MatchPointsService } from "@/services/MatchPointsService"
import { formatMatchDate } from "@/utils/date"
import { TeamLogo } from "@/components/TeamLogo"
import { BonusRepository } from "@/repositories/BonusRepository"
import { BonusPointsService } from "@/services/BonusPointsService"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { Crown } from "lucide-react"

type RanglistePageProps = {
  params: Promise<{
    id: string
  }>
}

type LeaderboardEntryWithBonus = LeaderboardEntry & {
  bonusPoints: number
}

function getPlacement(leaderboard: LeaderboardEntryWithBonus[], index: number) {
  if (index === 0) return 1

  const current = leaderboard[index]
  const previous = leaderboard[index - 1]

  if (
    current.points === previous.points &&
    current.exactResults === previous.exactResults &&
    current.correctTendencies === previous.correctTendencies &&
    current.bonusPoints === previous.bonusPoints
  ) {
    return getPlacement(leaderboard, index - 1)
  }

  return index + 1
}

function getScoreStatus(match: {
  home_score: number | null
  away_score: number | null
  kickoff_at: string
}) {
  const hasScore = match.home_score !== null && match.away_score !== null
  const hasStarted = new Date(match.kickoff_at).getTime() <= Date.now()

  if (!hasScore) {
    return {
      label: "offen",
      className: "bg-zinc-950 text-white",
    }
  }

  if (hasStarted) {
    return {
      label: `${match.home_score} : ${match.away_score}`,
      className: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    }
  }

  return {
    label: `${match.home_score} : ${match.away_score}`,
    className: "bg-zinc-950 text-white",
  }
}

function getFinishedScoreStatus(match: {
  home_score: number | null
  away_score: number | null
  status_short?: string | null
}) {
  const hasScore = match.home_score !== null && match.away_score !== null

  if (!hasScore) {
    return {
      label: "offen",
      className: "bg-zinc-950 text-white",
    }
  }

  const status = match.status_short ?? ""

  const isFinished = ["FT", "AET", "PEN"].includes(status)
  const isLive = ["1H", "HT", "2H", "ET", "BT", "P"].includes(status)

  if (isFinished) {
    return {
      label: `${match.home_score} : ${match.away_score}`,
      className: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
    }
  }

  if (isLive) {
    return {
      label: `${match.home_score} : ${match.away_score}`,
      className: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    }
  }

  return {
    label: `${match.home_score} : ${match.away_score}`,
    className: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  }
}

export default async function RanglistePage({ params }: RanglistePageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [matches, predictions, members, bonusQuestions, bonusAnswers] =
    await Promise.all([
      MatchRepository.getAll(),
      PredictionRepository.getByTippspiel(id),
      TippspielRepository.getMembers(id),
      BonusRepository.getQuestions(id),
      BonusRepository.getAllAnswersByTippspiel(id),
    ])

  const userNameById = new Map(
    members.map((member) => [
      member.user_id,
      member.profile?.display_name ?? member.profile?.username ?? "Unbekannt",
    ])
  )

  const bonusPointsByUserId = BonusPointsService.calculate(
    bonusQuestions,
    bonusAnswers
  )

  const leaderboard = LeaderboardService.calculate(
    predictions,
    matches,
    userNameById
  )

  const leaderboardWithBonus: LeaderboardEntryWithBonus[] = leaderboard
    .map((entry) => {
      const bonusPoints = bonusPointsByUserId.get(entry.userId) ?? 0

      return {
        ...entry,
        bonusPoints,
        points: entry.points + bonusPoints,
      }
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.exactResults !== a.exactResults) {
        return b.exactResults - a.exactResults
      }
      if (b.correctTendencies !== a.correctTendencies) {
        return b.correctTendencies - a.correctTendencies
      }
      return b.bonusPoints - a.bonusPoints
    })

  const matchPoints = MatchPointsService.calculateForCurrentMatchday(
    matches,
    predictions,
    userNameById,
    user.id
  )
  const visibleMatchPoints = matchPoints
  .map((item) => ({
    ...item,
    kickoffTime: new Date(item.match.kickoff_at).getTime(),
  }))
  .sort((a, b) => a.kickoffTime - b.kickoffTime)

const now = Date.now()

const lastFinishedMatches = visibleMatchPoints
  .filter((item) => item.kickoffTime <= now)
  .slice(-3)

const nextMatches = visibleMatchPoints
  .filter((item) => item.kickoffTime > now)
  .slice(0, 2)

const limitedMatchPoints = [
  ...lastFinishedMatches,
  ...nextMatches,
]

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Punkte & Platzierungen
        </p>

        <h1 className="mt-3 text-4xl font-black">Rangliste</h1>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {leaderboardWithBonus.slice(0, 3).map((entry, index) => {
          const placement = getPlacement(leaderboardWithBonus, index)

          return (
            <div
              key={entry.userId}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
            >
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                {placement === 1 && <Crown className="h-4 w-4 text-yellow-400" />}
                <span>Platz {placement}</span>
              </div>

              {placement === 1 && (
                <Crown className="mt-4 h-9 w-9 text-yellow-400" />
              )}

              <h2 className="mt-3 text-2xl font-black">{entry.name}</h2>

              <p className="mt-4 text-4xl font-black">{entry.points}</p>

              <p className="text-sm text-zinc-400">
                Punkte · {entry.bonusPoints} Bonus
              </p>
            </div>
          )
        })}
      </section>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-xl">
        <table className="w-full">
          <thead className="border-b border-zinc-800 text-sm text-zinc-400">
            <tr>
              <th className="px-3 py-4 text-left md:px-4">Platz</th>
              <th className="px-3 py-4 text-left md:px-4">Spieler</th>
              <th className="px-3 py-4 text-right md:px-4">Punkte</th>
              <th className="hidden px-4 py-4 text-right sm:table-cell">
                Bonus
              </th>
              <th className="px-3 py-4 text-right md:px-4">Exakt</th>
              <th className="hidden px-4 py-4 text-right sm:table-cell">
                Tend.
              </th>
            </tr>
          </thead>

          <tbody>
            {leaderboardWithBonus.map((entry, index) => {
              const placement = getPlacement(leaderboardWithBonus, index)

              return (
                <tr key={entry.userId} className="border-b border-zinc-800/70">
                  <td className="px-3 py-4 font-bold md:px-4">
                    <div className="flex items-center gap-2">
                      {placement === 1 && (
                        <Crown className="h-4 w-4 text-yellow-400" />
                      )}
                      <span>{placement}</span>
                    </div>
                  </td>

                  <td className="px-3 py-4 md:px-4">{entry.name}</td>

                  <td className="px-3 py-4 text-right font-black md:px-4">
                    {entry.points}
                  </td>

                  <td className="hidden px-4 py-4 text-right sm:table-cell">
                    {entry.bonusPoints}
                  </td>

                  <td className="px-3 py-4 text-right md:px-4">
                    {entry.exactResults}
                  </td>

                  <td className="hidden px-4 py-4 text-right sm:table-cell">
                    {entry.correctTendencies}
                  </td>
                </tr>
              )
            })}

            {leaderboardWithBonus.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-zinc-400"
                >
                  Noch keine Punkte vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-black">Letzte & nächste Spiele</h2>

        <div className="mt-5 grid gap-5">
          {limitedMatchPoints.map(({ match, entries }) => {
            const scoreStatus = getFinishedScoreStatus(match)

            return (
              <div
                key={match.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
              >
                <p className="text-sm text-zinc-400">
                  {formatMatchDate(match.kickoff_at)}
                </p>

                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <TeamLogo
                      src={match.home_team_logo}
                      alt={match.home_team}
                    />
                    <span className="min-w-0 break-words text-sm font-bold leading-tight sm:text-base">
  {match.home_team}
</span>
                  </div>

                  <span
  className={`flex min-h-11 min-w-16 items-center justify-center rounded-2xl px-3 py-2 text-center text-base font-black sm:min-w-20 sm:px-4 ${scoreStatus.className}`}
>
  {scoreStatus.label}
</span>

                  <div className="flex min-w-0 items-center justify-end gap-2 text-right sm:gap-3">
                    <span className="min-w-0 break-words text-sm font-bold leading-tight sm:text-base">
  {match.away_team}
</span>
                    <TeamLogo
                      src={match.away_team_logo}
                      alt={match.away_team}
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.userId}
                      className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm"
                    >
                      <span className="font-semibold">{entry.name}</span>

                      <span
  className={`rounded-lg px-3 py-1 font-bold ${
    entry.points >= 4
      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
      : entry.points > 0
        ? "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30"
        : "bg-red-500/10 text-red-400 ring-1 ring-red-500/30"
  }`}
>
  {entry.predictedHome} : {entry.predictedAway}
</span>

                      <span className="font-black">{entry.points} Pkt.</span>
                    </div>
                  ))}

                  {entries.length === 0 && (
                    <p className="rounded-2xl bg-zinc-950/70 px-4 py-4 text-sm text-zinc-400">
                      Noch kein Tipp vorhanden. Andere Tipps werden erst nach
                      Anpfiff angezeigt.
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}