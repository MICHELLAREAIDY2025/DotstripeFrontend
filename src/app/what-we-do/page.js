"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import Navbar from "@/app/Components/navbar"

const services = [
  {
    id: 1,
    name: "IT Consultancy",
    image: "/images/services/it-consultancy.png",
    description: "Expert IT consulting services to help your business grow and succeed"
  },
  {
    id: 2,
    name: "Network Infrastructure",
    image: "/images/services/network-infrastructure.jpg",
    description: "Complete network solutions and infrastructure setup"
  },
  {
    id: 3,
    name: "CCTV",
    image: "/images/services/cctv.png",
    description: "Advanced surveillance and security camera systems"
  },
  {
    id: 4,
    name: "AI Cybersecurity",
    image: "/images/services/ai-cybersecurity.png",
    description: "Next-generation AI-powered cybersecurity solutions"
  },
  {
    id: 5,
    name: "Cloud Solutions",
    image: "/images/services/cloud-solutions.png",
    description: "Scalable and secure cloud computing services"
  },
  {
    id: 6,
    name: "IT Support & Maintenance",
    image: "/images/services/it-support.png",
    description: "24/7 IT support and comprehensive maintenance services"
  }
]

export default function WhatWeDo() {
  const [openService, setOpenService] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className={`container mx-auto px-4 pt-32 md:pt-36 pb-12 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
              Preparing For Your Success, We
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Provide Truly IT Solutions.
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col items-center">
                {/* Circular Image Container */}
                <div className="w-48 h-48 rounded-full overflow-hidden mb-4 relative group">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setOpenService(service)}
                      className="bg-white text-[#18608C] px-3 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300 text-sm font-semibold shadow"
                    >
                      Details
                    </button>
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.name)}`}
                      className="bg-[#18608C] text-white px-3 py-2 rounded-md hover:bg-[#18608C]/90 transition-colors duration-300 text-sm font-semibold shadow"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
                
                {/* Service Name */}
                <h3 className="text-white text-xl font-semibold mb-2 text-center">
                  {service.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Check Our Products Section */}
          <div className="text-center mb-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Discover Our Latest Products
              </h2>
              <p className="text-gray-300 mb-8">
                Explore our wide range of cutting-edge technology products and solutions tailored to meet your business needs.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center bg-[#18608C] text-white px-8 py-4 rounded-lg hover:bg-[#17A0BF] transition-all duration-300 transform hover:scale-105 group"
              >
                <span className="text-lg font-semibold">Check Our Products</span>
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-300 transform group-hover:translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Partners Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              We Pride Ourselves Being Trusted And Having The Opportunity To Work With
              Leading Companies In Their Respective Fields
            </h2>
            {/* Partners Grid */}
            <div className="bg-white p-8 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Partner logos */}
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/aruba.png" alt="Aruba" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/3m.png" alt="3M" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/axis.png" alt="Axis" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/canon.png" alt="Canon" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/dahua.png" alt="Dahua" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/epson.png" alt="Epson" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/hikvision.png" alt="Hikvision" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/hp.png" alt="HP" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/lg.png" alt="LG" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/ibm.png" alt="IBM" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/intel.png" alt="Intel" fill className="object-contain" />
                </div>
                <div className="relative aspect-square w-full max-w-[120px] mx-auto">
                  <Image src="/images/partners/kaspersky.png" alt="Kaspersky" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Service Details Modal */}
      {openService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setOpenService(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#18608C] text-center">{openService.name}</h2>
            <p className="text-gray-700 text-center mb-6">{openService.description}</p>
            <div className="flex justify-center gap-4">
              <Link
                href={`/contact?service=${encodeURIComponent(openService.name)}`}
                className="bg-[#18608C] text-white px-3 py-2 rounded-md hover:bg-[#18608C]/90 transition-colors duration-300 text-sm font-semibold shadow"
              >
                Contact Us
              </Link>
              <button
                onClick={() => setOpenService(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
