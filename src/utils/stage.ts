export function formatStageName(stage: string) {
  const normalized = stage.toLowerCase()

  if (normalized.includes("group a")) return "Gruppe A"
  if (normalized.includes("group b")) return "Gruppe B"
  if (normalized.includes("group c")) return "Gruppe C"
  if (normalized.includes("group d")) return "Gruppe D"
  if (normalized.includes("group e")) return "Gruppe E"
  if (normalized.includes("group f")) return "Gruppe F"
  if (normalized.includes("group g")) return "Gruppe G"
  if (normalized.includes("group h")) return "Gruppe H"
  if (normalized.includes("group i")) return "Gruppe I"
  if (normalized.includes("group j")) return "Gruppe J"
  if (normalized.includes("group k")) return "Gruppe K"
  if (normalized.includes("group l")) return "Gruppe L"

  if (normalized.includes("group stage - 1")) return "Spieltag 1"
  if (normalized.includes("group stage - 2")) return "Spieltag 2"
  if (normalized.includes("group stage - 3")) return "Spieltag 3"

  if (normalized.includes("sechzehntelfinale")) return "Sechzehntelfinale"
  if (normalized.includes("round of 32")) return "Sechzehntelfinale"

  if (normalized.includes("achtelfinale")) return "Achtelfinale"
  if (normalized.includes("round of 16")) return "Achtelfinale"

  if (normalized.includes("viertelfinale")) return "Viertelfinale"
  if (normalized.includes("quarter")) return "Viertelfinale"

  if (normalized.includes("halbfinale")) return "Halbfinale"
  if (normalized.includes("semi")) return "Halbfinale"

  if (normalized.includes("spiel um platz 3")) return "Spiel um Platz 3"
  if (normalized.includes("third")) return "Spiel um Platz 3"

  if (normalized === "finale") return "Finale"
  if (normalized === "final") return "Finale"

  return stage
}