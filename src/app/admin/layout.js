"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import ProtectedAdminRoute from "@/app/Components/AdminProtectedRoute"
import { useAuth } from "@/app/context/AuthContext"
import Sidebar from "@/app/Components/sidebar"
import { UsersProvider } from "@/app/context/UserContext"
import { ProductProvider } from "@/app/context/ProductContext"
import { CategoryProvider } from "@/app/context/CategoryContext"
import { OrderProvider } from "@/app/context/OrderContext"
import { OrderItemProvider } from "@/app/context/OrderItemContext"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Add a token check in the admin layout to ensure authentication
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Check if role exists in localStorage
    const role = localStorage.getItem("role")

    console.log("Admin Layout - Role check:", role)
    console.log("Admin Layout - User from context:", user ? `ID: ${user.id}, Role: ${user.role}` : "Not set")
    console.log("Admin Layout - Is authenticated:", isAuthenticated)

    if (!isAuthenticated && !user) {
      console.error("No authenticated user found in admin layout")
    }

    setAuthChecked(true)
  }, [user, isAuthenticated])

  // Add debugging to check token on layout mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log("Admin Layout - Token check:", token ? "Present" : "Missing")
    console.log("Admin Layout - Role check:", localStorage.getItem("role"))
  }, [])

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <ProtectedAdminRoute>
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
    </ProtectedAdminRoute>
  )
}
