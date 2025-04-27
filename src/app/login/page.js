"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "@/app/Components/navbar"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const userData = await login({ email, password })
      if (userData) {
        if (userData.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
        localStorage.setItem("role", userData.role)
        toast.success("Login successful")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.error || "Invalid email or password")
      toast.error(err.response?.data?.error || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left side - Image */}
          <div className="md:w-1/2 relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1929]/80 to-transparent z-10"></div>
            <Image src="/images/login-image.png" alt="Login" fill className="object-cover" priority />
            <div className="relative z-20 p-12 h-full flex flex-col justify-end">
              <h1 className="text-3xl font-bold text-white mb-4">Welcome Back</h1>
              <p className="text-white/80">Sign in to access your account and continue your journey with Dotstripe.</p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center md:justify-start mb-8">
                <LogIn className="h-8 w-8 text-[#3B6EA5] mr-3" />
                <h2 className="text-3xl font-bold text-[#0A1929]">Login</h2>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-base font-medium mb-2 text-[#0A1929]" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-[#3B6EA5] rounded-lg w-full p-4 bg-gray-50 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-base font-medium text-[#0A1929]" htmlFor="password">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-[#3B6EA5] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-[#3B6EA5] rounded-lg w-full p-4 bg-gray-50 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#3B6EA5] text-white py-4 px-6 rounded-lg w-full hover:bg-[#28527a] transition duration-300 text-lg font-semibold disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-[#0A1929]">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-[#3B6EA5] hover:underline font-medium">
                    Sign up here
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
