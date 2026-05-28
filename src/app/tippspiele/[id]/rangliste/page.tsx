import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { LeaderboardService, LeaderboardEntry } from "@/services/LeaderboardService"
import { ProfileRepository } from "@/repositories/ProfileRepository"
import { AppShell } from "@/components/AppShell"

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

  const matches = await MatchRepository.getAll()
  const predictions = await PredictionRepository.getByTippspiel(id)
  const profiles = await ProfileRepository.getAll()

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

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <h1 className="mt-8 text-3xl font-bold">Rangliste</h1>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">Platz</th>
              <th className="px-4 py-3 text-left">Spieler</th>
              <th className="px-4 py-3 text-right">Punkte</th>
              <th className="px-4 py-3 text-right">Exakt</th>
              <th className="px-4 py-3 text-right">Tendenz</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.userId} className="border-b border-gray-900">
                <td className="px-4 py-3">
                  {getPlacement(leaderboard, index)}
                </td>
                <td className="px-4 py-3">{entry.name}</td>
                <td className="px-4 py-3 text-right font-bold">
                  {entry.points}
                </td>
                <td className="px-4 py-3 text-right">
                  {entry.exactResults}
                </td>
                <td className="px-4 py-3 text-right">
                  {entry.correctTendencies}
                </td>
              </tr>
            ))}

            {leaderboard.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Noch keine Punkte vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}