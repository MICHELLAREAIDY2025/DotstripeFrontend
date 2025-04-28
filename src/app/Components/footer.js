"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <footer className="bg-[#0E2A3B] text-white py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-xl font-medium mb-3 text-white">Contact</h3>
            <a
              href="mailto:Info@Dot-Stripe.Com"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-lg"
            >
              Info@Dot-Stripe.Com
            </a>
          </div>

          {/* Copyright Section */}
          <div className="flex items-center justify-center">
            <p className="text-gray-300 text-lg text-center">Copywrite© Dot Stripe 2024</p>
          </div>

          {/* Location Section */}
          <div className="flex flex-col items-center md:items-end space-y-1">
            <h3 className="text-xl font-medium mb-3 text-white">Location</h3>
            <p className="text-gray-300 md:text-right text-lg">Beirut, Lebanon</p>
            <p className="text-gray-300 md:text-right text-lg">75008 Paris</p>
            <p className="text-gray-300 md:text-right text-lg">FRANCE</p>
          </div>
        </div>

        {/* Contact Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`
                absolute inset-0 bg-[#18608C] rounded-lg transition-all duration-300
                ${isHovered ? "opacity-100 scale-105" : "opacity-100 scale-100"}
              `}
            ></div>
            <div
              className={`
                absolute inset-0 bg-[#17A0BF] rounded-lg transition-all duration-300
                ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
            ></div>
            <span className="relative px-10 py-4 text-lg font-medium text-white uppercase tracking-wider flex items-center">
              Contact Us
              <ArrowRight
                className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? "transform translate-x-1" : ""}`}
              />
            </span>
          </Link>
        </div>

        {/* Bottom Links - Optional */}
        <div className="mt-12 pt-8 border-t border-gray-700/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">© {new Date().getFullYear()} Dot Stripe. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
