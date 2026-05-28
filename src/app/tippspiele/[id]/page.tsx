import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { CopyInviteButton } from "@/components/CopyInviteButton"
import { AppShell } from "@/components/AppShell"

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

  const members = await TippspielRepository.getMembers(id)

  return (
    <AppShell      tippspielId={tippspiel.id}
      tippspielName={tippspiel.name}
    >
      <Link href="/dashboard" className="text-sm text-gray-400">
        ← Zurück zum Dashboard
      </Link>

      <section className="mt-8">
        <h1 className="text-4xl font-bold">{tippspiel.name}</h1>
        <p className="mt-2 text-gray-400">
          Invite Code: {tippspiel.invite_code}
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href={`/tippspiele/${tippspiel.id}/tippen`}
          className="rounded-xl border border-gray-800 p-6 transition hover:border-gray-500"
        >
          <h2 className="text-xl font-semibold">Tippen</h2>
          <p className="mt-2 text-sm text-gray-400">
            Ergebnisse für Spiele abgeben.
          </p>
        </Link>

        <Link
          href={`/tippspiele/${tippspiel.id}/rangliste`}
          className="rounded-xl border border-gray-800 p-6 transition hover:border-gray-500"
        >
          <h2 className="text-xl font-semibold">Rangliste</h2>
          <p className="mt-2 text-sm text-gray-400">
            Punkte und Platzierungen ansehen.
          </p>
        </Link>

        <Link
          href={`/tippspiele/${tippspiel.id}/regeln`}
          className="rounded-xl border border-gray-800 p-6 transition hover:border-gray-500"
        >
          <h2 className="text-xl font-semibold">Regeln</h2>
          <p className="mt-2 text-sm text-gray-400">
            Punktevergabe und Spielregeln.
          </p>
        </Link>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Mitglieder</h2>
          <CopyInviteButton inviteCode={tippspiel.invite_code} />
        </div>

        <div className="mt-4 grid gap-3">
          {members.map((member, index) => {
            const profile = member.profile

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-gray-800 p-4"
              >
                <div>
                  <p className="font-semibold">
                    {profile?.display_name ?? profile?.username ?? "Unbekannt"}
                  </p>

                  <p className="text-sm text-gray-400">
                    @{profile?.username ?? "unbekannt"}
                  </p>
                </div>

                <span className="rounded bg-gray-800 px-3 py-1 text-sm">
                  {member.role}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}