export interface Match {
  id: string
  external_api_id: number | null
  matchday: number
  stage: string | null

  home_team_id: number | null
  home_team: string
  home_team_logo: string | null

  away_team_id: number | null
  away_team: string
  away_team_logo: string | null

  kickoff_at: string
  home_score: number | null
  away_score: number | null
  created_at: string
}