"use client"

import { useState } from "react"
import { savePrediction } from "@/app/tippspiele/[id]/tippen/actions"

type PredictionFormProps = {
  tippspielId: string
  matchId: string
  kickoffAt: string
  initialHomeScore?: number
  initialAwayScore?: number
  homeSlot: React.ReactNode
  awaySlot: React.ReactNode
  resultSlot: React.ReactNode
}

export function PredictionForm({
  tippspielId,
  matchId,
  kickoffAt,
  initialHomeScore,
  initialAwayScore,
  homeSlot,
  awaySlot,
  resultSlot,
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
  <form action={handleSubmit}>
    <input type="hidden" name="tippspielId" value={tippspielId} />
    <input type="hidden" name="matchId" value={matchId} />

    <div className="mt-6 grid grid-cols-[1fr_56px_1fr] items-start gap-3">
      <div className="flex min-w-0 flex-col items-center gap-3 text-center">
        {homeSlot}

        <input
          name="homeScore"
          type="number"
          min="0"
          defaultValue={initialHomeScore ?? ""}
          className="h-11 w-full max-w-24 rounded-xl border border-zinc-500 bg-zinc-950/60 text-center text-lg font-bold outline-none focus:border-white"
          required
          disabled={isLocked}
        />
      </div>

      <div className="flex flex-col items-center pt-10">
        {resultSlot}
      </div>

      <div className="flex min-w-0 flex-col items-center gap-3 text-center">
        {awaySlot}

        <input
          name="awayScore"
          type="number"
          min="0"
          defaultValue={initialAwayScore ?? ""}
          className="h-11 w-full max-w-24 rounded-xl border border-zinc-500 bg-zinc-950/60 text-center text-lg font-bold outline-none focus:border-white"
          required
          disabled={isLocked}
        />
      </div>
    </div>

    <div className="mt-5 flex justify-center">
      <button
        type="submit"
        disabled={isLocked}
        className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLocked ? "Gesperrt" : "Speichern"}
      </button>
    </div>

    {message && (
      <p className="mt-4 text-center text-sm text-zinc-400">{message}</p>
    )}
  </form>
)
}