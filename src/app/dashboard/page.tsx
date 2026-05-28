import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/LogoutButton"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { AppShell } from "@/components/AppShell"
import Link from "next/link"
import { ProfileRepository } from "@/repositories/ProfileRepository"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profiles = await ProfileRepository.getAll()
  const profile = profiles.find((profile) => profile.id === user.id)

  const displayName = 
    profile?.display_name ?? profile?.username ?? user.email

  const tippspiele = await TippspielRepository.getByUser(user.id)

  return (
    <AppShell>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Willkommen zurück, {displayName}!
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Deine Tippspiele
        </h2>

        <div className="grid gap-4">
          <section className="mb-10 grid gap-4 md:grid-cols-2">
</section>
  {tippspiele.map((tippspiel) => (
    <Link
      href={`/tippspiele/${tippspiel.id}`}
      key={tippspiel.id}
      className="rounded-xl border border-gray-800 p-5 transition hover:border-gray-500"
    >
      <h3 className="text-xl font-semibold">
        {tippspiel.name}
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        Invite Code: {tippspiel.invite_code}
      </p>
    </Link>
  ))}
</div>
      </section>
    </AppShell>
  )
}