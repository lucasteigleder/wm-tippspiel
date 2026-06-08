import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { CopyInviteButton } from "@/components/CopyInviteButton"
import { AppShell } from "@/components/AppShell"
import { removeMember } from "@/app/tippspiele/[id]/actions"

type TippspielPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function TippspielPage({ params }: TippspielPageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: tippspiel, error } = await supabase
    .from("tippspiele")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !tippspiel) {
    redirect("/dashboard")
  }

  const [members, membership] = await Promise.all([
    TippspielRepository.getMembers(id),
    TippspielRepository.getMembership(id, user.id),
  ])

  const isAdmin = membership?.role === "admin"

  return (
    <AppShell tippspielId={tippspiel.id} tippspielName={tippspiel.name}>
      <Link href="/dashboard" className="text-sm text-zinc-400">
        ← Zurück zum Dashboard
      </Link>

      <section className="mt-8">
        <h1 className="text-4xl font-black">{tippspiel.name}</h1>

        {isAdmin && (
          <p className="mt-2 text-zinc-400">
            Invite Code: {tippspiel.invite_code}
          </p>
        )}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href={`/tippspiele/${tippspiel.id}/tippen`}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl transition hover:border-zinc-500"
        >
          <h2 className="text-xl font-black">Tippen</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Ergebnisse für Spiele abgeben.
          </p>
        </Link>

        <Link
          href={`/tippspiele/${tippspiel.id}/rangliste`}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl transition hover:border-zinc-500"
        >
          <h2 className="text-xl font-black">Rangliste</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Punkte und Platzierungen ansehen.
          </p>
        </Link>

        <Link
          href={`/tippspiele/${tippspiel.id}/regeln`}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl transition hover:border-zinc-500"
        >
          <h2 className="text-xl font-black">Regeln</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Punktevergabe und Spielregeln.
          </p>
        </Link>
      </section>

      {isAdmin && (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Mitglieder</h2>
            <CopyInviteButton inviteCode={tippspiel.invite_code} />
          </div>

          <div className="mt-4 grid gap-3">
            {members.map((member, index) => {
              const profile = member.profile
              const memberId = member.user_id ?? profile?.id

              return (
                <div
                  key={memberId ?? index}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-xl"
                >
                  <div>
                    <p className="font-bold">
                      {profile?.display_name ??
                        profile?.username ??
                        "Unbekannt"}
                    </p>

                    <p className="text-sm text-zinc-400">
                      @{profile?.username ?? "unbekannt"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-bold">
                      {member.role}
                    </span>

                    {memberId && memberId !== user.id && (
                      <form action={removeMember}>
                        <input
                          type="hidden"
                          name="tippspielId"
                          value={tippspiel.id}
                        />

                        <input
                          type="hidden"
                          name="memberId"
                          value={memberId}
                        />

                        <button className="rounded-xl border border-red-500/30 px-3 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/10">
                          Entfernen
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </AppShell>
  )
}