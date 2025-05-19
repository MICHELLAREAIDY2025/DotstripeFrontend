"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/Cartcontext";
import Navbar from "@/app/Components/navbar";
import Footer from "@/app/Components/footer";

function CheckoutContent() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + (item.Product?.price || 0) * item.quantity,
    0
  );

  // Address state
  const [address, setAddress] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    country: "",
    phone: "",
  });

  // Payment state
  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const [selectedShippingFee, setSelectedShippingFee] = useState(0);

  // Validation functions
  const validateAddress = () => {
    if (!address.fullName || !address.streetAddress || !address.city || !address.country || !address.phone) {
      toast.error("Please fill in all address fields");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === "card") {
      if (!payment.cardName || !payment.cardNumber || !payment.expDate || !payment.cvv) {
        toast.error("Please fill in all payment fields");
        return false;
      }
      if (payment.cardNumber.length !== 16) {
        toast.error("Invalid card number");
        return false;
      }
      if (payment.cvv.length < 3) {
        toast.error("Invalid CVV");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateAddress()) return;
    if (step === 2 && !validatePayment()) return;
    setStep((prev) => prev + 1);
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product_id: item.Product?.id,
            quantity: item.quantity,
            price: item.Product?.price
          })),
          shipping_address: address,
          payment_method: paymentMethod,
          total_amount: total + selectedShippingFee,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      await clearCart();
      toast.success("Order placed successfully!");
      setStep(4);
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 mt-20">
        <div className="max-w-2xl mx-auto bg-white bg-opacity-10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Checkout</h2>

          {/* Step Indicators */}
          <div className="mb-8 flex justify-between">
            {["Shipping", "Payment", "Confirm", "Success"].map((label, index) => (
              <div
                key={index}
                className={`text-sm ${
                  step === index + 1
                    ? "text-[#17A0BF] font-bold"
                    : "text-gray-400"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Step 1 - Shipping */}
          {step === 1 && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                className="w-full p-3 rounded bg-white bg-opacity-80"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={address.streetAddress}
                onChange={(e) =>
                  setAddress({ ...address, streetAddress: e.target.value })
                }
                className="w-full p-3 rounded bg-white bg-opacity-80"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full p-3 rounded bg-white bg-opacity-80"
              />
              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                className="w-full p-3 rounded bg-white bg-opacity-80"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full p-3 rounded bg-white bg-opacity-80"
              />

              <div className="mt-6">
                <label className="block mb-2 text-sm font-medium text-white">
                  Shipping Method
                </label>
                <select
                  onChange={(e) =>
                    setSelectedShippingFee(Number(e.target.value))
                  }
                  className="w-full p-3 rounded bg-white bg-opacity-80"
                  defaultValue={0}
                >
                  <option value={0}>Standard Shipping (Free)</option>
                  <option value={10}>Express Shipping ($10)</option>
                  <option value={20}>Priority Shipping ($20)</option>
                </select>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-[#18608C] text-white py-3 rounded-md font-semibold hover:bg-[#17A0BF] transition-colors duration-300 mt-6"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2 - Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex gap-4">
                {["card", "bank", "cash"].map((method) => (
                  <button
                    key={method}
                    className={`px-4 py-2 rounded-md ${
                      paymentMethod === method
                        ? "bg-[#18608C] text-white"
                        : "bg-white bg-opacity-20 text-white"
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method === "card" && "Credit Card"}
                    {method === "bank" && "Bank Transfer"}
                    {method === "cash" && "Cash on Delivery"}
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={payment.cardName}
                    onChange={(e) =>
                      setPayment({ ...payment, cardName: e.target.value })
                    }
                    className="w-full p-3 rounded bg-white bg-opacity-80"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={payment.cardNumber}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        cardNumber: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16),
                      })
                    }
                    className="w-full p-3 rounded bg-white bg-opacity-80"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={payment.expDate}
                      onChange={(e) =>
                        setPayment({ ...payment, expDate: e.target.value })
                      }
                      className="w-full p-3 rounded bg-white bg-opacity-80"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={payment.cvv}
                      onChange={(e) =>
                        setPayment({
                          ...payment,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                        })
                      }
                      className="w-full p-3 rounded bg-white bg-opacity-80"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-[#18608C] text-white py-3 rounded-md font-semibold hover:bg-[#17A0BF] transition-colors duration-300"
              >
                Review Order
              </button>
            </div>
          )}

          {/* Step 3 - Confirm */}
          {step === 3 && (
            <div className="space-y-6 text-white">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Shipping Details</h3>
                <p>{address.fullName}</p>
                <p>{address.streetAddress}</p>
                <p>{`${address.city}, ${address.country}`}</p>
                <p>{address.phone}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Order Summary</h3>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.Product?.name} x {item.quantity}
                    </span>
                    <span>
                      ${((item.Product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-4">
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${selectedShippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span>${(total + selectedShippingFee).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full bg-[#18608C] text-white py-3 rounded-md font-semibold hover:bg-[#17A0BF] transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          )}

          {/* Step 4 - Success */}
          {step === 4 && (
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                Thank you for your order!
              </h3>
              <p className="mb-6">
                We'll send you an email with your order details shortly.
              </p>
              <button
                onClick={() => router.push("/what-we-do/products")}
                className="bg-[#18608C] text-white px-6 py-3 rounded-md hover:bg-[#17A0BF] transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
