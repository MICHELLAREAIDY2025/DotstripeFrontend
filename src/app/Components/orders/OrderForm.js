"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

const OrderForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    status: "pending",
    total_amount: "",
    shipping_address: "",
    payment_method: "credit_card",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        user_id: initialData.user_id || "",
        status: initialData.status || "pending",
        total_amount: initialData.total_amount || "",
        shipping_address: initialData.shipping_address || "",
        payment_method: initialData.payment_method || "credit_card",
      })
    } else {
      setFormData({
        user_id: "",
        status: "pending",
        total_amount: "",
        shipping_address: "",
        payment_method: "credit_card",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.user_id || !formData.total_amount || !formData.shipping_address) {
      toast.error("Please fill in all required fields")
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Order" : "Create New Order"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
          <textarea
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          {initialData && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="px-4 py-2 bg-[#18608C] text-white rounded-md hover:bg-[#18608C]/90">
            {initialData ? "Update Order" : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderForm
