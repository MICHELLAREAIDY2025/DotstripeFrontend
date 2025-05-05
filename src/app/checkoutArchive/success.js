"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { getOrderById } from "@/src/lib/api" // Adjust import as needed

export default function OrderSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(setOrder)
    }
  }, [orderId])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#031626] text-white">
        <div>Loading order details...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#031626] text-white">
      <div className="bg-[#0A2235] p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4 text-green-400">Order Placed Successfully!</h2>
        <p className="mb-2">Order Number: <span className="font-semibold">{order._id}</span></p>
        <p className="mb-2">Status: <span className="font-semibold capitalize">{order.status}</span></p>
        <p className="mb-6">Thank you for your order! We will contact you soon to confirm delivery.</p>
        <Link href="/orderHistory" className="text-[#17A0BF] underline">View Order History</Link>
      </div>
    </div>
  )
}
