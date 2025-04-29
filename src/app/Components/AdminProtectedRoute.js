"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only check when auth loading is complete
    if (!loading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login")
        router.push("/login")
      } else if (user && user.role !== "admin") {
        console.log("Not an admin, redirecting to home")
        router.push("/")
      } else {
        console.log("Admin access granted")
      }
      setIsChecking(false)
    }
  }, [user, loading, isAuthenticated, router])

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C]"></div>
        <p className="mt-4 text-gray-600">Verifying access...</p>
      </div>
    )
  }

  // Don't render children if not authenticated or not admin
  if (!isAuthenticated || (user && user.role !== "admin")) {
    return null
  }

  // Render children if authenticated and admin
  return children
}

export default ProtectedAdminRoute
