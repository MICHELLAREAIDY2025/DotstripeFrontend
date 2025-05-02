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
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 md:pt-32 lg:pt-36 pb-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            ...YOUR PATHWAY
            <br />
            TO TECH EXCELLENCE...
          </h1>
          <div className="relative w-full max-w-2xl h-48 md:h-64 lg:h-80 mx-auto mb-2">
            <Image src="/images/future.jpg" alt="Future" fill className="object-contain" priority />
          </div>
          <Link
            href={user ? "/what-we-do" : "/register"}
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
