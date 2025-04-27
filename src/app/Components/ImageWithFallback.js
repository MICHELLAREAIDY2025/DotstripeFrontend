"use client"

import { useState } from "react"
import Image from "next/image"

export default function ImageWithFallback({ src, alt, fallbackColor, ...props }) {
  const [error, setError] = useState(false)

  return (
    <>
      {!error ? (
        <Image src={src || "/placeholder.svg"} alt={alt} {...props} onError={() => setError(true)} />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: fallbackColor || "#18608C" }}
        >
          <span className="text-white/70 text-lg">{alt}</span>
        </div>
      )}
    </>
  )
}
