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

  if (normalized.includes("round of 32")) return "Sechzehntelfinale"
  if (normalized.includes("round of 16")) return "Achtelfinale"
  if (normalized.includes("quarter")) return "Viertelfinale"
  if (normalized.includes("semi")) return "Halbfinale"
  if (normalized.includes("final")) return "Finale"

  return stage
}