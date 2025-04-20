import Image from "next/image"

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#031626] opacity-90"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-text mb-8">
            ...YOUR PATHWAY
            <br />
            TO TECH EXCELLENCE...
          </h1>

          <div className="relative w-64 h-64 mx-auto my-12">
            <Image
              src="/placeholder.svg?height=256&width=256"
              alt="Globe"
              width={256}
              height={256}
              className="globe-animation"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
