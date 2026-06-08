import { createSupabaseServerClient } from "@/lib/supabase/server"

export class BonusRepository {
  static async getQuestions(tippspielId: string) {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("bonus_questions")
      .select("*")
      .eq("tippspiel_id", tippspielId)
      .order("created_at")

    if (error) {
      throw new Error(error.message)
    }

    return data ?? []
  }

  static async getAnswers(userId: string) {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("bonus_answers")
      .select("*")
      .eq("user_id", userId)

    if (error) {
      throw new Error(error.message)
    }

    return data ?? []
  }

  static async getAllAnswersByTippspiel(tippspielId: string) {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("bonus_answers")
      .select(`
        *,
        bonus_questions!inner (
          id,
          tippspiel_id
        ),
        profiles (
          username,
          display_name
        )
      `)
      .eq("bonus_questions.tippspiel_id", tippspielId)

    if (error) {
      throw new Error(error.message)
    }

    return data ?? []
  }
}