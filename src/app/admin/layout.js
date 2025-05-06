"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import ProtectedAdminRoute from "@/app/Components/AdminProtectedRoute"
import { useAuth } from "@/app/context/AuthContext"
import Sidebar from "@/app/Components/sidebar"
import { UsersProvider } from "@/app/context/UserContext"
import { ProductProvider } from "@/app/context/ProductContext"
import { CategoryProvider } from "@/app/context/CategoryContext"
import { OrderProvider } from "@/app/context/OrderContext"
import { OrderItemProvider } from "@/app/context/OrderItemContext"
import { toast } from "react-toastify"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, loading } = useAuth()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
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

    setAuthChecked(true)
    }
  }, [user, isAuthenticated, loading, router])

  const isActive = (path) => {
    return pathname === path
  }

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C]"></div>
        <p className="mt-4 text-gray-600">Verifying access...</p>
      </div>
    )
  }

  if (!isAuthenticated || (user && user.role !== "admin")) {
    return null
  }

  return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-h-screen ml-64 p-8">
          <UsersProvider>
            <ProductProvider>
              <CategoryProvider>
                <OrderProvider>
                  <OrderItemProvider>{children}</OrderItemProvider>
                </OrderProvider>
              </CategoryProvider>
            </ProductProvider>
          </UsersProvider>
        </main>
      </div>
  )
}
