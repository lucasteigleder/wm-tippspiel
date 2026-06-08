import { Match } from "@/models/Match"
import { Prediction } from "@/models/Prediction"

export class OpenPredictionsService {
  static getOpenMatches(matches: Match[], predictions: Prediction[]) {
    const predictionMatchIds = new Set(
      predictions.map((prediction) => prediction.match_id)
    )

    return matches
      .filter((match) => !match.is_placeholder)
      .filter((match) => new Date(match.kickoff_at).getTime() > Date.now())
      .filter((match) => !predictionMatchIds.has(match.id))
      .sort(
        (a, b) =>
          new Date(a.kickoff_at).getTime() -
          new Date(b.kickoff_at).getTime()
      )
  }
}