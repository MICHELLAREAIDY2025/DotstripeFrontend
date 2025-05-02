"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <footer className="bg-[#0E2A3B] text-white py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 items-center">
          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start space-y-1">
            <h3 className="text-lg font-medium mb-2 text-white">Contact</h3>
            <a
              href="mailto:Info@Dot-Stripe.Com"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-base"
            >
              Info@Dot-Stripe.Com
            </a>
          </div>

          {/* Copyright Section */}
          <div className="flex items-center justify-center">
            <p className="text-gray-400 text-sm text-center">© 2025 Dot Stripe. All rights reserved.</p>
          </div>

          {/* Location Section */}
          <div className="flex flex-col items-center md:items-end space-y-0.5">
            <h3 className="text-lg font-medium mb-2 text-white">Location</h3>
            <p className="text-gray-300 md:text-right text-base">Beirut, Lebanon</p>
            <p className="text-gray-300 md:text-right text-base">75008 Paris</p>
            <p className="text-gray-300 md:text-right text-base">FRANCE</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
