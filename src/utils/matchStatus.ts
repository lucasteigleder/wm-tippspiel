import { Match } from "@/models/Match"

export function getNextMatch(matches: Match[]) {
  const now = Date.now()

  return matches
    .filter((match) => new Date(match.kickoff_at).getTime() > now)
    .sort(
      (a, b) =>
        new Date(a.kickoff_at).getTime() -
        new Date(b.kickoff_at).getTime()
    )[0]
}

export function getCountdownText(kickoffAt: string) {
  const diff = new Date(kickoffAt).getTime() - Date.now()

  if (diff <= 0) {
    return "Tippabgabe geschlossen"
  }

  const hours = Math.floor(diff / 1000 / 60 / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `Noch ${days} Tage`
  }

  return `Noch ${hours} Stunden`
}