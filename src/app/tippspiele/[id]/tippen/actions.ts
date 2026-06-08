"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function savePredictions(formData: FormData) {
  const tippspielId = formData.get("tippspielId")?.toString()

  if (!tippspielId) {
    throw new Error("Tippspiel fehlt")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const predictions = []

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("homeScore-")) {
      continue
    }

    const matchId = key.replace("homeScore-", "")
    const homeValue = value.toString()
const awayValue = formData.get(`awayScore-${matchId}`)?.toString()

if (homeValue === "" || !awayValue || awayValue === "") {
  continue
}

const homeScore = Number(homeValue)
const awayScore = Number(awayValue)

if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
  continue
}

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select("id,kickoff_at")
      .eq("id", matchId)
      .single()

    if (matchError || !match) {
      continue
    }

    if (new Date(match.kickoff_at).getTime() <= Date.now()) {
      continue
    }

    predictions.push({
      tippspiel_id: tippspielId,
      match_id: matchId,
      user_id: user.id,
      predicted_home_score: homeScore,
      predicted_away_score: awayScore,
      updated_at: new Date().toISOString(),
    })
  }

  if (predictions.length > 0) {
    const { error } = await supabase.from("predictions").upsert(predictions, {
      onConflict: "tippspiel_id,match_id,user_id",
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  revalidatePath(`/tippspiele/${tippspielId}/tippen`)
}