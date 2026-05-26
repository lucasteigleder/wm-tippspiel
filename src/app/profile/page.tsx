import Link from "next/link"
import { redirect } from "next/navigation"
import { AppHeader } from "@/components/AppHeader"
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
    <>
      <AppHeader />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/dashboard" className="text-sm text-gray-400">
          ← Zurück zum Dashboard
        </Link>

        <h1 className="mt-8 text-3xl font-bold">Profil</h1>

        <form action={updateProfile} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-400">Username</label>
            <input
              name="username"
              defaultValue={profile?.username ?? ""}
              className="mt-2 w-full rounded border px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Anzeigename</label>
            <input
              name="displayName"
              defaultValue={profile?.display_name ?? ""}
              className="mt-2 w-full rounded border px-4 py-2"
            />
          </div>

          <button className="rounded bg-black px-4 py-2 font-semibold text-white">
            Speichern
          </button>
        </form>
      </main>
    </>
  )
}