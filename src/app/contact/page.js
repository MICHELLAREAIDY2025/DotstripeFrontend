"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"
import { Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animation on load
    const animationTimer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => {
      clearTimeout(animationTimer)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields")
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      <main className="flex-1 pt-32 pb-16">
        <div
          className={`max-w-7xl mx-auto px-4 md:px-8 lg:px-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side - Image and text */}
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
                <Image src="/images/consulting-team.jpg" alt="Consulting Team" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031626]/90 to-[#031626]/40 flex flex-col justify-end p-8 md:p-10">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">CONSULTING</h1>
                  <p className="text-xl text-white/90">Let's have a discussion</p>
                </div>
              </div>
            </div>

            {/* Right side - Contact form */}
            <div className="bg-[#031626] p-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white text-xl mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#17A0BF]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white text-xl mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#17A0BF]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white text-xl mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#17A0BF]"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#18608C] hover:bg-[#17A0BF] text-white py-3 px-8 rounded-md transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
