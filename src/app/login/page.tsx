"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  async function handleRegister() {
    setMessage("")

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Account erstellt. Du bist jetzt eingeloggt.")
    router.push("/dashboard")
    router.refresh()
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

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded border px-4 py-2"
          required
          minLength={6}
        />

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 font-semibold text-white"
        >
          Einloggen
        </button>
      </form>

      <button
        onClick={handleRegister}
        className="mt-3 w-full rounded border px-4 py-2 font-semibold"
      >
        Account erstellen
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  )
}