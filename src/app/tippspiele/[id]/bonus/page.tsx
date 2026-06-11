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
import {
  createBonusQuestion,
  saveBonusAnswer,
  saveCorrectBonusAnswer,
} from "./actions"
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

  const bonusLocked =
    new Date() >= new Date("2026-06-11T21:00:00+02:00")

  const [membership, questions, answers, allAnswers, members] =
    await Promise.all([
      TippspielRepository.getMembership(id, user.id),
      BonusRepository.getQuestions(id),
      BonusRepository.getAnswers(user.id),
      bonusLocked
        ? BonusRepository.getAllAnswersByTippspiel(id)
        : Promise.resolve([]),
      TippspielRepository.getMembers(id),
    ])

  const isAdmin = membership?.role === "admin"

  const answerMap = new Map(
    answers.map((answer) => [answer.question_id, answer.answer])
  )

  const userNameById = new Map(
    members.map((member) => [
      member.user_id,
      member.profile?.display_name ??
        member.profile?.username ??
        "Unbekannt",
    ])
  )

  const allAnswersByQuestionId = new Map<string, typeof allAnswers>()

  for (const answer of allAnswers) {
    const questionId = answer.question_id

    if (!allAnswersByQuestionId.has(questionId)) {
      allAnswersByQuestionId.set(questionId, [])
    }

    allAnswersByQuestionId.get(questionId)!.push(answer)
  }

  function getBonusIcon(question: string) {
    const q = question.toLowerCase()

    if (q.includes("weltmeister")) return <Trophy size={22} />
    if (q.includes("meister")) return <Trophy size={22} />
    if (q.includes("deutschland")) return <Trophy size={22} />
    if (q.includes("platz 3")) return <Medal size={22} />
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
        {questions.map((question) => {
          const questionAnswers =
            allAnswersByQuestionId.get(question.id) ?? []

          return (
            <article
              key={question.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white p-3 text-zinc-950">
                  {getBonusIcon(question.question)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-xl font-black">
                      {question.question}
                    </h2>

                    <span className="rounded-xl bg-zinc-950 px-3 py-2 text-sm font-bold text-zinc-300">
                      {question.points} Punkte
                    </span>
                  </div>

                  {bonusLocked ? (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                      🔒 Bonusfragen sind seit dem Anpfiff des
                      Eröffnungsspiels gesperrt.
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-300">
                      ⏳ Bonusfragen können bis zum 11.06.2026, 21:00 Uhr
                      abgegeben oder geändert werden.
                    </div>
                  )}

                  <form action={saveBonusAnswer} className="mt-5">
                    <input
                      type="hidden"
                      name="questionId"
                      value={question.id}
                    />
                    <input type="hidden" name="tippspielId" value={id} />

                    <input
                      name="answer"
                      defaultValue={answerMap.get(question.id) ?? ""}
                      placeholder="Deine Antwort"
                      disabled={bonusLocked}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />

                    <button
                      disabled={bonusLocked}
                      className="mt-4 rounded-xl bg-white px-5 py-2 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Antwort speichern
                    </button>
                  </form>

                  {isAdmin && (
                    <form
                      action={saveCorrectBonusAnswer}
                      className="mt-5 rounded-2xl bg-zinc-950/70 p-4"
                    >
                      <input type="hidden" name="tippspielId" value={id} />
                      <input
                        type="hidden"
                        name="questionId"
                        value={question.id}
                      />

                      <p className="text-sm font-bold text-zinc-300">
                        Richtige Antwort festlegen
                      </p>

                      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <input
                          name="correctAnswer"
                          defaultValue={question.correct_answer ?? ""}
                          placeholder="Richtige Antwort"
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
                          required
                        />

                        <button className="rounded-xl bg-white px-5 py-3 font-bold text-black">
                          Speichern
                        </button>
                      </div>
                    </form>
                  )}

                  {bonusLocked && (
                    <div className="mt-5 rounded-2xl bg-zinc-950/70 p-4">
                      <p className="text-sm font-bold text-zinc-300">
                        Antworten der anderen
                      </p>

                      <div className="mt-3 space-y-2">
                        {questionAnswers.map((answer) => {
                          const name =
                            userNameById.get(answer.user_id) ?? "Unbekannt"

                          return (
                            <div
                              key={answer.id}
                              className="flex items-center justify-between gap-3 rounded-xl bg-zinc-900 px-3 py-2 text-sm"
                            >
                              <span className="font-semibold">{name}</span>
                              <span className="text-zinc-300">
                                {answer.answer}
                              </span>
                            </div>
                          )
                        })}

                        {questionAnswers.length === 0 && (
                          <p className="text-sm text-zinc-500">
                            Noch keine Antworten vorhanden.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}

        {questions.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
            Noch keine Bonusfragen vorhanden.
          </div>
        )}
      </section>
    </AppShell>
  )
}