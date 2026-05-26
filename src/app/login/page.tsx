"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Check deine E-Mails für den Login-Link.")
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Einloggen</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border px-4 py-2"
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 font-semibold text-white"
        >
          Login-Link senden
        </button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  )
}