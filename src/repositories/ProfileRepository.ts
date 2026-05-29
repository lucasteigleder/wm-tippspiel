import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Profile } from "@/models/Profile"

export class ProfileRepository {
  static async getAll(): Promise<Profile[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("*")

    if (error) {
      throw new Error(error.message)
    }

    return data as Profile[]
  }

  static async getById(userId: string): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data as Profile | null
}
}