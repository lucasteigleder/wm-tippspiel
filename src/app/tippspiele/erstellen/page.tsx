import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createTippspiel } from "@/app/dashboard/actions"

export default async function CreateTippspielPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <AppShell>
      <h1 className="text-4xl font-bold">Tippspiel erstellen</h1>
      <p className="mt-2 text-zinc-400">
        Erstelle eine neue private Tipprunde.
      </p>

      <form
        action={createTippspiel}
        className="mt-8 max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl"
      >
        <label className="text-sm text-zinc-400">
          Name des Tippspiels
        </label>

        <input
          name="name"
          placeholder="z. B. WM 2026 Freunde"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3"
          required
        />

        <button className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-950">
          Tippspiel erstellen
        </button>
      </form>
    </AppShell>
  )
}