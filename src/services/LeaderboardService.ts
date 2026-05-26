import { Prediction } from "@/models/Prediction"
import { Match } from "@/models/Match"

export type LeaderboardEntry = {
  userId: string
  name: string
  points: number
  exactResults: number
  correctTendencies: number
}

export class LeaderboardService {
  static calculate(
    predictions: Prediction[],
    matches: Match[],
    userNameById: Map<string, string>
  ): LeaderboardEntry[] {
    const matchById = new Map(matches.map((match) => [match.id, match]))

    const leaderboard = new Map<string, LeaderboardEntry>()

    for (const prediction of predictions) {
      const match = matchById.get(prediction.match_id)

      if (!match) {
        continue
      }

      if (
        match.home_score === null ||
        match.away_score === null
      ) {
        continue
      }

      const current =
        leaderboard.get(prediction.user_id) ?? {
          userId: prediction.user_id,
          name:
            userNameById.get(prediction.user_id) ??
            "Unbekannt",
          points: 0,
          exactResults: 0,
          correctTendencies: 0,
        }

      const isExact =
        prediction.predicted_home_score ===
          match.home_score &&
        prediction.predicted_away_score ===
          match.away_score

      const predictedDiff =
        prediction.predicted_home_score -
        prediction.predicted_away_score

      const actualDiff =
        match.home_score - match.away_score

      const sameTendency =
        Math.sign(predictedDiff) ===
        Math.sign(actualDiff)

      if (isExact) {
        current.points += 4
        current.exactResults += 1
      } else if (predictedDiff === actualDiff) {
        current.points += 3
      } else if (sameTendency) {
        current.points += 2
        current.correctTendencies += 1
      }

      leaderboard.set(prediction.user_id, current)
    }

    return Array.from(leaderboard.values()).sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points
      }

      if (b.exactResults !== a.exactResults) {
        return b.exactResults - a.exactResults
      }

      return b.correctTendencies - a.correctTendencies
    })
  }
}