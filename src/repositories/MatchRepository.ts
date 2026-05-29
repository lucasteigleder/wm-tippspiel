import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Match } from "@/models/Match"
import { unstable_cache } from "next/cache"

export class MatchRepository {
  static getAll = unstable_cache(
    async () => {
      const supabase = await createSupabaseServerClient()

      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("kickoff_at")

      if (error) {
        throw new Error(error.message)
      }

      return data as Match[]
    },
    ["matches"],
    {
      revalidate: 300,
    }
  )
}