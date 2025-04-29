"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { ShoppingBag, Package, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching dashboard data
    const timer = setTimeout(() => {
      setStats({
        orders: 24,
        products: 48,
        users: 120,
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics Cards - Vertical Layout */}
      <div className="space-y-6 mb-8">
        {/* Orders Card */}
        <Link href="/admin/orders" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-blue-100 mr-6">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg text-gray-500">Total Orders</p>
              <p className="text-3xl font-semibold">{stats.orders}</p>
            </div>
          </div>
        </Link>

        {/* Products Card */}
        <Link href="/admin/products" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-green-100 mr-6">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg text-gray-500">Total Products</p>
              <p className="text-3xl font-semibold">{stats.products}</p>
            </div>
          </div>
        </Link>

        {/* Users Card */}
        <Link href="/admin/users" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-purple-100 mr-6">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-lg text-gray-500">Total Users</p>
              <p className="text-3xl font-semibold">{stats.users}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 bg-[#18608C] text-white rounded-md text-center hover:bg-[#18608C]/90 transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-6 py-3 bg-[#18608C] text-white rounded-md text-center hover:bg-[#18608C]/90 transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/admin/users"
            className="px-6 py-3 bg-[#18608C] text-white rounded-md text-center hover:bg-[#18608C]/90 transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  )
}
