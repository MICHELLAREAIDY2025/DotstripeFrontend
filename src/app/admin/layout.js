"use client"

import ProtectedAdminRoute from "@/app/Components/AdminProtectedRoute"
import Sidebar from "@/app/Components/sidebar"
import { UsersProvider } from "@/context/UserContext"
import { ProductProvider } from "@/context/ProductContext"
import { CategoryProvider } from "@/context/CategoryContext"
import { OrderProvider } from "@/context/OrderContext"
import { OrderItemProvider } from "@/context/OrderItemContext"
import { useEffect } from "react"

export default function AdminLayout({ children }) {
  // Add debugging to check token on layout mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log("Admin Layout - Token check:", token ? "Present" : "Missing")
    console.log("Admin Layout - Role check:", localStorage.getItem("role"))
  }, [])

  return (
    <ProtectedAdminRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
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
