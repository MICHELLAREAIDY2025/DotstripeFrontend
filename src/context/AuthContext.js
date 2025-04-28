"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

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
        const token = localStorage.getItem("token")
        if (token) {
          // Set default authorization header for all requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Try to get current user data
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
            withCredentials: true,
          })

          if (response.data) {
            setUser(response.data)
            setIsAuthenticated(true)

            // Store role in localStorage for easier access in components
            if (response.data.role) {
              localStorage.setItem("role", response.data.role)
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear invalid token and role
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
        { email, password },
        { withCredentials: true },
      )

      const { user, token } = response.data

      // Store token in localStorage
      if (token) {
        localStorage.setItem("token", token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }

      // Store role in localStorage
      if (user && user.role) {
        localStorage.setItem("role", user.role)
      }

      setUser(user)
      setIsAuthenticated(true)

      // Redirect based on user role
      if (user && user.role === "admin") {
        router.push("/admin") // Redirect to your admin dashboard
      } else {
        router.push("/") // Redirect regular users to home page
      }

      return user
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, userData, {
        withCredentials: true,
      })

      // If registration automatically logs in the user
      if (response.data.user && response.data.token) {
        const { user, token } = response.data

        // Store token in localStorage
        localStorage.setItem("token", token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Store role in localStorage
        if (user.role) {
          localStorage.setItem("role", user.role)
        }

        setUser(user)
        setIsAuthenticated(true)
      }

      setLoading(false)
      return response.data
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {}, { withCredentials: true })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      delete axios.defaults.headers.common["Authorization"]
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    }
  }

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update`, userData, {
        withCredentials: true,
      })

      const updatedUser = response.data.user

      // Update role in localStorage if it changed
      if (updatedUser && updatedUser.role) {
        localStorage.setItem("role", updatedUser.role)
      }

      setUser(updatedUser)
      return response.data
    } catch (error) {
      throw error
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
        updateProfile,
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
