"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { FiUsers, FiShoppingBag, FiDollarSign } from "react-icons/fi"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    monthlyRevenue: []
  })
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("Access denied. Admin privileges required.")
      router.push("/login?redirect=/admin/dashboard")
      return
    }
    fetchStats()
  }, [user, isAuthenticated, router])

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          withCredentials: true
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          withCredentials: true
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          withCredentials: true
        })
      ])

      const orders = ordersRes.data
      const totalRevenue = orders.reduce((sum, order) => 
        sum + (parseFloat(order.total_amount) || 0), 0
      )

      // Calculate monthly revenue
      const monthlyRevenue = orders.reduce((acc, order) => {
        const date = new Date(order.created_at)
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
        acc[monthYear] = (acc[monthYear] || 0) + (parseFloat(order.total_amount) || 0)
        return acc
      }, {})

      setStats({
        totalUsers: usersRes.data.length,
        totalProducts: productsRes.data.length,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, amount]) => ({
          month,
          amount
        }))
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error("Failed to fetch dashboard statistics")
    } finally {
      setLoading(false)
    }
  }

  const chartData = {
    labels: stats.monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: stats.monthlyRevenue.map(item => item.amount),
        backgroundColor: "#18608C",
        borderRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Revenue",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h2 className="text-3xl font-bold text-[#18608C]">{stats.totalUsers}</h2>
            </div>
            <FiUsers className="text-4xl text-[#18608C] opacity-50" />
          </div>
            </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h2 className="text-3xl font-bold text-[#18608C]">{stats.totalProducts}</h2>
            </div>
            <FiShoppingBag className="text-4xl text-[#18608C] opacity-50" />
          </div>
            </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h2 className="text-3xl font-bold text-[#18608C]">
                ${stats.totalRevenue.toFixed(2)}
              </h2>
            </div>
            <FiDollarSign className="text-4xl text-[#18608C] opacity-50" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
