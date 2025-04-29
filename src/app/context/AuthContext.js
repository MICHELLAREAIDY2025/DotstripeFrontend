"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { loginUser, logoutUser, getCurrentUser, registerUser } from "@/lib/api"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        console.log("Checking if user is logged in...")

        // Check if token exists in localStorage
        const token = localStorage.getItem("token")
        if (!token) {
          console.log("No token found in localStorage")
          setLoading(false)
          return
        }

        console.log("Token found, verifying with server...")
        const res = await getCurrentUser()
        const userData = res.data.user || res.data

        console.log("User data retrieved:", userData)
        setUser(userData)
        setIsAuthenticated(true)

        // Store role in localStorage for easier access in components
        if (userData && userData.role) {
          localStorage.setItem("role", userData.role)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem("token")
        localStorage.removeItem("role")
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    try {
      console.log("Attempting login with:", credentials.email)

      const res = await loginUser(credentials)

      // Handle different response formats
      const userData = res.data.user || res.data
      const token = res.data.token || res.data.accessToken

      if (token) {
        localStorage.setItem("token", token)
        console.log("Token saved to localStorage")
      } else {
        console.warn("No token received in login response")
      }

      console.log("Login successful:", userData)
      setUser(userData)
      setIsAuthenticated(true)

      // Store role in localStorage for easier access in components
      if (userData && userData.role) {
        localStorage.setItem("role", userData.role)
      }

      // Redirect based on user role
      if (userData && userData.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }

      return userData
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Invalid email or password")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const res = await registerUser(userData)
      toast.success("Registration successful!")

      // Check if registration returns a token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
      }

      // Auto login after registration
      await login({
        email: userData.email,
        password: userData.password,
      })

      return res.data
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.response?.data?.message || "Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    }
  }

  // Check if user has admin access
  const hasAdminAccess = () => {
    return user && user.role === "admin"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasAdminAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
