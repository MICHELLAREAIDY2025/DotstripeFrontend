import Image from "next/image"
import Link from "next/link"

export default function WhatWeDoPage() {
  // Service offerings data
  const services = [
    {
      name: "IT Consultancy",
      image: "/images/services/it-consultancy.png",
    },
    {
      name: "Network Infrastructure",
      image: "/images/services/network-infrastructure.png",
    },
    {
      name: "CCTV",
      image: "/images/services/cctv.png",
    },
    {
      name: "AI Cybersecurity",
      image: "/images/services/ai-cybersecurity.png",
    },
    {
      name: "Cloud Solutions",
      image: "/images/services/cloud-solutions.png",
    },
    {
      name: "IT Support & Maintenance",
      image: "/images/services/it-support.png",
    },
  ]

  // Partner logos data
  const partners = [
    { name: "Aruba", logo: "/images/partners/aruba.png" },
    { name: "3M", logo: "/images/partners/3m.png" },
    { name: "Axis", logo: "/images/partners/axis.png" },
    { name: "Canon", logo: "/images/partners/canon.png" },
    { name: "Dahua", logo: "/images/partners/dahua.png" },
    { name: "Epson", logo: "/images/partners/epson.png" },
    { name: "Hikvision", logo: "/images/partners/hikvision.png" },
    { name: "HP", logo: "/images/partners/hp.png" },
    { name: "LG", logo: "/images/partners/lg.png" },
    { name: "IBM", logo: "/images/partners/ibm.png" },
    { name: "Intel", logo: "/images/partners/intel.png" },
    { name: "Kaspersky", logo: "/images/partners/Kaspersky.png" },
    { name: "Lenovo", logo: "/images/partners/lenovo.png" },
    { name: "TP-Link", logo: "/images/partners/tp-link.png" },
    { name: "Samsung", logo: "/images/partners/samsung.png" },
    { name: "Microsoft", logo: "/images/partners/microsoft.png" },
    { name: "HP Networking", logo: "/images/partners/hp-networking.png" },
    { name: "Symantec", logo: "/images/partners/symantec.png" },
  ]

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Hero section */}
        <section className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-3xl mx-auto">
            Preparing For Your Success, We Provide Truly IT Solutions.
          </h1>
        </section>

        {/* Services section */}
        <section className="px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              {services.map((service) => (
                <div key={service.name} className="flex flex-col items-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4">
                    <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-white text-center text-sm md:text-base">{service.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted companies section */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              We Pride Ourselves Being Trusted And Having The Opportunity To Work With Leading Companies In Their
              Respective Fields
            </h2>
          </div>

          {/* Partners grid */}
          <div className="bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8 md:gap-12">
                {partners.map((partner) => (
                  <div key={partner.name} className="flex items-center justify-center">
                    <div className="relative h-12 md:h-16 w-full">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a3b4b] py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-medium mb-2">Contact</h3>
            <p className="text-white">Info@Dot-Stripe.Com</p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/contact"
              className="bg-[#2d6a8e] text-white px-6 py-3 rounded-md hover:bg-[#18608C] transition-colors"
            >
              CONTACT US
            </Link>
          </div>

          <div className="text-right">
            <h3 className="text-white text-lg font-medium mb-2">Location</h3>
            <p className="text-white">Beirut,Lebanon</p>
            <p className="text-white">75008 Paris FRANCE</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 text-center md:text-center">
          <p className="text-white">Copywrite© Dot Stripe 2025</p>
        </div>
      </footer>
    </div>
  )
}
