"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type PredictionFormProps = {
  tippspielId: string
  matchId: string
  userId: string
  initialHomeScore?: number
  initialAwayScore?: number
}

export function PredictionForm({
  tippspielId,
  matchId,
  userId,
  initialHomeScore,
  initialAwayScore,
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState(
    initialHomeScore?.toString() ?? ""
  )
  const [awayScore, setAwayScore] = useState(
    initialAwayScore?.toString() ?? ""
  )
  const [message, setMessage] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.from("predictions").upsert(
      {
        tippspiel_id: tippspielId,
        match_id: matchId,
        user_id: userId,
        predicted_home_score: Number(homeScore),
        predicted_away_score: Number(awayScore),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "tippspiel_id,match_id,user_id",
      }
    )

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Gespeichert")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={homeScore}
        onChange={(event) => setHomeScore(event.target.value)}
        className="w-16 rounded border px-2 py-1 text-center"
        required
      />

      <span>:</span>

      <input
        type="number"
        min="0"
        value={awayScore}
        onChange={(event) => setAwayScore(event.target.value)}
        className="w-16 rounded border px-2 py-1 text-center"
        required
      />

      <button
        type="submit"
        className="rounded bg-black px-4 py-1 font-semibold text-white"
      >
        Speichern
      </button>

      {message && <span className="text-sm text-gray-400">{message}</span>}
    </form>
  )
}