"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const ProtectAdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only proceed with checks after auth state is determined
    if (!loading) {
      if (!isAuthenticated) {
        // User is not logged in
        router.push("/login")
      } else if (user && user.role !== "admin") {
        // User is logged in but not an admin
        router.push("/")
      } else {
        // User is an admin, allow access
        setIsChecking(false)
      }
    }
  }, [user, isAuthenticated, loading, router])

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#031626]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-[#18608C] animate-spin" />
          <p className="mt-4 text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectAdminRoute
