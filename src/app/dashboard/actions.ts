"use server"

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TippspielRepository } from "@/repositories/TippspielRepository"

export async function createTippspiel(formData: FormData) {
  const name = formData.get("name")?.toString()

  if (!name) {
    throw new Error("Name fehlt")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  await TippspielRepository.create(name, user.id)
  redirect("/dashboard")
}

export async function joinTippspiel(formData: FormData) {
  const inviteCode = formData.get("inviteCode")?.toString()

  if (!inviteCode) {
    throw new Error("Invite Code fehlt")
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  await TippspielRepository.joinByInviteCode(inviteCode, user.id)
  redirect("/dashboard")
}