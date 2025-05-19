"use client"

import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"

export default function EmptyCartState() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <ShoppingBag className="w-16 h-16 text-[#18608C]" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#18608C] mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to your cart and come back to checkout.</p>
        
        <button
          onClick={() => router.push("/what-we-do/products")}
          className="w-full bg-[#18608C] text-white py-3 px-4 rounded-md hover:bg-[#17A0BF] transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

