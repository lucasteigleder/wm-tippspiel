import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MatchRepository } from "@/repositories/MatchRepository"
import { PredictionRepository } from "@/repositories/PredictionRepository"
import { LeaderboardService } from "@/services/LeaderboardService"

type RanglistePageProps = {
  params: Promise<{
    id: string
  }>
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

  const userEmailById = new Map<string, string>([
    [user.id, user.email ?? "Unbekannt"],
  ])

  const leaderboard = LeaderboardService.calculate(
    predictions,
    matches,
    userEmailById
  )

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href={`/tippspiele/${id}`} className="text-sm text-gray-400">
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
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.userId} className="border-b border-gray-900">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{entry.email}</td>
                <td className="px-4 py-3 text-right font-bold">
                  {entry.points}
                </td>
              </tr>
            ))}

            {leaderboard.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  Noch keine Punkte vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}