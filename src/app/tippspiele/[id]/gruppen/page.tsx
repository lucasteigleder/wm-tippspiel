import Link from "next/link"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { TeamLogo } from "@/components/TeamLogo"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { GroupStandingsRepository } from "@/repositories/GroupStandingsRepository"

type GruppenPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function GruppenPage({
  params,
}: GruppenPageProps) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const standings = await GroupStandingsRepository.getAll()

  const groups = standings.reduce(
  (acc, standing) => {
    if (!acc[standing.group_name]) {
      acc[standing.group_name] = []
    }

    acc[standing.group_name].push(standing)

    return acc
  },
  {} as Record<string, typeof standings>
)

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <h1 className="mt-8 text-4xl font-bold">Gruppen</h1>

      <div className="mt-8 grid gap-6">
        {Object.entries(groups).map(([groupName, teams]) => (
          <section
            key={groupName}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold">
              {groupName}
            </h2>

            <div className="mt-5">
              <table className="w-full">
                <thead className="border-b border-zinc-800 text-sm text-zinc-400">
                  <tr>
                    <th className="py-3 text-left">#</th>
                    <th className="py-3 text-left">Team</th>
                    <th className="py-3 text-right">Sp.</th>
                    <th className="py-3 text-right">Diff.</th>
                    <th className="py-3 text-right">Pkt.</th>
                  </tr>
                </thead>

                <tbody>
                  {teams.map((team) => (
                    <tr
                      key={team.id}
                      className="border-b border-zinc-800/70"
                    >
                      <td className="py-3 text-sm">
                        {team.rank}
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <TeamLogo
                            src={team.team_logo}
                            alt={team.team_name}
                          />

                          <span className="text-sm font-semibold md:text-base">
                            {team.team_name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 text-right text-sm">
                        {team.played}
                      </td>

                      <td className="py-3 text-right text-sm">
                        {team.goals_diff}
                      </td>

                      <td className="py-3 text-right text-sm font-bold">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  )
}