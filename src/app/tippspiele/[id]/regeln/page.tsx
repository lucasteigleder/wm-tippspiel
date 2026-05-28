import Link from "next/link"
import { AppShell } from "@/components/AppShell"

type RegelnPageProps = {
  params: Promise<{
    id: string
  }>
}

const rules = [
  {
    title: "Exaktes Ergebnis",
    points: "4 Punkte",
    example: "Tipp 2:1 · Ergebnis 2:1",
  },
  {
    title: "Richtige Tordifferenz",
    points: "3 Punkte",
    example: "Tipp 2:0 · Ergebnis 3:1",
  },
  {
    title: "Richtige Tendenz",
    points: "2 Punkte",
    example: "Tipp 1:0 · Ergebnis 3:1",
  },
  {
    title: "Falscher Tipp",
    points: "0 Punkte",
    example: "Tipp 1:0 · Ergebnis 0:2",
  },
]

export default async function RegelnPage({ params }: RegelnPageProps) {
  const { id } = await params

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Punktesystem
        </p>

        <h1 className="mt-3 text-4xl font-black">Regeln</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Für jedes Spiel bekommst du Punkte basierend darauf, wie nah dein Tipp
          am echten Ergebnis liegt.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {rules.map((rule) => (
          <div
            key={rule.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black">{rule.title}</h2>

              <span className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-zinc-950">
                {rule.points}
              </span>
            </div>

            <p className="mt-5 rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300">
              Beispiel: {rule.example}
            </p>
          </div>
        ))}
      </section>
    </AppShell>
  )
}