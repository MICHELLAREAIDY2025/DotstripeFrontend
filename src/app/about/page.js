import Image from "next/image"

export default function About() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            FOUNDED IN 2009, DOT STRIPE ASSISTS BUSINESSES PROFIT ON THE GROWTH AND POTENTIAL OF INFORMATION TECHNOLOGY.
          </h1>
          <p className="mb-4">
            OUR DIFFERENTIATED INTEGRATED APPROACH AND THE KNOWLEDGE OF LEADING EDGE TECHNOLOGY ARANT US THE ADVANTAGE
            IN PROVIDING YOU WITH STATE OF THE ART PRODUCTS. DOT STRIPE OFFERS A VARIETY OF IT PRODUCTS AND SERVICES FOR
            INDIVIDUAL OR COMPANY NEEDS LOCALLY AND WORLDWIDE.
          </p>
          <p>
            WITH DOT STRIPE AS YOUR TECHNOLOGY PARTNER, YOU CAN RELY ON CUSTOMIZED AND CUSTOMER-FOCUSED INTEGRATED
            SOLUTIONS THAT ALWAYS MATCH YOUR UNIQUE BUSINESS NEEDS.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=600&width=600"
            alt="Technology workspace"
            width={600}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}
