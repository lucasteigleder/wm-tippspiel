import { unstable_cache } from "next/cache"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { Match } from "@/models/Match"

export class MatchRepository {
  static getAll = unstable_cache(
    async () => {
      const supabase = createSupabaseAdminClient()

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
      tags: ["matches"],
      revalidate: 30,
    }
  )
}