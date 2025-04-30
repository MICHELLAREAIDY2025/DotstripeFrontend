import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"

export default function WhatWeDoLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B1218] flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
} 