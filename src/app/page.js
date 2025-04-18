import Link from "next/link"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12 text-center">
        <Link href="/contact">
          <button className="btn-primary">Get Started</button>
        </Link>
      </div>
    </div>
  )
}
