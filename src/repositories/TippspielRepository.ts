import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Tippspiel } from "@/models/Tippspiel"

export class TippspielRepository {
  static async getAll(): Promise<Tippspiel[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("tippspiele")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data as Tippspiel[]
  }
}