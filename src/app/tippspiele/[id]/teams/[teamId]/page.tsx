import Link from "next/link"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { TeamLogo } from "@/components/TeamLogo"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { FootballApiService } from "@/services/FootballApiService"
import { formatMatchDate } from "@/utils/date"

type TeamPageProps = {
  params: Promise<{
    id: string
    teamId: string
  }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id, teamId } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const lastFixture = await FootballApiService.getLastTeamFixture(Number(teamId))

  const lineups = lastFixture
    ? await FootballApiService.getFixtureLineups(lastFixture.fixture.id)
    : []

  const teamLineup = lineups.find(
    (lineup) => lineup.team.id === Number(teamId)
  )

  const team =
    lastFixture?.teams.home.id === Number(teamId)
      ? lastFixture.teams.home
      : lastFixture?.teams.away

  const opponent =
    lastFixture?.teams.home.id === Number(teamId)
      ? lastFixture.teams.away
      : lastFixture?.teams.home

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}/tippen`} className="text-sm text-zinc-400">
        ← Zurück zum Tippen
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Team-Info
        </p>

        <div className="mt-3 flex items-center gap-4">
          {team && <TeamLogo src={team.logo} alt={team.name} />}

          <h1 className="text-4xl font-black">
            {team?.name ?? "Team"}
          </h1>
        </div>
      </section>

      {!lastFixture && (
        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-400">
          Für dieses Team wurde noch kein abgeschlossenes Spiel gefunden.
        </div>
      )}

      {lastFixture && (
        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
          <p className="text-sm text-zinc-400">
            Letztes Spiel · {formatMatchDate(lastFixture.fixture.date)}
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex items-center gap-3">
              <TeamLogo
                src={lastFixture.teams.home.logo}
                alt={lastFixture.teams.home.name}
              />
              <span className="font-black">{lastFixture.teams.home.name}</span>
            </div>

            <span className="rounded-2xl bg-zinc-950 px-5 py-3 text-xl font-black">
              {lastFixture.goals.home} : {lastFixture.goals.away}
            </span>

            <div className="flex items-center justify-end gap-3 text-right">
              <span className="font-black">{lastFixture.teams.away.name}</span>
              <TeamLogo
                src={lastFixture.teams.away.logo}
                alt={lastFixture.teams.away.name}
              />
            </div>
          </div>

          {opponent && (
            <p className="mt-5 text-sm text-zinc-400">
              Gegner:{" "}
              <span className="font-bold text-white">{opponent.name}</span>
            </p>
          )}
        </section>
      )}

      {teamLineup && (
        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
          <h2 className="text-2xl font-black">
            Aufstellung {teamLineup.formation && `(${teamLineup.formation})`}
          </h2>

          <div className="mt-5 grid gap-2">
            {teamLineup.startXI.map((item) => (
              <div
                key={item.player.id}
                className="flex items-center justify-between rounded-2xl bg-zinc-950/70 px-4 py-3"
              >
                <span className="font-bold">{item.player.name}</span>
                <span className="text-sm text-zinc-400">
                  {item.player.pos ?? "-"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {lastFixture && !teamLineup && (
        <div className="mt-8 rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
          Für dieses Spiel ist keine Aufstellung verfügbar.
        </div>
      )}
    </AppShell>
  )
}