"use client"

import { useState } from "react"
import { FiEdit, FiTrash } from "react-icons/fi"
import { toast } from "react-toastify"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import { useProducts } from "@/hooks/useProductHooks"

const OrderItemList = ({ orderItems = [], onEdit, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [orderFilter, setOrderFilter] = useState("")
  const { data: products = [] } = useProducts()

  // Get unique order IDs for filtering
  const uniqueOrderIds = [...new Set(orderItems.map((item) => item.order_id))]

  // Filter order items based on search term and order ID
  const filteredItems = orderItems.filter(
    (item) =>
      (item.product_id?.toString().includes(searchTerm) ||
        getProductName(item.product_id)?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (orderFilter === "" || item.order_id?.toString() === orderFilter),
  )

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete this order item?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            onDelete(id)
            toast.success("Order item deleted successfully")
          },
        },
        {
          label: "No",
        },
      ],
    })
  }

  const getProductName = (productId) => {
    const product = products.find((p) => p.id.toString() === productId?.toString())
    return product ? product.name : "Unknown Product"
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order items...</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Order Items List</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md flex-grow"
        />

        <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)} className="border p-2 rounded-md">
          <option value="">All Orders</option>
          {uniqueOrderIds.map((orderId) => (
            <option key={orderId} value={orderId}>
              Order #{orderId}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center py-4">No order items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2 text-center">{item.id}</td>
                  <td className="border p-2 text-center">{item.order_id}</td>
                  <td className="border p-2">{getProductName(item.product_id)}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-center">${Number.parseFloat(item.price).toFixed(2)}</td>
                  <td className="border p-2 text-center">
                    ${(Number.parseFloat(item.price) * Number.parseInt(item.quantity)).toFixed(2)}
                  </td>
                  <td className="border p-2 text-center">
                    <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <FiEdit className="inline-block h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                      <FiTrash className="inline-block h-5 w-5" />
                    </button>
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

export default OrderItemList
