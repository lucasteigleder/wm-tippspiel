import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { LeaderboardService, LeaderboardEntry } from "@/services/LeaderboardService"
import { ProfileRepository } from "@/repositories/ProfileRepository"
import { AppShell } from "@/components/AppShell"
import { MatchPointsService } from "@/services/MatchPointsService"
import { formatMatchDate } from "@/utils/date"
import { TeamLogo } from "@/components/TeamLogo"

type RanglistePageProps = {
  params: Promise<{
    id: string
  }>
}

function getPlacement(leaderboard: LeaderboardEntry[], index: number) {
  if (index === 0) return 1

  const current = leaderboard[index]
  const previous = leaderboard[index - 1]

  if (
    current.points === previous.points &&
    current.exactResults === previous.exactResults &&
    current.correctTendencies === previous.correctTendencies
  ) {
    return getPlacement(leaderboard, index - 1)
  }

  return index + 1
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

  const leaderboard = LeaderboardService.calculate(
    predictions,
    matches,
    userNameById
  )

  const matchPoints = MatchPointsService.calculateForCurrentMatchday(
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
        Punkte & Platzierungen
      </p>

      <h1 className="mt-3 text-4xl font-black">Rangliste</h1>
    </section>

    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {leaderboard.slice(0, 3).map((entry, index) => (
        <div
          key={entry.userId}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
        >
          <p className="text-sm text-zinc-400">Platz {index + 1}</p>
          <h2 className="mt-2 text-2xl font-black">{entry.name}</h2>
          <p className="mt-4 text-4xl font-black">{entry.points}</p>
          <p className="text-sm text-zinc-400">Punkte</p>
        </div>
      ))}
    </section>

    <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-xl">
      <table className="w-full">
        <thead className="border-b border-zinc-800 text-sm text-zinc-400">
          <tr>
            <th className="px-4 py-4 text-left">Platz</th>
            <th className="px-4 py-4 text-left">Spieler</th>
            <th className="px-4 py-4 text-right">Punkte</th>
            <th className="px-4 py-4 text-right">Exakt</th>
            <th className="hidden px-4 py-4 text-right sm:table-cell">Tendenz</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.userId} className="border-b border-zinc-800/70">
              <td className="px-4 py-4 font-bold">
                {getPlacement(leaderboard, index)}
              </td>

              <td className="px-4 py-4">{entry.name}</td>

              <td className="px-4 py-4 text-right font-black">
                {entry.points}
              </td>

              <td className="px-4 py-4 text-right">
                {entry.exactResults}
              </td>

              <td className="hidden px-4 py-4 text-right sm:table-cell">
                {entry.correctTendencies}
              </td>
            </tr>
          ))}

          {leaderboard.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                Noch keine Punkte vorhanden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <section className="mt-10">
      <h2 className="text-2xl font-black">Punkte aktueller Spieltag</h2>

      <div className="mt-5 grid gap-5">
        {matchPoints.map(({ match, entries }) => (
          <div
            key={match.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <p className="text-sm text-zinc-400">
              {formatMatchDate(match.kickoff_at)}
            </p>

            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="flex items-center gap-3">
                <TeamLogo src={match.home_team_logo} alt={match.home_team} />
                <span className="font-bold">{match.home_team}</span>
              </div>

              <span className="rounded-xl bg-zinc-950 px-4 py-2 text-center font-black">
                {match.home_score !== null && match.away_score !== null
                  ? `${match.home_score} : ${match.away_score}`
                  : "offen"}
              </span>

              <div className="flex items-center justify-end gap-3 text-right">
                <span className="font-bold">{match.away_team}</span>
                <TeamLogo src={match.away_team_logo} alt={match.away_team} />
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {entries.map((entry) => (
                <div
                  key={entry.userId}
                  className="flex items-center justify-between rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm"
                >
                  <span className="font-semibold">{entry.name}</span>

                  <span className="text-zinc-400">
                    {entry.predictedHome} : {entry.predictedAway}
                  </span>

                  <span className="font-black">{entry.points} Pkt.</span>
                </div>
              ))}

              {entries.length === 0 && (
                <p className="rounded-2xl bg-zinc-950/70 px-4 py-4 text-sm text-zinc-400">
                  Tipps werden erst nach Anpfiff angezeigt.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  </AppShell>
)
}