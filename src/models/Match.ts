export interface Match {
  id: string
  matchday: number
  home_team: string
  away_team: string
  kickoff_at: string
  home_score: number | null
  away_score: number | null
  created_at: string
}