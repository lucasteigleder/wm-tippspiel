import Link from "next/link"
import { AppShell } from "@/components/AppShell"

export default function ImpressumPage() {
  return (
    <AppShell>
      <Link href="/dashboard" className="text-sm text-zinc-400">
        ← Zurück zur Startseite
      </Link>

      <section className="mt-8 max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-xl">
        <h1 className="text-4xl font-black">Impressum</h1>

        <div className="mt-8 space-y-6 text-zinc-300">
          <div>
            <h2 className="font-bold text-white">Angaben gemäß § 5 DDG</h2>
            <p className="mt-2">
              Luca Steigleder
              <br />
              Kleewiesenweg, 16
              <br />
              69256 Mauer
              <br />
              Deutschland
            </p>
          </div>

          <div>
            <h2 className="font-bold text-white">Kontakt</h2>
            <p className="mt-2">
              E-Mail: steiglederluca@gmail.com
            </p>
          </div>

          <div>
            <h2 className="font-bold text-white">
              Verantwortlich für den Inhalt
            </h2>
            <p className="mt-2">
              Luca Steigleder
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}