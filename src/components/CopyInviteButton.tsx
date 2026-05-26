"use client"

import { useState } from "react"

type CopyInviteButtonProps = {
  inviteCode: string
}

export function CopyInviteButton({ inviteCode }: CopyInviteButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded border border-gray-700 px-3 py-2 text-sm"
    >
      {copied ? "Kopiert" : "Invite Code kopieren"}
    </button>
  )
}