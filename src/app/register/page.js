"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { UserPlus, ArrowLeft, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-b from-[#031626] to-[#0E4459] flex items-center justify-center px-4 py-6 sm:py-12">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden transform transition-all animate-fadeIn">
        {/* Left side - Form */}
        <div className="p-5 sm:p-8 md:p-12 lg:p-16 order-2 lg:order-1 bg-white flex flex-col items-center">
          {/* Mobile header with logo and back button */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
            <Link
              href="/"
              className="inline-flex items-center text-white bg-[#18608C] hover:bg-[#17A0BF] transition-colors py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg group font-medium w-full sm:w-auto justify-center sm:justify-start"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Home</span>
            </Link>

            {/* Mobile logo */}
            <div className="flex lg:hidden">
              <Image
                src="/images/DotStripeLogo.png"
                alt="DotStripe Logo"
                width={140}
                height={45}
                className="object-contain"
              />
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="flex items-center justify-center mb-8 sm:mb-12">
              <div className="bg-[#17A0BF]/10 p-3 rounded-full mr-4">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-[#18608C]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#031626]">Create Account</h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-md animate-shake text-sm sm:text-base">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium mb-1 sm:mb-2 text-[#031626]" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#17A0BF] focus:border-transparent transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium mb-1 sm:mb-2 text-[#031626]" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#17A0BF] focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium mb-1 sm:mb-2 text-[#031626]" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#17A0BF] focus:border-transparent transition-all duration-200"
                  placeholder="Create a secure password"
                />
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  Must be at least 6 characters with 1 uppercase letter and 1 number
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium mb-1 sm:mb-2 text-[#031626]" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="border border-gray-300 rounded-lg w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#17A0BF] focus:border-transparent transition-all duration-200"
                  placeholder="Your full address"
                ></textarea>
              </div>

              <div className="mt-6 sm:mt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#18608C] to-[#17A0BF] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg w-full hover:from-[#17A0BF] hover:to-[#18608C] transition-all duration-300 text-base sm:text-lg font-semibold disabled:opacity-70 flex items-center justify-center shadow-lg shadow-[#17A0BF]/20 group"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-white mr-2 sm:mr-3"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10 sm:mt-16 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-center text-sm sm:text-base text-[#031626]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#18608C] hover:text-[#17A0BF] font-medium transition-colors duration-200 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>

            {/* Extra space at the bottom */}
            <div className="h-8 sm:h-12"></div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden lg:block order-1 lg:order-2">
          <div className="absolute inset-0 bg-gradient-to-l from-[#031626]/90 to-[#031626]/70 z-10"></div>
          <div className="h-full w-full relative">
            <Image
              src="/images/register-image.png"
              alt="Register"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 0vw, 50vw"
            />
          </div>
          <div className="absolute inset-0 z-20 p-12 flex flex-col justify-between">
            <div className="mb-auto flex justify-center w-full">
              <Image
                src="/images/DotStripeLogo.png"
                alt="DotStripe Logo"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>

            <div className="max-w-md mx-auto text-center">
              <h1 className="text-4xl font-bold text-white mb-6">Join Dotstripe</h1>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                Create an account to start exploring our products and services.
              </p>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white">🔐</span>
                </div>
                <div className="text-left">
                  <p className="text-white/90 text-sm">Secure Registration</p>
                  <p className="text-white/70 text-xs">
                    Your information is protected with industry-standard encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
