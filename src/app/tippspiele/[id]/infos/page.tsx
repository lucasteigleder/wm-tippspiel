import Link from "next/link"
import { redirect } from "next/navigation"
import { Megaphone } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { TippspielInfoRepository } from "@/repositories/TippspielInfoRepository"
import { createInfo } from "@/app/tippspiele/[id]/infos/actions"

type InfosPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function InfosPage({ params }: InfosPageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const membership = await TippspielRepository.getMembership(id, user.id)
  const isAdmin = membership?.role === "admin"
  const infos = await TippspielInfoRepository.getByTippspiel(id)

  return (
    <AppShell tippspielId={id} tippspielName="WM 2026 Tippspiel">
      <Link href={`/tippspiele/${id}`} className="text-sm text-zinc-400">
        ← Zurück zum Tippspiel
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Nachrichten
        </p>

        <h1 className="mt-3 text-4xl font-black">Infos</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Hier stehen wichtige Nachrichten und Hinweise zu diesem Tippspiel.
        </p>
      </section>

      {isAdmin && (
        <form
          action={createInfo}
          className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
        >
          <input type="hidden" name="tippspielId" value={id} />

          <h2 className="text-2xl font-black">Neue Info erstellen</h2>

          <input
            name="title"
            placeholder="Titel"
            className="mt-5 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            required
          />

          <textarea
            name="content"
            placeholder="Nachricht"
            rows={5}
            className="mt-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            required
          />

          <button className="mt-5 rounded-2xl bg-white px-5 py-3 font-black text-zinc-950 transition hover:bg-zinc-200">
            Veröffentlichen
          </button>
        </form>
      )}

      <section className="mt-8 grid gap-5">
        {infos.map((info) => (
          <article
            key={info.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white p-3 text-zinc-950">
                <Megaphone size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-black">{info.title}</h2>
                <p className="mt-2 whitespace-pre-wrap text-zinc-300">
                  {info.content}
                </p>

                <p className="mt-4 text-sm text-zinc-500">
                  {new Date(info.created_at).toLocaleString("de-DE", {
                    timeZone: "Europe/Berlin",
                  })}
                </p>
              </div>
            </div>
          </article>
        ))}

        {infos.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
            Noch keine Infos vorhanden.
          </div>
        )}
      </section>
    </AppShell>
  )
}