import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { joinTippspiel } from "@/app/dashboard/actions"

export default async function JoinTippspielPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <AppShell>
      <h1 className="text-4xl font-bold">Tippspiel beitreten</h1>
      <p className="mt-2 text-zinc-400">
        Gib den Invite Code deiner Tipprunde ein.
      </p>

      <form
        action={joinTippspiel}
        className="mt-8 max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl"
      >
        <label className="text-sm text-zinc-400">
          Invite Code
        </label>

        <input
          name="inviteCode"
          placeholder="WM2026"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 uppercase"
          required
        />

        <button className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-950">
          Beitreten
        </button>
      </form>
    </AppShell>
  )
}