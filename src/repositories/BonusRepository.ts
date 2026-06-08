import { createSupabaseServerClient } from "@/lib/supabase/server"

export class BonusRepository {
  static async getQuestions(tippspielId: string) {
    const supabase = await createSupabaseServerClient()

    const { data } = await supabase
      .from("bonus_questions")
      .select("*")
      .eq("tippspiel_id", tippspielId)
      .order("created_at")

    return data ?? []
  }

  static async getAnswers(userId: string) {
    const supabase = await createSupabaseServerClient()

    const { data } = await supabase
      .from("bonus_answers")
      .select("*")
      .eq("user_id", userId)

    return data ?? []
  }
}