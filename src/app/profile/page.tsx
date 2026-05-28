import Link from "next/link"
import { redirect } from "next/navigation"
import { UserCircle } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { updateProfile } from "@/app/profile/actions"

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <AppShell>
      <Link href="/dashboard" className="text-sm text-zinc-400">
        ← Zurück zur Startseite
      </Link>

      <section className="mt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Konto
        </p>

        <h1 className="mt-3 text-4xl font-black">Profil bearbeiten</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Dein Anzeigename wird in Ranglisten, Tippspielen und Mitgliederlisten verwendet.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-zinc-950">
            <UserCircle size={44} />
          </div>

          <h2 className="mt-5 text-2xl font-black">
            {profile?.display_name ?? profile?.username ?? "Neuer User"}
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {user.email}
          </p>
        </div>

        <form
          action={updateProfile}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
        >
          <div>
            <label className="text-sm font-medium text-zinc-400">
              Username
            </label>

            <input
              name="username"
              defaultValue={profile?.username ?? ""}
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
              required
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-zinc-400">
              Anzeigename
            </label>

            <input
              name="displayName"
              defaultValue={profile?.display_name ?? ""}
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <button className="mt-6 rounded-2xl bg-white px-5 py-3 font-black text-zinc-950 transition hover:bg-zinc-200">
            Profil speichern
          </button>
        </form>
      </section>
    </AppShell>
  )
}