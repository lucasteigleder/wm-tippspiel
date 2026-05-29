import { createSupabaseServerClient } from "@/lib/supabase/server"

export type TippspielInfo = {
  id: string
  tippspiel_id: string
  author_id: string
  title: string
  content: string
  created_at: string
}

export class TippspielInfoRepository {
  static async getByTippspiel(tippspielId: string) {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("tippspiel_infos")
      .select("*")
      .eq("tippspiel_id", tippspielId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data as TippspielInfo[]
  }

  static async create(
    tippspielId: string,
    authorId: string,
    title: string,
    content: string
  ) {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.from("tippspiel_infos").insert({
      tippspiel_id: tippspielId,
      author_id: authorId,
      title,
      content,
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}