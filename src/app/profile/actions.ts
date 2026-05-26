"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function updateProfile(formData: FormData) {
  const username = formData.get("username")?.toString().trim()
  const displayName = formData.get("displayName")?.toString().trim()

  if (!username) {
    throw new Error("Username fehlt")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      username,
      display_name: displayName || username,
    },
    {
      onConflict: "id",
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")
}