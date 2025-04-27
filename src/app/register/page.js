"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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
    <div className="min-h-screen bg-[#031626] flex items-center justify-center px-4 py-12">
      <ToastContainer />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Form */}
        <div className="p-8 md:p-12 lg:p-16 order-2 md:order-1">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center md:justify-start mb-12">
              <UserPlus className="h-8 w-8 text-[#18608C] mr-3" />
              <h2 className="text-3xl font-bold text-[#031626]">Create Account</h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-medium mb-3 text-[#031626]" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-2 border-[#17A0BF] rounded-lg w-full p-4 bg-[#7EF2F2]/10 text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#18608C] transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-3 text-[#031626]" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-2 border-[#17A0BF] rounded-lg w-full p-4 bg-[#7EF2F2]/10 text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#18608C] transition"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-3 text-[#031626]" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-2 border-[#17A0BF] rounded-lg w-full p-4 bg-[#7EF2F2]/10 text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#18608C] transition"
                  placeholder="Create a secure password"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Must be at least 6 characters with 1 uppercase letter and 1 number
                </p>
              </div>

              <div>
                <label className="block text-base font-medium mb-3 text-[#031626]" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="border-2 border-[#17A0BF] rounded-lg w-full p-4 bg-[#7EF2F2]/10 text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#18608C] transition"
                  placeholder="Your full address"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#18608C] text-white py-4 px-6 rounded-lg w-full hover:bg-[#17A0BF] transition duration-300 text-lg font-semibold mt-8 disabled:opacity-70 flex items-center justify-center"
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

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-[#031626]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#18608C] hover:text-[#17A0BF] hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden md:block order-1 md:order-2">
          <div className="absolute inset-0 bg-gradient-to-l from-[#031626]/80 to-transparent z-10"></div>
          <div className="h-full w-full relative">
            <Image src="/images/register-image.png" alt="Register" fill className="object-cover" priority />
          </div>
          <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end">
            <h1 className="text-4xl font-bold text-white mb-6">Join Dotstripe</h1>
            <p className="text-white/80 text-lg">Create an account to start exploring our products and services.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
