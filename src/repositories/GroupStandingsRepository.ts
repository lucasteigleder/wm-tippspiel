import { createSupabaseServerClient } from "@/lib/supabase/server"

export type GroupStandingRow = {
  id: string
  league_id: number
  season: number
  group_name: string
  rank: number
  team_id: number
  team_name: string
  team_logo: string | null
  played: number
  goals_diff: number
  points: number
}

export class GroupStandingsRepository {
  static async getAll() {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("group_standings")
      .select("*")
      .order("group_name")
      .order("rank")

    if (error) {
      throw new Error(error.message)
    }

    return data as GroupStandingRow[]
  }
}