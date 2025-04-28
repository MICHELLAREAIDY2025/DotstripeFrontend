"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"

export default function AdminPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect when loading is false
    if (!loading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login")
        router.push("/login")
      } else if (user && user.role !== "admin") {
        console.log("Not an admin, redirecting to home")
        router.push("/")
      } else {
        console.log("Admin access granted, redirecting to dashboard")
        router.push("/admin/dashboard")
      }
    }
  }, [user, loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C]"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <div className="text-white">You must be logged in to access this page.</div>
  }

  if (user && user.role !== "admin") {
    return <div className="text-white">You must be an admin to access this page.</div>
  }

  return (
    <div className="text-black p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome, {user.email} 👋</p>

      {/* Debug information */}
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
          <h3 className="font-bold mb-2">Debug Information:</h3>
          <p>User ID: {user.id}</p>
          <p>Role: {user.role}</p>
          <p>Token Present: {localStorage.getItem("token") ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  )
}
