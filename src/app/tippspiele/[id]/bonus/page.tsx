import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Gift,
  Trophy,
  Goal,
  Shield,
  User,
  Medal,
} from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { BonusRepository } from "@/repositories/BonusRepository"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { createBonusQuestion, saveBonusAnswer } from "./actions"
import { AppShell } from "@/components/AppShell"

export default async function BonusPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [membership, questions, answers] = await Promise.all([
    TippspielRepository.getMembership(id, user.id),
    BonusRepository.getQuestions(id),
    BonusRepository.getAnswers(user.id),
  ])

const bonusLocked =
  new Date() >= new Date("2026-06-11T21:00:00+02:00")

  const isAdmin = membership?.role === "admin"

  const answerMap = new Map(
    answers.map((answer) => [answer.question_id, answer.answer])
  )

  function getBonusIcon(question: string) {
  const q = question.toLowerCase()

  if (q.includes("weltmeister")) return <Trophy size={22} />
  if (q.includes("meister")) return <Trophy size={22} />
   if (q.includes("deutschland")) return <Trophy size={22} />
  if (q.includes("tore")) return <Goal size={22} />
  if (q.includes("tor")) return <Goal size={22} />
  if (q.includes("spieler")) return <User size={22} />
  if (q.includes("gegentore")) return <Shield size={22} />

  return <Gift size={22} />
}

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Zusatzpunkte
        </p>

        <h1 className="mt-3 text-4xl font-black">Bonusfragen</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Beantworte Bonusfragen vor Turnierbeginn und sammle zusätzliche
          Punkte für die Rangliste.
        </p>
      </section>

      {isAdmin && (
        <form
          action={createBonusQuestion}
          className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
        >
          <input type="hidden" name="tippspielId" value={id} />

          <h2 className="text-2xl font-black">Bonusfrage erstellen</h2>

          <input
            name="question"
            placeholder="z. B. Wer wird Weltmeister?"
            className="mt-5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            required
          />

          <input
            name="points"
            type="number"
            min="1"
            defaultValue={10}
            className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            required
          />

          <button className="mt-5 rounded-xl bg-white px-5 py-3 font-bold text-black transition hover:bg-zinc-200">
            Frage erstellen
          </button>
        </form>
      )}

      <section className="mt-8 space-y-5">
        {questions.map((question) => (
          <form
            key={question.id}
            action={saveBonusAnswer}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <input type="hidden" name="questionId" value={question.id} />
            <input type="hidden" name="tippspielId" value={id} />

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white p-3 text-zinc-950">
                <Gift size={22} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-xl font-black">{question.question}</h2>

                  <span className="rounded-xl bg-zinc-950 px-3 py-2 text-sm font-bold text-zinc-300">
                    {question.points} Punkte
                  </span>
                </div>

{bonusLocked ? (
  <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
    🔒 Bonusfragen sind seit dem Anpfiff des Eröffnungsspiels gesperrt.
  </div>
) : (
  <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-300">
    ⏳ Bonusfragen können bis zum 11.06.2026, 21:00 Uhr abgegeben oder geändert werden.
  </div>
)}

                <input
                  name="answer"
                  defaultValue={answerMap.get(question.id) ?? ""}
                  placeholder="Deine Antwort"
                  disabled={bonusLocked}
                  className="mt-5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
                  required
                />

                <button 
                    disabled={bonusLocked}
                className="mt-4 rounded-xl bg-white px-5 py-2 font-bold text-black transition hover:bg-zinc-200">
                  Antwort speichern
                </button>
              </div>
            </div>
          </form>
        ))}

        {questions.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
            Noch keine Bonusfragen vorhanden.
          </div>
        )}
      </section>
    </AppShell>
  )
}