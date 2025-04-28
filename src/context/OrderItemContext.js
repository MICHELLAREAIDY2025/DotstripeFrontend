"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem } from "../lib/api"
import { toast } from "react-toastify"

const OrderItemContext = createContext()

export const OrderItemProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrderItems = async () => {
    console.log("[OrderItemContext] Fetching order items...")
    setLoading(true)
    try {
      const data = await getOrderItems()
      console.log("[OrderItemContext] API response:", data)
      setOrderItems(data || [])
    } catch (err) {
      console.error("[OrderItemContext] Failed to fetch order items:", err)
      toast.error("Failed to fetch order items")
      setOrderItems([])
    } finally {
      setLoading(false)
    }
  }

  const addOrderItem = async (itemData) => {
    try {
      await createOrderItem(itemData)
      toast.success("Order item added successfully")
      fetchOrderItems()
    } catch (err) {
      console.error("[OrderItemContext] Failed to add order item:", err)
      toast.error("Failed to add order item")
    }
  }

  const editOrderItem = async (id, itemData) => {
    try {
      await updateOrderItem(id, itemData)
      toast.success("Order item updated successfully")
      fetchOrderItems()
    } catch (err) {
      console.error("[OrderItemContext] Failed to update order item:", err)
      toast.error("Failed to update order item")
    }
  }

  const removeOrderItem = async (id) => {
    try {
      await deleteOrderItem(id)
      toast.success("Order item removed successfully")
      fetchOrderItems()
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
