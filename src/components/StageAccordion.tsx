"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type StageAccordionProps = {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function StageAccordion({
  title,
  defaultOpen = false,
  children,
}: StageAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <h2 className="text-2xl font-bold">{title}</h2>

        <ChevronDown
          size={22}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-zinc-800 p-5">
          {children}
        </div>
      )}
    </section>
  )
}