import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Tippspiel } from "@/models/Tippspiel"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export class TippspielRepository {
  static async getByUser(userId: string): Promise<Tippspiel[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("tippspiel_members")
      .select("tippspiele(*)")
      .eq("user_id", userId)

    if (error) {
      throw new Error(error.message)
    }

    return data
      .map((row) => row.tippspiele)
      .filter(Boolean) as unknown as Tippspiel[]
  }

  static async create(name: string, ownerId: string): Promise<Tippspiel> {
    const supabase = createSupabaseAdminClient()
    const inviteCode = createInviteCode()

    const { data: tippspiel, error } = await supabase
      .from("tippspiele")
      .insert({
        name,
        invite_code: inviteCode,
        owner_id: ownerId,
      })
      .select("*")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    await supabase.from("tippspiel_members").insert({
      tippspiel_id: tippspiel.id,
      user_id: ownerId,
      role: "admin",
    })

    return tippspiel as Tippspiel
  }

  static async joinByInviteCode(
    inviteCode: string,
    userId: string
  ): Promise<void> {
    const supabase = await createSupabaseServerClient()

    const { data: tippspiel, error } = await supabase
      .from("tippspiele")
      .select("*")
      .eq("invite_code", inviteCode.toUpperCase())
      .single()

    if (error || !tippspiel) {
      throw new Error("Tippspiel nicht gefunden")
    }

    const { error: memberError } = await supabase
      .from("tippspiel_members")
      .upsert(
        {
          tippspiel_id: tippspiel.id,
          user_id: userId,
          role: "member",
        },
        {
          onConflict: "tippspiel_id,user_id",
        }
      )

    if (memberError) {
      throw new Error(memberError.message)
    }
  }

    static async getMembers(tippspielId: string) {
  const supabase = await createSupabaseServerClient()

  const { data: members, error: membersError } = await supabase
    .from("tippspiel_members")
    .select("user_id, role")
    .eq("tippspiel_id", tippspielId)

  if (membersError) {
    throw new Error(membersError.message)
  }

  const userIds = members.map((member) => member.user_id)

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .in("id", userIds)

  if (profilesError) {
    throw new Error(profilesError.message)
  }

  return members.map((member) => ({
    ...member,
    profile: profiles.find((profile) => profile.id === member.user_id),
  }))
}
}

function createInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}