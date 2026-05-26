import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/LogoutButton"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const tippspiele = await TippspielRepository.getAll()

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Eingeloggt als {user.email}
          </p>
        </div>

        <LogoutButton />
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Deine Tippspiele
        </h2>

        <div className="grid gap-4">
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
    </main>
  )
}