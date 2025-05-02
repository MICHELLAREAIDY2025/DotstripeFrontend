"use client"

import { useAuth } from "@/app/context/AuthContext"
import { useCart } from "../context/Cartcontext"
import { toast } from "react-toastify"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, Trash2 } from "lucide-react"

export default function CartPopup({ isOpen, onClose }) {
  const { user } = useAuth()
  const { cartItems, cartCount, updateCartItem, removeCartItem, clearCart } = useCart()

  // Update quantity
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

  // Remove from cart
  const handleRemove = async (cartItemId) => {
    const success = await removeCartItem(cartItemId)
    if (!success) {
      toast.error("Failed to remove item. Please try again.")
    }
  }

  // Clear entire cart
  const handleClearCart = async () => {
    const success = await clearCart()
    if (!success) {
      toast.error("Failed to clear cart. Please try again.")
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.Product?.price || 0
    return sum + price * item.quantity
  }, 0)

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return (Math.round(price * 100) / 100).toFixed(2)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop - darkened background */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      {/* Cart panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ShoppingBag className="mr-2" size={20} />
                Your Cart
              </h2>
              <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                <span className="sr-only">Close panel</span>
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            {/* Cart content */}
            <div className="flex-1 px-4 py-6 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart!</p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-medium text-gray-900">Cart Items</h3>
                    <button
                      onClick={handleClearCart}
                      className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Clear Cart
                    </button>
                  </div>
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={`${item.product_id}-${item.id || item.quantity}`} className="py-6 flex">
                          {/* Product Image */}
                          {item.Product?.image_url && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                              <img
                                src={item.Product.image_url || "/placeholder.svg"}
                                alt={item.Product.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.Product?.name || "Product unavailable"}</h3>
                                <p className="ml-4">${formatPrice(item.Product?.price || 0)}</p>
                              </div>
                              {item.Product?.description && (
                                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                  {item.Product.description}
                                </p>
                              )}
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <p className="text-gray-500 mr-4">{item.Product?.stock || 0} available</p>
                                <div className="flex items-center border rounded-md">
                                  <button
                                    onClick={() => handleQuantityUpdate(item.id, item.quantity - 1, item.Product?.stock)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="px-4 py-1 min-w-[40px] text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => handleQuantityUpdate(item.id, item.quantity + 1, item.Product?.stock)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.quantity >= (item.Product?.stock || 0)}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => handleRemove(item.id)}
                                  className="font-medium text-[#4A8C8C] hover:text-[#3a7070]"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            {/* Footer with total and checkout button */}
            {user && cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>${formatPrice(subtotal)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="flex justify-center items-center px-6 py-3 rounded-md bg-[#18608C] text-white hover:bg-[#17A0BF] transition-colors duration-300 w-full text-base font-medium shadow-sm"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    className="flex justify-center items-center px-6 py-3 rounded-md bg-[#18608C] text-white hover:bg-[#17A0BF] transition-colors duration-300 w-full text-base font-medium shadow-sm"
                    onClick={onClose}
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}