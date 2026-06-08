import { Match } from "@/models/Match"
import { Prediction } from "@/models/Prediction"
import { ScoringService } from "@/services/ScoringService"

export type RankingHistoryRow = {
  stage: string
  rankings: {
    userId: string
    name: string
    points: number
    placement: number
  }[]
}

export class RankingHistoryService {
  static calculate(
    matches: Match[],
    predictions: Prediction[],
    userNameById: Map<string, string>
  ): RankingHistoryRow[] {
    const finishedMatches = matches
      .filter((match) => match.home_score !== null && match.away_score !== null)
      .sort(
        (a, b) =>
          new Date(a.kickoff_at).getTime() -
          new Date(b.kickoff_at).getTime()
      )

    const stages = Array.from(
      new Set(finishedMatches.map((match) => match.stage ?? "Unbekannt"))
    )

    const pointsByUser = new Map<string, number>()
    const rows: RankingHistoryRow[] = []

    for (const stage of stages) {
      const stageMatches = finishedMatches.filter(
        (match) => (match.stage ?? "Unbekannt") === stage
      )

      for (const match of stageMatches) {
        const matchPredictions = predictions.filter(
          (prediction) => prediction.match_id === match.id
        )

        for (const prediction of matchPredictions) {
          const points = ScoringService.calculatePoints(
            prediction.predicted_home_score,
            prediction.predicted_away_score,
            match.home_score,
            match.away_score
          )

          pointsByUser.set(
            prediction.user_id,
            (pointsByUser.get(prediction.user_id) ?? 0) + points
          )
        }
      }

      const rankings = Array.from(pointsByUser.entries())
        .map(([userId, points]) => ({
          userId,
          name: userNameById.get(userId) ?? "Unbekannt",
          points,
          placement: 0,
        }))
        .sort((a, b) => b.points - a.points)
        .map((entry, index) => ({
          ...entry,
          placement: index + 1,
        }))

      rows.push({
        stage,
        rankings,
      })
    }

    return rows
  }
}