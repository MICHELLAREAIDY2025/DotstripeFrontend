"use client"

import { useState } from "react"
import { useOrders } from "@/context/OrderContext"
import { useOrderItems } from "@/context/OrderItemContext"
import OrderList from "../../components/orders/OrderList"
import OrderForm from "../../components/orders/OrderForm"
import OrderItemList from "../../components/orders/OrderItemList"
import OrderItemForm from "../../components/orders/OrderItemForm"

const AdminOrdersPage = () => {
  const [editingOrder, setEditingOrder] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  const { orders, loading: ordersLoading, addOrder, editOrder, removeOrder } = useOrders()

  const { orderItems, loading: itemsLoading, addOrderItem, editOrderItem, removeOrderItem } = useOrderItems()

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

  return (
    <div className="space-y-8 p-6">
      <section>
        <h1 className="text-2xl font-bold">Orders</h1>
        <OrderForm initialData={editingOrder} onSubmit={handleOrderSubmit} onCancel={() => setEditingOrder(null)} />
        <OrderList orders={orders} isLoading={ordersLoading} onEdit={setEditingOrder} onDelete={removeOrder} />
      </section>

      <section>
        <h2 className="text-xl font-bold">Order Items</h2>
        <OrderItemForm initialData={editingItem} onSubmit={handleItemSubmit} onCancel={() => setEditingItem(null)} />
        <OrderItemList
          orderItems={orderItems}
          isLoading={itemsLoading}
          onEdit={setEditingItem}
          onDelete={removeOrderItem}
        />
      </section>
    </div>
  )
}

export default AdminOrdersPage
