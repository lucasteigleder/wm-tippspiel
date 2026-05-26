import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Match } from "@/models/Match"

export class MatchRepository {
  static async getAll(): Promise<Match[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("kickoff_at", { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return data as Match[]
  }
}