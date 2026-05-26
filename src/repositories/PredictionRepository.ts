import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Prediction } from "@/models/Prediction"

export class PredictionRepository {
  static async getByTippspielAndUser(
    tippspielId: string,
    userId: string
  ): Promise<Prediction[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("tippspiel_id", tippspielId)
      .eq("user_id", userId)

    if (error) {
      throw new Error(error.message)
    }

    return data as Prediction[]
  }
    static async getByTippspiel(tippspielId: string): Promise<Prediction[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("tippspiel_id", tippspielId)

    if (error) {
      throw new Error(error.message)
    }

    return data as Prediction[]
  }
}