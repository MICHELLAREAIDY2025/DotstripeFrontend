"use client"

import Link from "next/link"
import { useCart } from "../context/Cartcontext"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"

export default function Cart() {
  const { cartItems, loading } = useCart()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your cart...</div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link href="/">
              <button className="btn-primary">Continue Shopping</button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    const price = item.Product?.price || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="bg-white bg-opacity-10 rounded-lg p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-600 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden">
                    {item.Product?.image_url && (
                      <img
                        src={item.Product.image_url}
                        alt={item.Product.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.Product?.name || "Product"}</h3>
                    <p className="text-sm text-gray-400">{item.Product?.category?.name || "Category"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span>{item.quantity}</span>
                  </div>
                  <div className="font-medium">${((item.Product?.price || 0) * item.quantity).toFixed(2)}</div>
                  {/* Remove button could be added here if needed */}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-lg">
                Total: <span className="font-bold">${total.toFixed(2)}</span>
              </p>
            </div>
            <Link href="/checkout">
              <button className="btn-primary">Checkout</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
