"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiCreditCard } from "react-icons/fi"
import Link from "next/link"

const OrderDetailsPage = ({ params }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("Access denied. Admin privileges required.")
      router.push("/login?redirect=/admin/orders")
      return
    }
    fetchOrderDetails()
  }, [user, isAuthenticated, router, params.id])

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      setOrder(response.data)
    } catch (error) {
      console.error("Error fetching order details:", error)
      toast.error("Failed to fetch order details")
      router.push("/admin/orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Order not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center text-[#18608C] hover:text-[#17A0BF] mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-500">Placed on {formatDate(order.created_at)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <FiUser className="text-[#18608C] mr-2" />
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
            <p className="text-gray-600">User ID: {order.user_id}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <FiMapPin className="text-[#18608C] mr-2" />
              <h2 className="text-lg font-semibold">Shipping Address</h2>
            </div>
            <p className="text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <FiCreditCard className="text-[#18608C] mr-2" />
              <h2 className="text-lg font-semibold">Payment Information</h2>
            </div>
            <p className="text-gray-600">Method: {order.payment_method?.replace(/_/g, " ")}</p>
            <p className="text-gray-600">Total Amount: ${parseFloat(order.total_amount).toFixed(2)}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <FiPackage className="text-[#18608C] mr-2" />
            <h2 className="text-lg font-semibold">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.OrderItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.Product?.image && (
                          <img
                            src={item.Product.image}
                            alt={item.Product.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.Product?.name || "Product not found"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan="3" className="px-6 py-4 text-right font-semibold">
                    Total:
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsPage 