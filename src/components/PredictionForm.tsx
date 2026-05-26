"use client"

import { useState } from "react"
import { savePrediction } from "@/app/tippspiele/[id]/tippen/actions"

type PredictionFormProps = {
  tippspielId: string
  matchId: string
  kickoffAt: string
  initialHomeScore?: number
  initialAwayScore?: number
}

export function PredictionForm({
  tippspielId,
  matchId,
  kickoffAt,
  initialHomeScore,
  initialAwayScore,
}: PredictionFormProps) {
  const isLocked = new Date(kickoffAt).getTime() <= Date.now()

  const [message, setMessage] = useState("")

  async function handleSubmit(formData: FormData) {
    setMessage("")

    try {
      await savePrediction(formData)
      setMessage("Gespeichert")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Fehler beim Speichern")
    }
  }

  return (
    <form action={handleSubmit} className="mt-4 flex items-center gap-2">
      <input type="hidden" name="tippspielId" value={tippspielId} />
      <input type="hidden" name="matchId" value={matchId} />

      <input
        name="homeScore"
        type="number"
        min="0"
        defaultValue={initialHomeScore ?? ""}
        className="w-16 rounded border px-2 py-1 text-center"
        required
        disabled={isLocked}
      />

      <span>:</span>

      <input
        name="awayScore"
        type="number"
        min="0"
        defaultValue={initialAwayScore ?? ""}
        className="w-16 rounded border px-2 py-1 text-center"
        required
        disabled={isLocked}
      />

      <button
        type="submit"
        disabled={isLocked}
        className="rounded bg-black px-4 py-1 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLocked ? "Gesperrt" : "Speichern"}
      </button>

      {message && <span className="text-sm text-gray-400">{message}</span>}
    </form>
  )
}