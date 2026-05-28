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

type ApiFootballResponse = {
  response: ApiFootballFixture[]
}

export class FootballApiService {
  static async getWorldCupFixtures(): Promise<ApiFootballFixture[]> {
    const apiKey = process.env.FOOTBALL_API_KEY
    const apiHost = process.env.FOOTBALL_API_HOST
    const leagueId = process.env.FOOTBALL_WORLD_CUP_LEAGUE_ID
    const season = process.env.FOOTBALL_WORLD_CUP_SEASON

    if (!apiKey || !apiHost || !leagueId || !season) {
      throw new Error("Football API environment variables are missing")
    }

    const url = new URL(`https://${apiHost}/fixtures`)
    url.searchParams.set("league", leagueId)
    url.searchParams.set("season", season)

    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`)
    }

    const json = (await response.json()) as ApiFootballResponse

    return json.response
  }
}