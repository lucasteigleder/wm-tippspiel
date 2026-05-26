export interface Prediction {
    id: string
    tippspiel_id: string
    match_id: string
    user_id: string
    predicted_home_score: number
    predicted_away_score: number
    created_at: string
    updated_at: string
}