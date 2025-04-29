"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem } from "@/lib/api"
import { toast } from "react-toastify"

const OrderItemContext = createContext()

export const OrderItemProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrderItems = async () => {
    console.log("[OrderItemContext] Fetching order items...")
    setLoading(true)
    setError(null)

    try {
      // This will now handle 404 errors gracefully
      const data = await getOrderItems()
      console.log("[OrderItemContext] API response:", data)

      // If we got data back, use it
      if (data && Array.isArray(data)) {
        setOrderItems(data)
      } else {
        // Otherwise, use an empty array
        console.warn("[OrderItemContext] No order items data returned or invalid format")
        setOrderItems([])
      }
    } catch (err) {
      console.error("[OrderItemContext] Failed to fetch order items:", err)
      setError(err.message || "Failed to fetch order items")
      // Don't show toast for 404 errors since we're handling them gracefully
      if (!(err.response && err.response.status === 404)) {
        toast.error("Failed to fetch order items")
      }
      setOrderItems([])
    } finally {
      setLoading(false)
    }
  }

  const addOrderItem = async (itemData) => {
    try {
      const result = await createOrderItem(itemData)
      if (result) {
        toast.success("Order item added successfully")
        fetchOrderItems()
      } else {
        // Handle case where API endpoint doesn't exist
        console.warn("[OrderItemContext] Order item endpoint may not exist")
        toast.warning("Order item functionality may not be available")
      }
    } catch (err) {
      console.error("[OrderItemContext] Failed to add order item:", err)
      toast.error("Failed to add order item")
    }
  }

  const editOrderItem = async (id, itemData) => {
    try {
      const result = await updateOrderItem(id, itemData)
      if (result) {
        toast.success("Order item updated successfully")
        fetchOrderItems()
      } else {
        console.warn("[OrderItemContext] Order item update endpoint may not exist")
        toast.warning("Order item update functionality may not be available")
      }
    } catch (err) {
      console.error("[OrderItemContext] Failed to update order item:", err)
      toast.error("Failed to update order item")
    }
  }

  const removeOrderItem = async (id) => {
    try {
      const result = await deleteOrderItem(id)
      if (result) {
        toast.success("Order item removed successfully")
        fetchOrderItems()
      } else {
        console.warn("[OrderItemContext] Order item delete endpoint may not exist")
        toast.warning("Order item delete functionality may not be available")
      }
    } catch (err) {
      console.error("[OrderItemContext] Failed to remove order item:", err)
      toast.error("Failed to remove order item")
    }
  }

  useEffect(() => {
    console.log("OrderItemProvider: useEffect triggered")
    fetchOrderItems()
  }, [])

  return (
    <OrderItemContext.Provider
      value={{
        orderItems,
        loading,
        error,
        fetchOrderItems,
        addOrderItem,
        editOrderItem,
        removeOrderItem,
      }}
    >
      {children}
    </OrderItemContext.Provider>
  )
}

export const useOrderItems = () => useContext(OrderItemContext)
