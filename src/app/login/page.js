"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
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
      // Success toast is shown in the login function
    } catch (error) {
      // Error toast is shown in the login function
      console.error("Login error in component:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google` || "https://accounts.google.com/o/oauth2/v2/auth"
  }

  const handleFacebookLogin = () => {
    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/facebook` || "https://www.facebook.com/v13.0/dialog/oauth"
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
        {/* Left side - Image with overlay */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-r from-[#031626]/90 to-[#031626]/70 z-10"></div>
          <div className="h-full w-full relative">
            <Image
              src="/images/login-image.png"
              alt="Login"
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
              <h1 className="text-4xl font-bold text-white mb-6">Welcome Back</h1>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                Sign in to access your account and continue your journey with DotStripe.
              </p>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white">🔒</span>
                </div>
                <div className="text-left">
                  <p className="text-white/90 text-sm">Secure Login</p>
                  <p className="text-white/70 text-xs">Your data is protected with industry-standard encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="p-5 sm:p-8 md:p-12 lg:p-16 bg-white flex flex-col items-center">
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
                <LogIn className="h-5 w-5 sm:h-6 sm:w-6 text-[#18608C]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#031626]">Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium mb-1 sm:mb-2 text-[#031626]" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-gray-300 rounded-lg w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#17A0BF] focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  aria-label="Email Address"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <label className="block text-sm font-medium text-[#031626]" htmlFor="password">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-[#18608C] hover:text-[#17A0BF] transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 rounded-lg w-full py-3 sm:py-4 px-4 sm:px-6 bg-white text-[#031626] focus:outline-none focus:ring-2 focus:ring-[#17A0BF] focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center mt-4 sm:mt-6">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-[#18608C] focus:ring-[#17A0BF] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 sm:ml-3 block text-xs sm:text-sm text-gray-700">
                  Remember me
                </label>
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
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10 sm:mt-16 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-center text-sm sm:text-base text-[#031626]">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#18608C] hover:text-[#17A0BF] font-medium transition-colors duration-200 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-8 sm:mt-12">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 sm:px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-md"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full inline-flex justify-center py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:shadow-md"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>

              {/* Debug information in development */}
              {process.env.NODE_ENV !== "production" && (
                <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
                  <h3 className="font-bold mb-2">Debug Information:</h3>
                  <p>API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
                </div>
              )}

              {/* Extra space at the bottom */}
              <div className="h-8 sm:h-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
