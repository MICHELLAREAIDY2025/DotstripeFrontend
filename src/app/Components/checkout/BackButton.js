"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-[#18608C] hover:text-[#17A0BF] transition-colors duration-300"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back to Cart
    </button>
  )
}

