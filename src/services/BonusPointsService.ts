type BonusQuestion = {
  id: string
  points: number
  correct_answer: string | null
}

type BonusAnswer = {
  question_id: string
  user_id: string
  answer: string
}

export class BonusPointsService {
  static calculate(
    questions: BonusQuestion[],
    answers: BonusAnswer[]
  ) {
    const questionById = new Map(
      questions.map((question) => [question.id, question])
    )

    const pointsByUserId = new Map<string, number>()

    for (const answer of answers) {
      const question = questionById.get(answer.question_id)

      if (!question?.correct_answer) {
        continue
      }

      const userAnswer = normalize(answer.answer)
      const correctAnswer = normalize(question.correct_answer)

      if (userAnswer !== correctAnswer) {
        continue
      }

      pointsByUserId.set(
        answer.user_id,
        (pointsByUserId.get(answer.user_id) ?? 0) + question.points
      )
    }

    return pointsByUserId
  }
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}