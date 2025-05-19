"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { ToastContainer } from "react-toastify"
import { useCart } from "@/app/context/Cartcontext"
import "react-toastify/dist/ReactToastify.css"

import { fetchCheckoutData } from "./checkout/utils/api"
import { notify } from "./checkout/utils/toast"
import ProgressBar from "./ProgressBar"
import CheckoutForm from "./checkout/CheckoutForm"
import OrderSummary from "./checkout/OrderSummary"
import LoadingState from "./checkout/LoadingState"
import EmptyCartState from "./checkout/EmptyCartState"
import OrderConfirmation from "./checkout/OrderConfirmation"
import BackButton from "./checkout/BackButton"

export default function Checkout() {
  const { user } = useAuth()
  const { checkout } = useCart()
  const router = useRouter()
  const [state, setState] = useState({
    paymentMethod: "cod",
    cartItems: [],
    isLoading: true,
    isCartEmpty: false,
    orderPlaced: false,
    address: { phone: "", region: "", "address-direction": "", building: "", floor: "" },
    payment: { cardName: "", cardNumber: "", expDate: "", cvv: "" },
    orderSummary: { subtotal: 0, shipping: 0, total: 0 },
    orderId: null,
  })

  const updateState = (newState) => setState((prev) => ({ ...prev, ...newState }))

  // Load address from localStorage on mount (before backend fetch)
  useEffect(() => {
    const savedAddress = localStorage.getItem('savedAddress')
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress)
        setState((prev) => ({ ...prev, address: { ...prev.address, ...parsedAddress } }))
      } catch (error) {
        console.error('Error parsing saved address:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (!user) {
      notify("error", "Please log in to access checkout")
      router.push("/login?redirect=/checkout")
      return
    }

    fetchCheckoutData()
      .then(({ cartWithDetails, userAddress, shipping, isCartEmpty, orderSummary }) => {
        if (isCartEmpty) {
          return updateState({ isLoading: false, isCartEmpty: true })
        }
        // If userAddress is present, update localStorage
        if (userAddress && Object.keys(userAddress).length > 0) {
          try {
            localStorage.setItem('savedAddress', JSON.stringify(userAddress))
          } catch (error) {
            console.error('Error saving userAddress to localStorage:', error)
          }
        }
        updateState({
          cartItems: cartWithDetails,
          address: {
            ...userAddress,
            phone: userAddress.phone || "",
            region: userAddress.region || "",
            "address-direction": userAddress["address-direction"] || "",
            building: userAddress.building || "",
            floor: userAddress.floor || "",
          },
          orderSummary: orderSummary || { subtotal: 0, shipping: 0, total: 0 },
          isLoading: false,
        })
      })
      .catch((err) => {
        console.error("Error loading checkout data:", err)
        notify("error", err.response?.data?.error || "Failed to load checkout data. Please try again.")
        updateState({ isLoading: false })
      })
  }, [user, router])

     const placeOrder = async () => {
        try {
      if (!user) {
        notify("error", "Please log in to complete your checkout")
        router.push("/login?redirect=/checkout")
        return false
      }
        await checkout()
        return true
        } catch (error) {
    console.error("Error clearing cart:", error)
      notify("error", "Failed to complete checkout. Please try again.")
        return false
  }
}

  // Conditional rendering based on state
  if (state.isLoading) return <LoadingState />
  if (state.isCartEmpty) return <EmptyCartState />
  if (state.orderPlaced) return <OrderConfirmation orderId={state.orderId} />

  const updateAddress = (newAddress) => {
    setState((prev) => {
      const updated = { ...prev, address: { ...prev.address, ...newAddress } }
      try {
        localStorage.setItem('savedAddress', JSON.stringify(updated.address))
      } catch (error) {
        console.error('Error saving address to localStorage:', error)
      }
      return updated
    })
  }

  const updatePayment = (newPayment) => {
    setState((prev) => ({
      ...prev,
      payment: { ...prev.payment, ...newPayment }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <ProgressBar currentStep={1} />
        
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
          <CheckoutForm
            paymentMethod={state.paymentMethod}
            address={state.address}
            payment={state.payment}
            updateState={updateState}
            updateAddress={updateAddress}
            updatePayment={updatePayment}
              placeOrder={placeOrder}
              cartItems={state.cartItems}
              orderSummary={state.orderSummary}
            />
          </div>
          
          <div>
            <OrderSummary
              items={state.cartItems}
              subtotal={state.orderSummary.subtotal}
              shipping={state.orderSummary.shipping}
              total={state.orderSummary.total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}