"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { TippspielRepository } from "@/repositories/TippspielRepository"
import { TippspielInfoRepository } from "@/repositories/TippspielInfoRepository"

export async function createInfo(formData: FormData) {
  const tippspielId = formData.get("tippspielId")?.toString()
  const title = formData.get("title")?.toString().trim()
  const content = formData.get("content")?.toString().trim()

  if (!tippspielId || !title || !content) {
    throw new Error("Titel und Nachricht fehlen")
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
    throw new Error("Nur Admins dürfen Infos erstellen")
  }

  await TippspielInfoRepository.create(
    tippspielId,
    user.id,
    title,
    content
  )

  revalidatePath(`/tippspiele/${tippspielId}/infos`)
}