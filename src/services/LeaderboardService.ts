import { Prediction } from "@/models/Prediction"
import { Match } from "@/models/Match"
import { ScoringService } from "@/services/ScoringService"

export type LeaderboardEntry = {
  userId: string
  email: string
  points: number
}

type PredictionWithUser = Prediction & {
  profiles?: {
    username: string | null
  } | null
  user_email?: string
}

export class LeaderboardService {
  static calculate(
    predictions: Prediction[],
    matches: Match[],
    userEmailById: Map<string, string>
  ): LeaderboardEntry[] {
    const matchById = new Map(matches.map((match) => [match.id, match]))
    const pointsByUser = new Map<string, number>()

    for (const prediction of predictions) {
      const match = matchById.get(prediction.match_id)

      if (!match) {
        continue
      }

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

    return Array.from(pointsByUser.entries())
      .map(([userId, points]) => ({
        userId,
        email: userEmailById.get(userId) ?? "Unbekannt",
        points,
      }))
      .sort((a, b) => b.points - a.points)
  }
}