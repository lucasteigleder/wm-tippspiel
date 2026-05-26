import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { FootballApiService } from "@/services/FootballApiService"

export async function POST(request: Request) {
  const secret = request.headers.get("x-sync-secret")

  if (secret !== process.env.SYNC_SECRET) {
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

  const supabase = await createSupabaseServerClient()
  const fixtures = await FootballApiService.getWorldCupFixtures()

  let updated = 0

  for (const fixture of fixtures) {
    const { error } = await supabase.from("matches").upsert(
      {
        external_api_id: fixture.fixture.id,
        matchday: extractMatchday(fixture.league.round),
        home_team: fixture.teams.home.name,
        away_team: fixture.teams.away.name,
        kickoff_at: fixture.fixture.date,
        home_score: fixture.goals.home,
        away_score: fixture.goals.away,
      },
      {
        onConflict: "external_api_id",
      }
    )

    if (!error) {
      updated++
    }
  }

  return NextResponse.json({
    success: true,
    fixtures: fixtures.length,
    updated,
  })
}

function extractMatchday(round: string): number {
  const match = round.match(/\d+/)
  return match ? Number(match[0]) : 1
}