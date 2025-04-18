"use client"

import { useEffect, useState } from "react"
import { getCart } from "@/lib/api"
import Link from "next/link"

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart()
        setCart(cartData)
      } catch (err) {
        console.error("Error fetching cart:", err)
        setError("Failed to load your cart. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your cart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    )
  }

  // Placeholder for empty cart
  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link href="/">
            <button className="btn-primary">Continue Shopping</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="bg-white bg-opacity-10 rounded-lg p-6">
        {/* This is a placeholder for the actual cart implementation */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between border-b border-gray-600 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-md"></div>
                <div>
                  <h3 className="font-medium">Product {item}</h3>
                  <p className="text-sm text-gray-400">Category</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <button className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">-</button>
                  <span>1</span>
                  <button className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">+</button>
                </div>
                <div className="font-medium">${(item * 19.99).toFixed(2)}</div>
                <button className="text-red-400">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-lg">
              Total: <span className="font-bold">$59.97</span>
            </p>
          </div>
          <button className="btn-primary">Checkout</button>
        </div>
      </div>
    </div>
  )
}
