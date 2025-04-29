// Utility functions for authentication

// Store token with expiry time
export const setToken = (token) => {
    if (typeof window === "undefined") return
  
    try {
      // Store the token
      localStorage.setItem("token", token)
  
      // Set a timestamp for when the token was stored
      localStorage.setItem("tokenTimestamp", Date.now().toString())
  
      console.log("Token stored successfully")
      return true
    } catch (error) {
      console.error("Error storing token:", error)
      return false
    }
  }
  
  // Get token and verify it's not expired
  export const getToken = () => {
    if (typeof window === "undefined") return null
  
    try {
      const token = localStorage.getItem("token")
      const timestamp = localStorage.getItem("tokenTimestamp")
  
      if (!token || !timestamp) return null
  
      // Check if token is older than 24 hours (adjust as needed)
      const now = Date.now()
      const tokenTime = Number.parseInt(timestamp, 10)
      const tokenAge = now - tokenTime
      const tokenMaxAge = 24 * 60 * 60 * 1000 // 24 hours
  
      if (tokenAge > tokenMaxAge) {
        // Token expired, clear it
        removeToken()
        return null
      }
  
      return token
    } catch (error) {
      console.error("Error retrieving token:", error)
      return null
    }
  }
  
  // Remove token
  export const removeToken = () => {
    if (typeof window === "undefined") return
  
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("tokenTimestamp")
      localStorage.removeItem("role")
      return true
    } catch (error) {
      console.error("Error removing token:", error)
      return false
    }
  }
  
  // Store user role
  export const setRole = (role) => {
    if (typeof window === "undefined") return
  
    try {
      localStorage.setItem("role", role)
      return true
    } catch (error) {
      console.error("Error storing role:", error)
      return false
    }
  }
  
  // Get user role
  export const getRole = () => {
    if (typeof window === "undefined") return null
  
    try {
      return localStorage.getItem("role")
    } catch (error) {
      console.error("Error retrieving role:", error)
      return null
    }
  }
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getToken()
  }
  
  // Check if user is admin
  export const isAdmin = () => {
    return getRole() === "admin"
  }
  