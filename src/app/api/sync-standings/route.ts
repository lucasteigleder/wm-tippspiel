import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { FootballApiService } from "@/services/FootballApiService"
import { revalidateTag } from "next/cache"

export async function POST(request: Request) {
  const secret = request.headers.get("x-sync-secret")
  const cronSecret = request.headers.get("authorization")
  const expectedCronSecret = `Bearer ${process.env.CRON_SECRET}`

  if (
    secret !== process.env.SYNC_SECRET &&
    cronSecret !== expectedCronSecret
  ) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const leagueId = Number(process.env.FOOTBALL_WORLD_CUP_LEAGUE_ID)
  const season = Number(process.env.FOOTBALL_WORLD_CUP_SEASON)

  const supabase = createSupabaseAdminClient()
  const standingsGroups = await FootballApiService.getWorldCupStandings()

  await supabase
    .from("group_standings")
    .delete()
    .eq("league_id", leagueId)
    .eq("season", season)

  let updated = 0
  const errors: string[] = []

  for (const group of standingsGroups) {
  const groupName = group[0]?.group ?? "Unbekannte Gruppe"

  const isRealGroup = /^Group [A-L]$/.test(groupName)
  const isThirdPlacedRanking = groupName === "Ranking of third-placed teams"

  if (!isRealGroup && !isThirdPlacedRanking) {
    continue
  }

  for (const standing of group) {
    const { error } = await supabase.from("group_standings").upsert(
      {
        league_id: leagueId,
        season,
        group_name: groupName,
        rank: standing.rank,
        team_id: standing.team.id,
        team_name: standing.team.name,
        team_logo: standing.team.logo,
        played: standing.all.played,
        goals_diff: standing.goalsDiff,
        points: standing.points,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "league_id,season,group_name,team_id",
      }
    )

    if (error) {
      errors.push(error.message)
    } else {
      updated++
    }
  }
}

  revalidateTag("group-standings", "max")

  return NextResponse.json({
    success: errors.length === 0,
    groups: standingsGroups.length,
    updated,
    errors,
    sample: standingsGroups[0]?.[0] ?? null,
  })  
}

export async function GET(request: Request) {
  return POST(request)
}