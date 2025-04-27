"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/Cartcontext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "@/app/Components/navbar"

export default function Home() {
  const { user } = useAuth()
  const { setCartCount } = useCart()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-16">
            ...YOUR PATHWAY 
            <br />
            TO TECH EXCELLENCE...
          </h1>

          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-16">
            <Image src="/images/tech-globe.png" alt="Tech Globe" fill className="object-contain" />
            {/* Animated orbit ring */}
            <div className="absolute inset-0 border-2 border-[#17A0BF]/30 rounded-full animate-spin-slow"></div>
          </div>

          <Link
            href={user ? "/what-we-do" : "/register"}
            className="inline-block bg-[#18608C] text-white py-3 px-8 rounded-md font-semibold hover:bg-[#17A0BF] transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </main>

      <footer className="bg-[#031626] border-t border-[#0E4459] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-white/70 text-sm">© {new Date().getFullYear()} Dot Stripe. All rights reserved.</p>
          </div>
          <div className="flex space-x-8">
            <Link href="/contact" className="text-white/70 hover:text-white text-sm">
              Contact
            </Link>
            <Link href="/privacy" className="text-white/70 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/70 hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
