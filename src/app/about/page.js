"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowRight, CheckCircle, X } from "lucide-react"

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

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

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 pt-40 md:pt-44 lg:pt-48 pb-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Text Content - Takes 7/12 of the width on desktop */}
            <div className="lg:col-span-7 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center lg:text-left">Who We Are</h1>

              <div className="text-sm md:text-base lg:text-lg leading-relaxed space-y-6">
                <p>
                  FOUNDED IN 2009, DOT STRIPE ASSISTS BUSINESSES PROFIT ON THE GROWTH AND POTENTIAL OF INFORMATION
                  TECHNOLOGY.
                </p>

                <p>
                  OUR DIFFERENTIATED INTEGRATED APPROACH AND THE KNOWLEDGE OF LEADING EDGE TECHNOLOGY GRANT US THE
                  ADVANTAGE IN PROVIDING YOU WITH STATE OF THE ART PRODUCTS.
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={togglePopup}
                  className="inline-flex items-center text-[#17A0BF] hover:text-white transition-colors duration-300 group"
                >
                  <span className="mr-2">Read More</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Image - Takes 5/12 of the width on desktop */}
            <div className="lg:col-span-5">
              <div className="relative w-full h-64 md:h-80 lg:h-[450px] rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#031626]/80 to-transparent z-10"></div>
                <Image
                  src="/images/tech-office.png"
                  alt="Dot Stripe Technology Solutions"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - with increased spacing */}
        <div
          className={`max-w-7xl mx-auto px-4 md:px-8 lg:px-12 mt-40 transition-all duration-700 delay-300 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="bg-[#0A2235] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex items-center mb-4">
                <div className="bg-[#17A0BF]/20 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-[#17A0BF]" />
                </div>
                <h3 className="text-xl font-semibold text-white">Innovative Solutions</h3>
              </div>
              <p className="text-gray-300">
                We leverage cutting-edge technology to deliver innovative solutions that drive business growth and
                efficiency.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0A2235] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex items-center mb-4">
                <div className="bg-[#17A0BF]/20 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-[#17A0BF]" />
                </div>
                <h3 className="text-xl font-semibold text-white">Global Reach</h3>
              </div>
              <p className="text-gray-300">
                With operations in Lebanon and France, we provide IT services and solutions to clients worldwide.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0A2235] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex items-center mb-4">
                <div className="bg-[#17A0BF]/20 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-[#17A0BF]" />
                </div>
                <h3 className="text-xl font-semibold text-white">Customer Focus</h3>
              </div>
              <p className="text-gray-300">
                We prioritize understanding your unique business needs to deliver customized technology solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Increased spacing before footer */}
        <div className="h-32"></div>
      </main>

      {/* Popup for Read More */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0A2235] rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">About Dot Stripe</h2>
                <button
                  onClick={togglePopup}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close popup"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="text-gray-200 space-y-6 text-base md:text-lg leading-relaxed">
                <p>
                  FOUNDED IN 2009, DOT STRIPE ASSISTS BUSINESSES PROFIT ON THE GROWTH AND POTENTIAL OF INFORMATION
                  TECHNOLOGY.
                </p>

                <p>
                  OUR DIFFERENTIATED INTEGRATED APPROACH AND THE KNOWLEDGE OF LEADING EDGE TECHNOLOGY GRANT US THE
                  ADVANTAGE IN PROVIDING YOU WITH STATE OF THE ART PRODUCTS.
                </p>

                <p>
                  DOT STRIPE OFFERS A VARIETY OF IT PRODUCTS AND SERVICES FOR INDIVIDUAL OR COMPANY NEEDS LOCALLY AND
                  WORLDWIDE.
                </p>

                <p>
                  WITH DOT STRIPE AS YOUR TECHNOLOGY PARTNER, YOU CAN RELY ON CUSTOMIZED AND CUSTOMER-FOCUSED INTEGRATED
                  SOLUTIONS THAT ALWAYS MATCH YOUR UNIQUE BUSINESS NEEDS.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={togglePopup}
                  className="bg-[#18608C] hover:bg-[#17A0BF] text-white py-2 px-6 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
