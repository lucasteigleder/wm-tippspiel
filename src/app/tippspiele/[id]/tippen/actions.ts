"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function savePrediction(formData: FormData) {
  const tippspielId = formData.get("tippspielId")?.toString()
  const matchId = formData.get("matchId")?.toString()
  const homeScore = Number(formData.get("homeScore"))
  const awayScore = Number(formData.get("awayScore"))

  if (!tippspielId || !matchId || Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
    throw new Error("Ungültige Eingabe")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single()

  if (matchError || !match) {
    throw new Error("Spiel nicht gefunden")
  }

  if (new Date(match.kickoff_at).getTime() <= Date.now()) {
    throw new Error("Tippabgabe ist für dieses Spiel geschlossen.")
  }

  const { error } = await supabase.from("predictions").upsert(
    {
      tippspiel_id: tippspielId,
      match_id: matchId,
      user_id: user.id,
      predicted_home_score: homeScore,
      predicted_away_score: awayScore,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "tippspiel_id,match_id,user_id",
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/tippspiele/${tippspielId}/tippen`)
}