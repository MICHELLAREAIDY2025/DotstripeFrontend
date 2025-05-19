"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import Link from "next/link"

export default function AdminOrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [order, setOrder] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, { withCredentials: true })
      .then(res => {
        setOrder(res.data)
        // If user info is missing but user_id exists, fetch user info
        if ((!res.data.user || !res.data.user.email) && res.data.user_id) {
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${res.data.user_id}`, { withCredentials: true })
            .then(userRes => setUser(userRes.data))
            .catch(() => setUser(null))
        }
      })
      .catch(err => {
        setError("Failed to fetch order details")
        toast.error(err.response?.data?.message || "Failed to fetch order details")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading order details...</div>
  }
  if (error || !order) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error || "Order not found"}</div>
  }

  // Parse shipping address if it's a string
  let shipping = order.shipping_address
  if (typeof shipping === "string") {
    try { shipping = JSON.parse(shipping) } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => router.push("/admin/orders")}
          className="mb-6 text-[#18608C] hover:text-[#17A0BF] font-semibold"
        >
          &larr; Back to Orders
        </button>
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-semibold">Order ID:</span> {order.id}</p>
            <p><span className="font-semibold">Status:</span> <span className="capitalize">{order.status}</span></p>
            <p><span className="font-semibold">Date:</span> {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}</p>
            <p><span className="font-semibold">Payment Method:</span> {order.payment_method?.replace(/_/g, " ")}</p>
            <p><span className="font-semibold">Total Amount:</span> ${parseFloat(order.total_amount).toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Customer Info:</p>
            <p>Name: {order.user?.name || user?.name || order.user_name || "-"}</p>
            <p>Email: {order.user?.email || user?.email || order.user_email || "-"}</p>
            <p>User ID: {order.user_id || order.user?.id || user?.id || "-"}</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          {shipping ? (
            <div className="text-gray-700 text-sm space-y-1">
              {shipping.region && <div>Region: {shipping.region}</div>}
              {shipping["address-direction"] && <div>Directions: {shipping["address-direction"]}</div>}
              {shipping.building && <div>Building: {shipping.building}</div>}
              {shipping.floor && <div>Floor: {shipping.floor}</div>}
              {shipping.phone && <div>Phone: {shipping.phone}</div>}
            </div>
          ) : (
            <div className="text-gray-500">No shipping address available.</div>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-2">Order Items</h2>
          {order.items && order.items.length > 0 ? (
            <table className="w-full border text-sm mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-2 border">{item.Product?.name || item.name || "-"}</td>
                    <td className="p-2 border text-center">{item.quantity}</td>
                    <td className="p-2 border text-center">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="p-2 border text-center">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500">No items found for this order.</div>
          )}
        </div>
      </div>
    </div>
  )
} 