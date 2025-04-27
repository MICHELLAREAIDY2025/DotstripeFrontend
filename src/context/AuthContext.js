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

          if (response.data && response.data.user) {
            setUser(response.data.user)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear invalid token
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async ({ email, password }) => {
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

      setUser(user)
      setIsAuthenticated(true)
      setLoading(false)
      return user
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, userData, {
        withCredentials: true,
      })
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
      setUser(response.data.user)
      return response.data
    } catch (error) {
      throw error
    }
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
