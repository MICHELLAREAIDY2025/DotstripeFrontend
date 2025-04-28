"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getOrders, createOrder, updateOrder, deleteOrder } from "../lib/api"
import { toast } from "react-toastify"

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    console.log("[OrderContext] Fetching orders...")
    setLoading(true)
    try {
      const data = await getOrders()
      console.log("[OrderContext] API response:", data)
      setOrders(data || [])
    } catch (err) {
      console.error("[OrderContext] Failed to fetch orders:", err)
      toast.error("Failed to fetch orders")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const addOrder = async (orderData) => {
    try {
      await createOrder(orderData)
      toast.success("Order created successfully")
      fetchOrders()
    } catch (err) {
      console.error("[OrderContext] Failed to create order:", err)
      toast.error("Failed to create order")
    }
  }

  const editOrder = async (id, orderData) => {
    try {
      await updateOrder(id, orderData)
      toast.success("Order updated successfully")
      fetchOrders()
    } catch (err) {
      console.error("[OrderContext] Failed to update order:", err)
      toast.error("Failed to update order")
    }
  }

  const removeOrder = async (id) => {
    try {
      await deleteOrder(id)
      toast.success("Order deleted successfully")
      fetchOrders()
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
