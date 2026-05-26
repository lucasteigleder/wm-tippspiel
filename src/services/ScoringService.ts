export class ScoringService {
  static calculatePoints(
    predictedHome: number,
    predictedAway: number,
    actualHome: number | null,
    actualAway: number | null
  ): number {
    if (actualHome === null || actualAway === null) {
      return 0
    }

    if (predictedHome === actualHome && predictedAway === actualAway) {
      return 4
    }

    const predictedDiff = predictedHome - predictedAway
    const actualDiff = actualHome - actualAway

    if (predictedDiff === actualDiff) {
      return 3
    }

    const predictedWinner = Math.sign(predictedDiff)
    const actualWinner = Math.sign(actualDiff)

    if (predictedWinner === actualWinner) {
      return 2
    }

    return 0
  }
}