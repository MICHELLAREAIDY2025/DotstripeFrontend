"use client"

import { useState } from "react"
import { useOrders } from "@/app/context/OrderContext"
import { useOrderItems } from "@/app/context/OrderItemContext"
import OrderList from "../../components/orders/OrderList"
import OrderForm from "../../components/orders/OrderForm"
import OrderItemList from "../../components/orders/OrderItemList"
import OrderItemForm from "../../components/orders/OrderItemForm"
import ProtectAdminRoute from "@/app/Components/AdminProtectedRoute"

const AdminOrdersPage = () => {
  const [editingOrder, setEditingOrder] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  const { orders, loading: ordersLoading, error: ordersError, addOrder, editOrder, removeOrder } = useOrders()

  const {
    orderItems,
    loading: itemsLoading,
    error: itemsError,
    addOrderItem,
    editOrderItem,
    removeOrderItem,
  } = useOrderItems()

  const handleOrderSubmit = (data) => {
    if (editingOrder) {
      editOrder(editingOrder.id, data)
    } else {
      addOrder(data)
    }
    setEditingOrder(null)
  }

  const handleItemSubmit = (data) => {
    if (editingItem) {
      editOrderItem(editingItem.id, data)
    } else {
      addOrderItem(data)
    }
    setEditingItem(null)
  }

  // Check if order items functionality is available
  const orderItemsAvailable = !itemsError || itemsError.indexOf("404") === -1

  return (
    <ProtectAdminRoute>
      <div className="space-y-8 p-6">
        <section>
          <h1 className="text-2xl font-bold">Orders</h1>
          <OrderForm initialData={editingOrder} onSubmit={handleOrderSubmit} onCancel={() => setEditingOrder(null)} />
          <OrderList orders={orders} isLoading={ordersLoading} onEdit={setEditingOrder} onDelete={removeOrder} />
        </section>

        {orderItemsAvailable ? (
          <section>
            <h2 className="text-xl font-bold">Order Items</h2>
            <OrderItemForm
              initialData={editingItem}
              onSubmit={handleItemSubmit}
              onCancel={() => setEditingItem(null)}
            />
            <OrderItemList
              orderItems={orderItems}
              isLoading={itemsLoading}
              onEdit={setEditingItem}
              onDelete={removeOrderItem}
            />
          </section>
        ) : (
          <section className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <h2 className="text-xl font-bold text-yellow-700">Order Items</h2>
            <p className="text-yellow-600 mt-2">
              Order items functionality appears to be unavailable. The API endpoint for order items may not exist.
            </p>
          </section>
        )}

        {/* Debug information in development */}
        {process.env.NODE_ENV !== "production" && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <p>Orders API Status: {ordersError ? `Error: ${ordersError}` : "OK"}</p>
            <p>Order Items API Status: {itemsError ? `Error: ${itemsError}` : "OK"}</p>
            <p>API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
          </div>
        )}
      </div>
    </ProtectAdminRoute>
  )
}

export default AdminOrdersPage
