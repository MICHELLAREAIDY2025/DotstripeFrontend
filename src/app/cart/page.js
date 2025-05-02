"use client"

import Link from "next/link"
import { useCart } from "../context/Cartcontext"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"
import { Minus, Plus, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

export default function Cart() {
  const { cartItems, loading, updateCartItem, removeCartItem } = useCart()

  // Handle quantity updates
  const handleQuantityUpdate = async (cartItemId, newQuantity, stock) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1")
      return
    }
    
    if (newQuantity > stock) {
      toast.error(`Only ${stock} item(s) available in stock`)
      return
    }

    try {
      const success = await updateCartItem(cartItemId, newQuantity)
      if (!success) {
        toast.error("Failed to update quantity. Please try again.")
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast.error("Failed to update quantity. Please try again.")
    }
  }

  // Handle item removal
  const handleRemove = async (cartItemId) => {
    try {
      const success = await removeCartItem(cartItemId)
      if (!success) {
        toast.error("Failed to remove item. Please try again.")
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item. Please try again.")
    }
  }

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
          <h1 className="text-3xl font-bold mb-6 text-white">Your Cart</h1>
          <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
            <p className="text-xl mb-4 text-white">Your cart is empty</p>
            <Link href="/">
              <button className="bg-[#18608C] text-white px-6 py-3 rounded-md hover:bg-[#17A0BF] transition-colors duration-300">
                Continue Shopping
              </button>
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
      <div className="flex-1 container mx-auto px-4 pt-40 md:pt-44 lg:pt-48 pb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Cart</h1>

        <div className="bg-white bg-opacity-10 rounded-lg p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                    {item.Product?.image_url && (
                      <img
                        src={item.Product.image_url}
                        alt={item.Product.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.Product?.name || "Product"}</h3>
                    <p className="text-sm text-gray-600">{item.Product?.category?.name || "Category"}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.Product?.description || "No description available"}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.Product?.stock || 0} available</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center gap-6">
                    <div className="inline-flex items-center border border-gray-200 rounded-md bg-white h-8">
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1, item.Product?.stock)}
                        className="h-full px-2 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="h-full px-4 flex items-center justify-center min-w-[40px] text-center text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1, item.Product?.stock)}
                        className="h-full px-2 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity >= (item.Product?.stock || 0)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-medium text-gray-900 min-w-[80px] text-right">
                      ${((item.Product?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-lg text-gray-900">
                Total: <span className="font-bold">${total.toFixed(2)}</span>
              </p>
            </div>
            <Link href="/checkout">
              <button className="bg-[#18608C] text-white px-8 py-3 rounded-md hover:bg-[#17A0BF] transition-colors duration-300">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
