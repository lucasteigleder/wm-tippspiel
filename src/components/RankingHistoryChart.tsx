import { RankingHistoryRow } from "@/services/RankingHistoryService"

type RankingHistoryChartProps = {
  history: RankingHistoryRow[]
}

const colors = [
  "#8b5cf6",
  "#22c55e",
  "#0ea5e9",
  "#f97316",
  "#ef4444",
  "#eab308",
  "#14b8a6",
  "#ec4899",
]

export function RankingHistoryChart({ history }: RankingHistoryChartProps) {
  const players = Array.from(
    new Map(
      history.flatMap((row) =>
        row.rankings.map((ranking) => [ranking.userId, ranking.name])
      )
    ).entries()
  )

  const maxPlacement = Math.max(
    1,
    ...history.flatMap((row) =>
      row.rankings.map((ranking) => ranking.placement)
    )
  )

  const width = 1000
  const height = 520
  const padding = 48

  const xStep =
    history.length > 1
      ? (width - padding * 2) / (history.length - 1)
      : 0

  const yStep =
    maxPlacement > 1
      ? (height - padding * 2) / (maxPlacement - 1)
      : 0

  function getX(index: number) {
    return padding + index * xStep
  }

  function getY(placement: number) {
    return padding + (placement - 1) * yStep
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-xl">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-[900px]"
      >
        {Array.from({ length: maxPlacement }).map((_, index) => (
          <g key={index}>
            <line
              x1={padding}
              x2={width - padding}
              y1={getY(index + 1)}
              y2={getY(index + 1)}
              stroke="rgba(255,255,255,0.08)"
            />
            <text
              x={padding - 20}
              y={getY(index + 1) + 5}
              fill="rgba(255,255,255,0.7)"
              fontSize="14"
              textAnchor="middle"
            >
              {index + 1}
            </text>
          </g>
        ))}

        {history.map((row, index) => (
          <g key={row.stage}>
            <line
              x1={getX(index)}
              x2={getX(index)}
              y1={padding}
              y2={height - padding}
              stroke="rgba(255,255,255,0.06)"
            />
            <text
              x={getX(index)}
              y={28}
              fill="rgba(255,255,255,0.7)"
              fontSize="14"
              textAnchor="middle"
            >
              {index + 1}
            </text>
          </g>
        ))}

        {players.map(([userId, name], playerIndex) => {
          const points = history
            .map((row, index) => {
              const ranking = row.rankings.find(
                (item) => item.userId === userId
              )

              if (!ranking) return null

              return `${getX(index)},${getY(ranking.placement)}`
            })
            .filter(Boolean)
            .join(" ")

          return (
            <polyline
              key={userId}
              points={points}
              fill="none"
              stroke={colors[playerIndex % colors.length]}
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <title>{name}</title>
            </polyline>
          )
        })}
      </svg>
    </div>
  )
}