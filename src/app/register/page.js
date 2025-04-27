"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "@/app/Components/navbar"
import { UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 6 characters long, contain at least 1 uppercase letter and 1 number")
      setIsLoading(false)
      toast.error("Password must be at least 6 characters long, contain at least 1 uppercase letter and 1 number")
      return
    }

    // Format the data to match what the backend expects
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address || null,
    }

    try {
      await register(userData)
      toast.success("Registration successful! Please log in.")
      router.push("/login")
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.response?.data?.error || "Unable to sign up")
      toast.error(err.response?.data?.error || "Unable to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-6xl flex flex-col md:flex-row-reverse bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Right side - Image */}
          <div className="md:w-1/2 relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-l from-[#0A1929]/80 to-transparent z-10"></div>
            <Image src="/images/register-image.png" alt="Register" fill className="object-cover" priority />
            <div className="relative z-20 p-12 h-full flex flex-col justify-end">
              <h1 className="text-3xl font-bold text-white mb-4">Join Dotstripe</h1>
              <p className="text-white/80">Create an account to start exploring our products and services.</p>
            </div>
          </div>

          {/* Left side - Form */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center md:justify-start mb-8">
                <UserPlus className="h-8 w-8 text-[#3B6EA5] mr-3" />
                <h2 className="text-3xl font-bold text-[#0A1929]">Create Account</h2>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-base font-medium mb-2 text-[#0A1929]" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border border-[#3B6EA5] rounded-lg w-full p-4 bg-gray-50 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium mb-2 text-[#0A1929]" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border border-[#3B6EA5] rounded-lg w-full p-4 bg-gray-50 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium mb-2 text-[#0A1929]" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border border-[#3B6EA5] rounded-lg w-full p-4 bg-gray-50 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                    placeholder="Create a secure password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters with 1 uppercase letter and 1 number
                  </p>
                </div>

                <div>
                  <label className="block text-base font-medium mb-2 text-[#0A1929]" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="border border-[#3B6EA5] rounded-lg w-full p-4 bg-gray-50 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                    placeholder="Your full address"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#3B6EA5] text-white py-4 px-6 rounded-lg w-full hover:bg-[#28527a] transition duration-300 text-lg font-semibold mt-4 disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-[#0A1929]">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#3B6EA5] hover:underline font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
