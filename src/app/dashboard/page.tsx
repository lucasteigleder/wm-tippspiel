import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/LogoutButton"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { createTippspiel, joinTippspiel } from "@/app/dashboard/actions"
import { AppShell } from "@/components/AppShell"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const tippspiele = await TippspielRepository.getByUser(user.id)

  return (
    <AppShell>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Eingeloggt als {user.email}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Deine Tippspiele
        </h2>

        <div className="grid gap-4">
          <section className="mb-10 grid gap-4 md:grid-cols-2">
  <form action={createTippspiel} className="rounded-xl border border-gray-800 p-5">
    <h2 className="text-xl font-semibold">Tippspiel erstellen</h2>

    <input
      name="name"
      placeholder="Name des Tippspiels"
      className="mt-4 w-full rounded border px-4 py-2"
      required
    />

    <button className="mt-4 rounded bg-black px-4 py-2 font-semibold text-white">
      Erstellen
    </button>
  </form>

  <form action={joinTippspiel} className="rounded-xl border border-gray-800 p-5">
    <h2 className="text-xl font-semibold">Tippspiel beitreten</h2>

    <input
      name="inviteCode"
      placeholder="Invite Code"
      className="mt-4 w-full rounded border px-4 py-2 uppercase"
      required
    />

    <button className="mt-4 rounded bg-black px-4 py-2 font-semibold text-white">
      Beitreten
    </button>
  </form>
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