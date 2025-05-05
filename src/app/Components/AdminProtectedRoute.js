"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "react-toastify"

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!isAuthenticated) {
          toast.error("Please log in to access admin panel")
          router.push("/login?redirect=/admin")
          return
        }

        if (user && user.role !== "admin") {
          toast.error("Access denied. Admin privileges required.")
          router.push("/")
          return
        }

        setIsChecking(false)
      }
    }

    checkAuth()
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
