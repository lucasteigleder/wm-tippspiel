import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { BonusRepository } from "@/repositories/BonusRepository"
import { saveBonusAnswer } from "./actions"
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

  const questions = await BonusRepository.getQuestions(id)
  const answers = await BonusRepository.getAnswers(user.id)

  const answerMap = new Map(
    answers.map((a) => [a.question_id, a.answer])
  )

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <h1 className="mb-8 text-4xl font-bold">
        Bonusfragen
      </h1>

      <div className="space-y-5">
        {questions.map((question) => (
          <form
            key={question.id}
            action={saveBonusAnswer}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6"
          >
            <input
              type="hidden"
              name="questionId"
              value={question.id}
            />

            <p className="font-bold text-xl">
              {question.question}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {question.points} Punkte
            </p>

            <input
              name="answer"
              defaultValue={answerMap.get(question.id) ?? ""}
              className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3"
            />

            <button className="mt-4 rounded-xl bg-white px-5 py-2 font-bold text-black">
              Speichern
            </button>
          </form>
        ))}
      </div>
    </AppShell>
  )
}