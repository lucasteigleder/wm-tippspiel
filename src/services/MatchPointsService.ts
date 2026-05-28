import { Match } from "@/models/Match"
import { Prediction } from "@/models/Prediction"
import { ScoringService } from "@/services/ScoringService"

export type MatchPointsEntry = {
  userId: string
  name: string
  predictedHome: number
  predictedAway: number
  points: number
}

export type MatchPoints = {
  match: Match
  entries: MatchPointsEntry[]
}

export class MatchPointsService {
  static calculateForCurrentMatchday(
    matches: Match[],
    predictions: Prediction[],
    userNameById: Map<string, string>
  ): MatchPoints[] {
    const currentMatchday = getCurrentMatchday(matches)
    const currentMatches = matches.filter(
      (match) => match.matchday === currentMatchday
    )

    return currentMatches.map((match) => {
      const matchPredictions = predictions.filter(
        (prediction) => prediction.match_id === match.id
      )

      const entries = matchPredictions
        .map((prediction) => ({
          userId: prediction.user_id,
          name: userNameById.get(prediction.user_id) ?? "Unbekannt",
          predictedHome: prediction.predicted_home_score,
          predictedAway: prediction.predicted_away_score,
          points: ScoringService.calculatePoints(
            prediction.predicted_home_score,
            prediction.predicted_away_score,
            match.home_score,
            match.away_score
          ),
        }))
        .sort((a, b) => b.points - a.points)

      return {
        match,
        entries,
      }
    })
  }
}

function getCurrentMatchday(matches: Match[]) {
  const now = Date.now()

  const upcoming = matches
    .filter((match) => new Date(match.kickoff_at).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.kickoff_at).getTime() -
        new Date(b.kickoff_at).getTime()
    )

  if (upcoming[0]) {
    return upcoming[0].matchday
  }

  return Math.max(...matches.map((match) => match.matchday))
}