"use client"

import { useState, useEffect } from "react"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"
import Image from "next/image"

export default function WhatWeThink() {
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // Animation on load
    const animationTimer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => {
      clearTimeout(timer)
      clearTimeout(animationTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 mt-20">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          {/* Left side - Image */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#031626]/80 to-transparent z-10"></div>
            <Image
              src="/images/mission.jpg"
              alt="Mission and Vision"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mission Statement</h2>
              <p className="text-gray-300 text-lg">
                Our mission is to provide the foundational Information Technology structure 
                for individuals and businesses to excel in their field of expertise using 
                our Dot Stripe Integrated Solutions.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 text-lg">
                "Your concern is our concern: Improving communication of information through 
                IT interaction & integration therefore reaching a true partnership"
              </p>
              <div className="text-right mt-4">
                <p className="text-[#17A0BF] text-lg font-semibold">Managing Partner</p>
                <p className="text-[#17A0BF] text-lg font-semibold">Joseph Reaidy</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
