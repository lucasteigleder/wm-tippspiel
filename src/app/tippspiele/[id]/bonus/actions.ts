"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBonusQuestion(formData: FormData) {
  const tippspielId = formData.get("tippspielId")?.toString()
  const question = formData.get("question")?.toString().trim()
  const points = Number(formData.get("points"))

  if (!tippspielId || !question || Number.isNaN(points)) {
    throw new Error("Ungültige Eingabe")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const membership = await TippspielRepository.getMembership(tippspielId, user.id)

  if (membership?.role !== "admin") {
    throw new Error("Nur Admins dürfen Bonusfragen erstellen")
  }

  const { error } = await supabase.from("bonus_questions").insert({
    tippspiel_id: tippspielId,
    question,
    points,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/tippspiele/${tippspielId}/bonus`)
}

export async function saveBonusAnswer(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const questionId = formData.get("questionId")?.toString()
  const tippspielId = formData.get("tippspielId")?.toString()
  const answer = formData.get("answer")?.toString().trim()

  if (!questionId || !tippspielId || !answer) {
    throw new Error("Antwort fehlt")
  }

  const { error } = await supabase.from("bonus_answers").upsert(
    {
      question_id: questionId,
      user_id: user.id,
      answer,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "question_id,user_id",
    }
  )

  const lockDate = new Date("2026-06-11T21:00:00+02:00")

if (new Date() >= lockDate) {
  throw new Error("Bonusfragen sind gesperrt.")
}

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/tippspiele/${tippspielId}/bonus`)
}