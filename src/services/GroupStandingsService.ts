import { Match } from "@/models/Match"

export type GroupStanding = {
  team: string
  logo: string | null
  played: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export type GroupStandingsGroup = {
  group: string
  standings: GroupStanding[]
}

export class GroupStandingsService {
  static calculate(matches: Match[]): GroupStandingsGroup[] {
    const groups = new Map<string, Map<string, GroupStanding>>()

    for (const match of matches) {
      const group = extractGroup(match.stage)

      if (!group) {
        continue
      }

      if (!groups.has(group)) {
        groups.set(group, new Map())
      }

      const standings = groups.get(group)!

      ensureTeam(standings, match.home_team, match.home_team_logo)
      ensureTeam(standings, match.away_team, match.away_team_logo)

      if (match.home_score === null || match.away_score === null) {
        continue
      }

      const home = standings.get(match.home_team)!
      const away = standings.get(match.away_team)!

      home.played++
      away.played++

      home.goalsFor += match.home_score
      home.goalsAgainst += match.away_score

      away.goalsFor += match.away_score
      away.goalsAgainst += match.home_score

      home.goalDifference = home.goalsFor - home.goalsAgainst
      away.goalDifference = away.goalsFor - away.goalsAgainst

      if (match.home_score > match.away_score) {
        home.points += 3
      } else if (match.home_score < match.away_score) {
        away.points += 3
      } else {
        home.points += 1
        away.points += 1
      }
    }

    return Array.from(groups.entries())
      .map(([group, standings]) => ({
        group,
        standings: Array.from(standings.values()).sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points
          if (b.goalDifference !== a.goalDifference) {
            return b.goalDifference - a.goalDifference
          }
          return b.goalsFor - a.goalsFor
        }),
      }))
      .sort((a, b) => a.group.localeCompare(b.group))
  }
}

function ensureTeam(
  group: Map<string, GroupStanding>,
  team: string,
  logo: string | null
) {
  if (group.has(team)) return

  group.set(team, {
    team,
    logo,
    played: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  })
}

function extractGroup(stage: string | null) {
  if (!stage) return null

  const match = stage.match(/Group\s+([A-L])/i)

  if (!match) return null

  return match[1].toUpperCase()
}