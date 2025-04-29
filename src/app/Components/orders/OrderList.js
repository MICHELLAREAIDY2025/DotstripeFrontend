"use client"

import { useState } from "react"
import { FiEdit, FiTrash, FiEye } from "react-icons/fi"
import { toast } from "react-toastify"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import Link from "next/link"

const OrderList = ({ orders = [], onEdit, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(
    (order) =>
      (order.id?.toString().includes(searchTerm) ||
        order.user_id?.toString().includes(searchTerm) ||
        order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter),
  )

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete order #${id}?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            onDelete(id)
            toast.success("Order deleted successfully")
          },
        },
        {
          label: "No",
        },
      ],
    })
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Orders List</h2>

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

      {filteredOrders.length === 0 ? (
        <p className="text-center py-4">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">User ID</th>
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
                  <td className="border p-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border p-2 text-center">${Number.parseFloat(order.total_amount).toFixed(2)}</td>
                  <td className="border p-2 text-center">{order.payment_method}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => onEdit(order)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <FiEdit className="inline-block h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-800 mr-2">
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
      )}
    </div>
  )
}

export default OrderList
