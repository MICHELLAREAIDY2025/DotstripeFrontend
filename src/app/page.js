"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./context/AuthContext"
import { useCart } from "./context/Cartcontext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"

export default function Home() {
  const { user } = useAuth()
  const { setCartCount, cartItems } = useCart()

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image src="/images/landing.jpg" alt="Landing Background" fill className="object-cover w-full h-full" priority />
        <div className="absolute inset-0 bg-[#031626]/70" />
      </div>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 md:pt-32 lg:pt-36 pb-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            ...YOUR PATHWAY
            <br />
            TO TECH EXCELLENCE...
          </h1>
          <Link
            href={user ? "/what-we-do/products" : "/register"}
            className="inline-block bg-[#18608C] text-white py-3 px-12 rounded-md font-semibold hover:bg-[#17A0BF] transition duration-300 text-lg mt-2"
          >
            Get Started
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
