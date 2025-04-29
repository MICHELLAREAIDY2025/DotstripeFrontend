"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/hooks/useProductHooks"
import { toast } from "react-toastify"

const OrderItemForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    order_id: "",
    product_id: "",
    quantity: 1,
    price: "",
  })

  const { data: products = [] } = useProducts()

  useEffect(() => {
    if (initialData) {
      setFormData({
        order_id: initialData.order_id || "",
        product_id: initialData.product_id || "",
        quantity: initialData.quantity || 1,
        price: initialData.price || "",
      })
    } else {
      setFormData({
        order_id: "",
        product_id: "",
        quantity: 1,
        price: "",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-fill price when product is selected
    if (name === "product_id") {
      const selectedProduct = products.find((p) => p.id.toString() === value)
      if (selectedProduct) {
        setFormData((prev) => ({ ...prev, price: selectedProduct.price }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.order_id || !formData.product_id || !formData.quantity || !formData.price) {
      toast.error("Please fill in all required fields")
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Order Item" : "Add Order Item"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
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
            {initialData ? "Update Item" : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderItemForm
