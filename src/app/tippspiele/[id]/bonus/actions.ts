"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveBonusAnswer(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const questionId = formData.get("questionId") as string
  const answer = formData.get("answer") as string

  await supabase
    .from("bonus_answers")
    .upsert(
      {
        question_id: questionId,
        user_id: user.id,
        answer,
      },
      {
        onConflict: "question_id,user_id",
      }
    )

  revalidatePath("/")
}