export function formatMatchDate(dateString: string) {
  return new Date(dateString).toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}