"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { FiEdit, FiTrash, FiEye, FiCheck } from "react-icons/fi"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import Link from "next/link"
import emailjs from '@emailjs/browser'

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user?.role === "admin") {
      toast.error("Access denied. Admin privileges required.")
      router.push("/login?redirect=/admin/orders")
      return
    }
    fetchOrders()
  }, [user, isAuthenticated, router])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      // Format the orders data
      const formattedOrders = response.data.map(order => ({
        ...order,
        total_amount: parseFloat(order.total_amount) || 0,
        created_at: order.created_at || order.createdAt,
        status: order.status || 'pending'
      }))
      
      setOrders(formattedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to fetch orders")
      toast.error(error.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const sendOrderStatusEmail = async (order, newStatus) => {
    try {
      const templateParams = {
        to_name: order.User?.name || 'Valued Customer',
        order_id: order.id,
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        message: getStatusMessage(newStatus),
        company_name: 'Dotstripe',
        to_email: order.User?.email,
        from_name: 'Dotstripe',
        reply_to: process.env.NEXT_PUBLIC_EMAILJS_REPLY_TO
      }

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )

      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'processing':
        return 'Your order is now being processed by our team. We\'ll notify you when your order is ready for shipping.'
      case 'shipped':
        return 'Great news! Your order has been shipped. You can track your order status in your account dashboard.'
      case 'delivered':
        return 'Your order has been delivered! We hope you enjoy your purchase. If you have any questions, please don\'t hesitate to contact us.'
      case 'cancelled':
        return 'Your order has been cancelled as requested. If you didn\'t request this cancellation, please contact our support team immediately.'
      default:
        return 'Your order status has been updated.'
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Show confirmation dialog
    confirmAlert({
      title: "Confirm Status Change",
      message: `Are you sure you want to change the status to "${newStatus}"? This will send an email notification to the customer.`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setUpdatingStatus(orderId)
              
              // First update the order status
              const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
                { status: newStatus },
                { 
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'application/json',
                  }
                }
              )

              // Then send the email notification if status is not pending
              let emailSent = false
              if (newStatus !== 'pending') {
                const order = orders.find(o => o.id === orderId)
                if (order) {
                  emailSent = await sendOrderStatusEmail(order, newStatus)
                }
              }
              
              // Update local state immediately for better UX
              setOrders(prevOrders => 
                prevOrders.map(order => 
                  order.id === orderId 
                    ? { ...order, status: newStatus }
                    : order
                )
              )
              
              // Show success message with email notification status
              const message = newStatus !== 'pending' && emailSent
                ? `Order #${orderId} status updated to ${newStatus} and notification email sent`
                : `Order #${orderId} status updated to ${newStatus}`
              
              toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              })
            } catch (error) {
              console.error("Error updating order status:", error)
              toast.error(error.response?.data?.message || "Failed to update order status")
              
              // Reset the select value to the previous status on error
              setOrders(prevOrders => 
                prevOrders.map(order => 
                  order.id === orderId 
                    ? { ...order, status: order.status }
                    : order
                )
              )
            } finally {
              setUpdatingStatus(null)
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // Reset the select value to the previous status
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === orderId 
                  ? { ...order, status: order.status }
                  : order
              )
            )
          }
        },
      ],
    })
  }

  const handleDelete = (orderId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete order #${orderId}?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                }
              })
              toast.success("Order deleted successfully")
              fetchOrders() // Refresh orders list
            } catch (error) {
              console.error("Error deleting order:", error)
              toast.error(error.response?.data?.message || "Failed to delete order")
            }
          },
        },
        {
          label: "No",
        },
      ],
    })
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
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(
    (order) =>
      (order.id?.toString().includes(searchTerm) ||
        order.user_id?.toString().includes(searchTerm) ||
        order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md flex-grow"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Payment Method</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2 text-center">{order.id}</td>
                <td className="border p-2 text-center">{order.user_id}</td>
                <td className="border p-2 text-center">{formatDate(order.created_at)}</td>
                <td className="border p-2 text-center">
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)} ${
                        updatingStatus === order.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={updatingStatus === order.id}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingStatus === order.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#18608C]"></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="border p-2 text-center">${parseFloat(order.total_amount).toFixed(2)}</td>
                <td className="border p-2 text-center capitalize">{order.payment_method?.replace(/_/g, " ")}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600 hover:text-red-800 mr-2"
                    disabled={updatingStatus === order.id}
                  >
                    <FiTrash className="inline-block h-5 w-5" />
                  </button>
                  <Link href={`/admin/orders/${order.id}`} className="text-green-600 hover:text-green-800">
                    <FiEye className="inline-block h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage 