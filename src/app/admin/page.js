"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { BarChart3, ShoppingCart, Package, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [years, setYears] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        withCredentials: true,
      })

      const allOrders = response.data

      const deliveredOrders = allOrders.filter((order) => order.status === "delivered")

      const orderYears = deliveredOrders.map((order) => new Date(order.createdAt).getFullYear())
      const uniqueYears = ["all", ...new Set(orderYears.sort((a, b) => b - a))]

      setYears(uniqueYears)
      setOrders(deliveredOrders)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBestSellers()
  }, [selectedYear, selectedMonth])

  const fetchBestSellers = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/best-sellers?year=${selectedYear}&month=${selectedMonth}`

      const response = await axios.get(url, { withCredentials: true })

      setTopProducts(response.data.length > 0 ? [...response.data] : [])
    } catch (error) {
      console.error("Error fetching best-selling products:", error.response?.data || error.message)
      setTopProducts([])
    }
  }

  useEffect(() => {
    filterOrders()
  }, [selectedYear, selectedMonth, orders])

  const filterOrders = () => {
    let filtered = [...orders]

    if (selectedYear !== "all") {
      filtered = filtered.filter((order) => new Date(order.createdAt).getFullYear() === Number.parseInt(selectedYear))
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt).toLocaleString("default", { month: "long" }) === selectedMonth,
      )
    }

    setFilteredOrders(filtered)
    processSalesData(filtered)
  }

  const processSalesData = (filtered) => {
    const salesSummary = {}

    filtered.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      const orderMonth = orderDate.toLocaleString("default", { month: "long" })

      if (!salesSummary[orderMonth]) {
        salesSummary[orderMonth] = { month: orderMonth, totalOrders: 0, totalSales: 0 }
      }

      salesSummary[orderMonth].totalOrders += 1
      salesSummary[orderMonth].totalSales += order.total_price
    })

    setSalesData(Object.values(salesSummary))
  }

  const handleYearChange = (e) => {
    const newYear = e.target.value
    setSelectedYear(newYear)

    if (newYear === "all") {
      setSelectedMonth("all")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[#031626] flex items-center gap-2">
        <BarChart3 className="text-[#18608C]" /> Admin Dashboard
      </h1>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
        <select
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#18608C]"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year === "all" ? "All Years" : year}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#18608C]"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          disabled={selectedYear === "all"}
        >
          {[
            "all",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={index} value={month}>
              {month === "all" ? "All Months" : month}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Sales & Orders Charts Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="shadow-lg p-6 bg-white rounded-lg">
              <h2 className="text-xl font-semibold text-[#031626] flex items-center gap-2 mb-4">
                <ShoppingCart className="text-[#18608C]" /> Total Sales ($) by Month
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Total Sales"]} />
                    <Legend />
                    <Bar dataKey="totalSales" fill="#18608C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="shadow-lg p-6 bg-white rounded-lg">
              <h2 className="text-xl font-semibold text-[#031626] flex items-center gap-2 mb-4">
                <TrendingUp className="text-[#17A0BF]" /> Orders Trend
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalOrders" stroke="#17A0BF" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Best-Selling Products */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#031626] flex items-center gap-3">
              <Package className="text-[#0E4459]" />
              Top Best-Selling Products
            </h2>

            <ul className="space-y-3 text-gray-700">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <li key={index} className="leading-relaxed">
                    <span className="font-semibold text-[#18608C]">{product.product_name}</span> has been sold{" "}
                    <span className="font-bold">{product.totalSales}</span> time
                    {product.totalSales !== 1 ? "s" : ""}. You currently have{" "}
                    <span className="font-bold">{product.stock}</span> in stock.
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No best-selling data available.</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
