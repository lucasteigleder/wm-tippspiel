import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { FootballApiService } from "@/services/FootballApiService"

export async function POST(request: Request) {
  const secret = request.headers.get("x-sync-secret")
  const cronSecret = request.headers.get("authorization")
  const expectedCronSecret = `Bearer ${process.env.CRON_SECRET}`

  if (
    secret !== process.env.SYNC_SECRET &&
    cronSecret !== expectedCronSecret
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  const supabase = createSupabaseAdminClient()
  const fixtures = await FootballApiService.getWorldCupFixtures()

  let updated = 0
  const errors: string[] = []

  for (const fixture of fixtures) {
    const { error } = await supabase.from("matches").upsert(
      {
        external_api_id: fixture.fixture.id,
        matchday: extractMatchday(fixture.league.round),
        stage: fixture.league.round,

        home_team_id: fixture.teams.home.id,
        home_team: fixture.teams.home.name,
        home_team_logo: fixture.teams.home.logo,

        away_team_id: fixture.teams.away.id,
        away_team: fixture.teams.away.name,
        away_team_logo: fixture.teams.away.logo,

        kickoff_at: fixture.fixture.date,
        home_score: fixture.goals.home,
        away_score: fixture.goals.away,
      },
      {
        onConflict: "external_api_id",
      }
    )

    if (error) {
      errors.push(error.message)
    } else {
      updated++
    }
  }

  // revalidate the "matches" tag for the current path
  const url = new URL(request.url)
  revalidateTag("matches", url.pathname)

  return NextResponse.json({
    success: errors.length === 0,
    fixtures: fixtures.length,
    updated,
    errors,
    sample: fixtures[0] ?? null,
  })
}

function extractMatchday(round: string): number {
  const match = round.match(/\d+/)
  return match ? Number(match[0]) : 1
}