"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/app/context/AuthContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { LogIn, ArrowRight, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login({ email, password })
    } catch (error) {
      console.error("Login error in component:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex bg-[#F5F7FA]">
      {/* Left side welcome section with background image */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 relative">
        {/* Background Image */}
        <Image
          src="/images/login-image.png" // or your preferred image path
          alt="Login"
          fill
          className="object-cover absolute inset-0 z-0"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#031626]/80 z-10"></div>
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg">Sign in to access your account and continue your journey with Dot Stripe</p>
        </div>
      </div>
      {/* Login form */}
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Back to Home button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-white bg-[#18608C] hover:bg-[#17A0BF] transition-colors py-2 px-4 rounded-lg shadow-md font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-center mb-8 text-[#18608C]">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#18608C] focus:border-[#18608C]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#18608C] focus:border-[#18608C]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <ArrowLeft /> : <ArrowRight />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#18608C] text-white py-3 px-4 rounded-md hover:bg-[#17A0BF] transition-colors duration-300 font-semibold disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>
          {/* Sign up link */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-[#031626]">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-[#18608C] hover:text-[#17A0BF] font-medium transition-colors duration-200 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
