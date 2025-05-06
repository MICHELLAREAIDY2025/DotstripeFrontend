"use client"

import { useState } from "react"
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa"
import axios from "axios"
import { useRouter } from "next/navigation"
import { validateAddress, validatePayment } from "./utils/validation"
import { notify } from "./utils/toast"
import PaymentForm from "./PaymentForm"
import AddressForm from "./AddressForm"
import { createOrder } from "../../../lib/api"
import { useAuth } from "@/app/context/AuthContext"

export default function CheckoutForm({ paymentMethod, address, payment, updateState, updateAddress, updatePayment, placeOrder, cartItems, orderSummary }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleCheckout = async () => {
    try {
      if (!user) {
        notify("error", "Please log in to complete your checkout")
        router.push("/login?redirect=/checkout")
        return
      }

      if (!validateAddress(address)) return
      if (paymentMethod === "paytab" && !validatePayment(payment)) return
      setIsSubmitting(true)

      if (paymentMethod === "cod") {
        // Build items array as backend expects
        const items = cartItems.map(item => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: item.price
        }));

        const payload = {
          items,
          shipping_address: JSON.stringify(address),
          payment_method: "cash_on_delivery",
          total_amount: orderSummary?.total || 0
        };

        console.log("Order payload being sent:", payload);

        const order = await createOrder(payload)
        const success = await placeOrder()
        
        if (success) {
        updateState({ orderPlaced: true, orderId: order._id || order.id })
          notify("success", "Your order has been placed successfully!")
        } else {
          notify("error", "Failed to place order. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      notify("error", error.response?.data?.message || "Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <AddressForm address={address} updateAddress={updateAddress} />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Method</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="cod"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => updateState({ paymentMethod: "cod" })}
              className="h-4 w-4 text-[#18608C] focus:ring-[#18608C]"
            />
            <label htmlFor="cod" className="flex items-center space-x-2">
              <FaMoneyBillWave className="text-[#18608C]" />
              <span>Cash on Delivery</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="paytab"
              name="payment"
              value="paytab"
              checked={paymentMethod === "paytab"}
              onChange={() => updateState({ paymentMethod: "paytab" })}
              className="h-4 w-4 text-[#18608C] focus:ring-[#18608C]"
            />
            <label htmlFor="paytab" className="flex items-center space-x-2">
              <FaCreditCard className="text-[#18608C]" />
              <span>PayTab</span>
            </label>
          </div>
        </div>
      </div>

      {paymentMethod === "paytab" && (
        <PaymentForm payment={payment} updatePayment={updatePayment} />
      )}
 
      <button
        onClick={handleCheckout}
        disabled={isSubmitting}
        className="w-full bg-[#18608C] text-white py-3 px-4 rounded-md hover:bg-[#17A0BF] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </div>
  )
}

