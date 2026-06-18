export type ApiFootballFixture = {
  fixture: {
    id: number
    date: string
    status: {
      short: string
    }
  }
  league: {
    round: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
}

export type ApiFootballStandingTeam = {
  rank: number
  group: string
  team: {
    id: number
    name: string
    logo: string
  }
  points: number
  goalsDiff: number
  all: {
    played: number
  }
}

export type ApiFootballLineup = {
  team: {
    id: number
    name: string
    logo: string
  }
  formation: string | null
  startXI: {
    player: {
      id: number
      name: string
      number: number | null
      pos: string | null
    }
  }[]
  substitutes: {
    player: {
      id: number
      name: string
      number: number | null
      pos: string | null
    }
  }[]
}

type ApiFootballStandingsResponse = {
  response: {
    league: {
      id: number
      season: number
      standings: ApiFootballStandingTeam[][]
    }
  }[]
}

type ApiFootballFixturesResponse = {
  response: ApiFootballFixture[]
}

type ApiFootballLineupsResponse = {
  response: ApiFootballLineup[]
}

function getFootballApiConfig() {
  const apiKey = process.env.FOOTBALL_API_KEY
  const apiHost = process.env.FOOTBALL_API_HOST
  const leagueId = process.env.FOOTBALL_WORLD_CUP_LEAGUE_ID
  const season = process.env.FOOTBALL_WORLD_CUP_SEASON

  if (!apiKey || !apiHost || !leagueId || !season) {
    throw new Error("Football API environment variables are missing")
  }

  return {
    apiKey,
    apiHost,
    leagueId,
    season,
  }
}

async function fetchFootballApi<T>(path: string, params: Record<string, string>) {
  const { apiKey, apiHost } = getFootballApiConfig()

  const url = new URL(`https://${apiHost}/${path}`)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": apiKey,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Football API error: ${response.status}`)
  }

  return (await response.json()) as T
}

export class FootballApiService {
  static async getWorldCupFixtures(): Promise<ApiFootballFixture[]> {
    const { leagueId, season } = getFootballApiConfig()

    const json = await fetchFootballApi<ApiFootballFixturesResponse>(
      "fixtures",
      {
        league: leagueId,
        season,
      }
    )

    return json.response
  }

  static async getWorldCupStandings(): Promise<ApiFootballStandingTeam[][]> {
    const { leagueId, season } = getFootballApiConfig()

    const json = await fetchFootballApi<ApiFootballStandingsResponse>(
      "standings",
      {
        league: leagueId,
        season,
      }
    )

    return json.response[0]?.league.standings ?? []
  }

  static async getTeamFixtures(teamId: number): Promise<ApiFootballFixture[]> {
    const { leagueId, season } = getFootballApiConfig()

    const json = await fetchFootballApi<ApiFootballFixturesResponse>(
      "fixtures",
      {
        league: leagueId,
        season,
        team: String(teamId),
      }
    )

    return json.response
  }

  static async getLastTeamFixture(
    teamId: number
  ): Promise<ApiFootballFixture | null> {
    const fixtures = await this.getTeamFixtures(teamId)

    const finishedFixtures = fixtures
      .filter((fixture) =>
        ["FT", "AET", "PEN"].includes(fixture.fixture.status.short)
      )
      .sort(
        (a, b) =>
          new Date(b.fixture.date).getTime() -
          new Date(a.fixture.date).getTime()
      )

    return finishedFixtures[0] ?? null
  }

  static async getFixtureLineups(
    fixtureId: number
  ): Promise<ApiFootballLineup[]> {
    const json = await fetchFootballApi<ApiFootballLineupsResponse>(
      "fixtures/lineups",
      {
        fixture: String(fixtureId),
      }
    )

    return json.response
  }
}