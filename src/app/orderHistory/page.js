"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../Components/navbar";
import Footer from "../Components/footer";
import { notify } from "@/app/Components/checkout/utils/toast";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(""); // Start Date filter
  const [endDate, setEndDate] = useState(""); // End Date filter
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      notify("error", "Please log in to view your orders");
      router.push("/login?redirect=/orderHistory");
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user`, {
        withCredentials: true,
      });
      
      // Ensure total_amount is a number
      const formattedOrders = response.data.map(order => ({
        ...order,
        total_amount: parseFloat(order.total_amount) || 0,
        created_at: order.created_at || order.createdAt,
        status: order.status || 'pending'
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      notify("error", "Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply Date Filter
  const handleSearch = () => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders); // If no date selected, show all orders
      return;
    }

    const filtered = orders.filter(order => {
      if (!order.created_at) return false; // Handle missing created_at
      
      const orderDate = new Date(order.created_at).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
      console.log(`Order Date: ${orderDate}, Start Date: ${startDate}, End Date: ${endDate}`);

      if (startDate && endDate) {
        return orderDate >= startDate && orderDate <= endDate;
      } else if (startDate) {
        return orderDate >= startDate;
      } else if (endDate) {
        return orderDate <= endDate;
      }
      return true;
    });

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-xl">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 pt-24 pb-12">
          <h1 className="text-3xl font-bold mb-6">Order History</h1>
          <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
            <p className="text-xl mb-4">You haven't placed any orders yet</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-[#18608C] text-white px-6 py-3 rounded-md hover:bg-[#17A0BF] transition-colors duration-300"
            >
              Start Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                    <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status || 'pending'}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {order.OrderItems?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                            {item.Product?.image_url && (
                              <img
                                src={item.Product.image_url}
                                alt={item.Product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{item.Product?.name || "Product unavailable"}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold">${order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">{order.payment_method?.replace(/_/g, " ") || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrdersHistory;
