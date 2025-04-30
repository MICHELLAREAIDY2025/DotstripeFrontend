"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./context/AuthContext"
import { useCart } from "./context/CartContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-16 animate-fade-in-up">
            ...YOUR PATHWAY
            <br />
            TO TECH EXCELLENCE...
          </h1>

          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto mb-16">
            <Image src="/images/tech-globe.png" alt="Tech Globe" fill className="object-contain" priority />
          </div>

          <Link
            href={user ? "/what-we-do" : "/register"}
            className="inline-block bg-[#18608C] text-white py-3 px-12 rounded-md font-semibold hover:bg-[#17A0BF] transition duration-300 text-lg"
          >
            Get Started
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
