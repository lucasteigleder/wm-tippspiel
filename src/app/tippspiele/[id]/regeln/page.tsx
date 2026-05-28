import Link from "next/link"
import { AppShell } from "@/components/AppShell"

type RegelnPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function RegelnPage({ params }: RegelnPageProps) {
  const { id } = await params

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <h1 className="mt-8 text-3xl font-bold">Regeln</h1>

      <section className="mt-8 space-y-4">
        <div className="rounded-xl border border-gray-800 p-5">
          <h2 className="text-xl font-semibold">Exaktes Ergebnis</h2>
          <p className="mt-2 text-gray-400">4 Punkte</p>
        </div>

        <div className="rounded-xl border border-gray-800 p-5">
          <h2 className="text-xl font-semibold">Richtige Tordifferenz</h2>
          <p className="mt-2 text-gray-400">3 Punkte</p>
        </div>

        <div className="rounded-xl border border-gray-800 p-5">
          <h2 className="text-xl font-semibold">Richtige Tendenz</h2>
          <p className="mt-2 text-gray-400">2 Punkte</p>
        </div>

        <div className="rounded-xl border border-gray-800 p-5">
          <h2 className="text-xl font-semibold">Falscher Tipp</h2>
          <p className="mt-2 text-gray-400">0 Punkte</p>
        </div>
      </section>
    </AppShell>
  )
}