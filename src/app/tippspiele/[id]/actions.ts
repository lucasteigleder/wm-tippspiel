"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { TippspielRepository } from "@/repositories/TippspielRepository"

export async function removeMember(formData: FormData) {
  const tippspielId = formData.get("tippspielId")?.toString()
  const memberId = formData.get("memberId")?.toString()

  if (!tippspielId || !memberId) {
    throw new Error("Daten fehlen")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const membership = await TippspielRepository.getMembership(
    tippspielId,
    user.id
  )

  if (membership?.role !== "admin") {
    throw new Error("Nur Admins dürfen Mitglieder entfernen")
  }

  if (memberId === user.id) {
    throw new Error("Du kannst dich nicht selbst entfernen")
  }

  const adminSupabase = createSupabaseAdminClient()

  const { error } = await adminSupabase
    .from("tippspiel_members")
    .delete()
    .eq("tippspiel_id", tippspielId)
    .eq("user_id", memberId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/tippspiele/${tippspielId}`)
}