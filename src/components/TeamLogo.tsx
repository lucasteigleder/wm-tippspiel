type TeamLogoProps = {
  src?: string | null
  alt: string
}

export function TeamLogo({ src, alt }: TeamLogoProps) {
  if (!src) {
    return (
      <div className="h-7 w-7 rounded-full bg-zinc-800" />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-7 w-7 rounded-full object-cover"
    />
  )
}