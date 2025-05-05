"use client"

import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrderConfirmation({ orderId }) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-[#18608C]" />
        </div>
        
        <h1 className="text-2xl font-bold text-[#18608C] mb-4">Order Confirmed!</h1>
        
        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            Your order #{orderId} has been successfully placed.
          </p>
          <p className="text-[#18608C] font-medium">
            Your order is currently being prepared with care!
          </p>
          <p className="text-[#18608C] font-medium">
            Thank you for your purchase!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/orderHistory")}
            className="w-full bg-[#18608C] text-white py-3 px-4 rounded-md hover:bg-[#17A0BF] transition-colors duration-300"
          >
            View Order History
          </button>
          <button
            onClick={() => router.push("/products")}
            className="w-full bg-white text-[#18608C] border border-[#18608C] py-3 px-4 rounded-md hover:bg-[#18608C] hover:text-white transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

