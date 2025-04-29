"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getOrders, createOrder, updateOrder, deleteOrder } from "@/lib/api"
import { toast } from "react-toastify"

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    console.log("[OrderContext] Fetching orders...")
    setLoading(true)
    setError(null)

    try {
      const data = await getOrders()
      console.log("[OrderContext] API response:", data)

      if (data && Array.isArray(data)) {
        setOrders(data)
      } else {
        console.warn("[OrderContext] No orders data returned or invalid format")
        setOrders([])
      }
    } catch (err) {
      console.error("[OrderContext] Failed to fetch orders:", err)
      setError(err.message || "Failed to fetch orders")
      toast.error("Failed to fetch orders")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const addOrder = async (orderData) => {
    try {
      const result = await createOrder(orderData)
      if (result) {
        toast.success("Order created successfully")
        fetchOrders()
      } else {
        console.warn("[OrderContext] Order create endpoint may not be working as expected")
      }
    } catch (err) {
      console.error("[OrderContext] Failed to create order:", err)
      toast.error("Failed to create order")
    }
  }

  const editOrder = async (id, orderData) => {
    try {
      const result = await updateOrder(id, orderData)
      if (result) {
        toast.success("Order updated successfully")
        fetchOrders()
      } else {
        console.warn("[OrderContext] Order update endpoint may not be working as expected")
      }
    } catch (err) {
      console.error("[OrderContext] Failed to update order:", err)
      toast.error("Failed to update order")
    }
  }

  const removeOrder = async (id) => {
    try {
      const result = await deleteOrder(id)
      if (result) {
        toast.success("Order deleted successfully")
        fetchOrders()
      } else {
        console.warn("[OrderContext] Order delete endpoint may not be working as expected")
      }
    } catch (err) {
      console.error("[OrderContext] Failed to delete order:", err)
      toast.error("Failed to delete order")
    }
  }

  useEffect(() => {
    console.log("OrderProvider: useEffect triggered")
    fetchOrders()
  }, [])

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        addOrder,
        editOrder,
        removeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => useContext(OrderContext)
