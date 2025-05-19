"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FiTrash, FiEdit } from "react-icons/fi"
import { validateAddress } from "@/app/Components/checkout/utils/validation"
import AddressForm from "@/app/Components/checkout/AddressForm"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const UsersPage = () => {
  const { user, hasAdminAccess } = useAuth()
  const router = useRouter()
  const formRef = useRef(null)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState("all")
  const [editUserId, setEditUserId] = useState(null)
  const [isFormExpanded, setIsFormExpanded] = useState(true)
  const [newUser, setNewUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    address: {
      region: "",
      "address-direction": "",
      phone: "",
      building: "",
      floor: "",
    },
    role: "customer",
  })
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    checkAdminStatus()
  }, [user])

  useEffect(() => {
    filterUsers()
  }, [roleFilter, users])

  const checkAdminStatus = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })

      if (response.data.user.role !== "admin") {
        router.push("/")
        return
      }

      setIsAdmin(true)
      fetchUsers()
    } catch (error) {
      console.error("Error checking admin status:", error)
      router.push("/login")
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      setUsers(response.data.users)
      setFilteredUsers(response.data.users)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
      setLoading(false)
    }
  }

  const filterUsers = () => {
    if (roleFilter === "all") {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(users.filter((user) => user.role === roleFilter))
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setFormErrors({})

    // Debug log for initial state
    console.log("Starting handleAddUser with newUser:", newUser)

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/
    if (!passwordRegex.test(newUser.password)) {
      console.log("Password validation failed")
      toast.error("Password must be at least 6 characters long, contain at least 1 uppercase letter and 1 number")
      return
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(newUser.email)) {
      console.log("Email validation failed")
      toast.error("Please enter a valid email address")
      return
    }

    if (!validateAddress(newUser.address)) {
      console.log("Address validation failed")
      return
    }

    try {
      const token = localStorage.getItem("token")
      console.log("Token:", token ? "Present" : "Missing")
      
      // Log the raw newUser data
      console.log("Raw newUser data:", newUser)

      // Format the user data according to the backend expectations
      const userData = {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
        address: JSON.stringify({
          region: newUser.address.region?.trim() || "",
          "address-direction": newUser.address["address-direction"]?.trim() || "",
          phone: newUser.address.phone?.trim() || "",
          building: newUser.address.building?.trim() || "",
          floor: newUser.address.floor?.trim() || ""
        })
      }

      // Log the formatted data being sent
      console.log("Formatted user data being sent:", userData)
      console.log("API URL:", `${API_URL}/api/users/register`)

      // Make the API call
      console.log("Making API call...")
      const response = await axios.post(`${API_URL}/api/users/register`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      })

      console.log("API Response:", response)

      if (response.status === 201) {
        console.log("User added successfully")
        await fetchUsers() // Wait for users to be fetched
        resetForm()
        toast.success("User added successfully!")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      console.error("Error headers:", error.response?.headers)
      console.error("Error config:", error.config)
      
      let errorMessage = "Failed to add user"
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    }
  }

  const handleDeleteUser = (userId, userName) => {
    confirmAlert({
      title: "Confirm Delete",
      message: (
        <div>
          Are you sure you want to delete user <strong>"{userName}"</strong>?
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const token = localStorage.getItem("token")
              await axios.delete(`${API_URL}/api/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              })
              setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
              setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
              toast.success("User deleted successfully!")
            } catch (error) {
              const errMsg = error.response?.data?.error || "Error deleting user. Please try again."
              toast.error(` ${errMsg}`)
            }
          },
        },
        {
          label: "No",
        },
      ],
    })
  }

  const handleEditUser = (user) => {
    // Parse the address if it's a string
    let address = {
      region: "",
      "address-direction": "",
      phone: "",
      building: "",
      floor: "",
    }

    try {
      if (typeof user.address === 'string') {
        const parsedAddress = JSON.parse(user.address)
        address = {
          region: parsedAddress.region || "",
          "address-direction": parsedAddress["address-direction"] || "",
          phone: parsedAddress.phone || "",
          building: parsedAddress.building || "",
          floor: parsedAddress.floor || "",
        }
      } else if (user.address && typeof user.address === 'object') {
        address = {
          region: user.address.region || "",
          "address-direction": user.address["address-direction"] || "",
          phone: user.address.phone || "",
          building: user.address.building || "",
          floor: user.address.floor || "",
        }
      }
    } catch (error) {
      console.error("Error parsing address:", error)
    }

    setEditUserId(user.id)
    setNewUser({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      password: "",
      address,
      role: user.role || "customer",
    })

    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setFormErrors({})

    // Debug log for initial state
    console.log("Starting handleUpdateUser with newUser:", newUser)

    // Validate email if it's being changed
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (newUser.email && !emailRegex.test(newUser.email)) {
      console.log("Email validation failed")
      toast.error("Please enter a valid email address")
      return
    }

    // Validate password if it's being changed
    if (newUser.password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/
      if (!passwordRegex.test(newUser.password)) {
        console.log("Password validation failed")
        toast.error("Password must be at least 6 characters long, contain at least 1 uppercase letter and 1 number")
        return
      }
    }

    if (!validateAddress(newUser.address)) {
      console.log("Address validation failed")
      return
    }

    try {
      const token = localStorage.getItem("token")
      console.log("Token:", token ? "Present" : "Missing")

      // Format the user data according to the backend expectations
      const userData = {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
        address: JSON.stringify({
          region: newUser.address.region?.trim() || "",
          "address-direction": newUser.address["address-direction"]?.trim() || "",
          phone: newUser.address.phone?.trim() || "",
          building: newUser.address.building?.trim() || "",
          floor: newUser.address.floor?.trim() || ""
        })
      }

      // Only include password if it's being changed
      if (newUser.password) {
        userData.password = newUser.password
      }

      // Log the formatted data being sent
      console.log("Formatted user data being sent:", userData)
      console.log("API URL:", `${API_URL}/api/users/${editUserId}`)

      // Make the API call
      console.log("Making API call...")
      const response = await axios.put(`${API_URL}/api/users/${editUserId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      })

      console.log("API Response:", response)

      if (response.status === 200) {
        console.log("User updated successfully")
        await fetchUsers() // Wait for users to be fetched
        resetForm()
        toast.success("User updated successfully!")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      console.error("Error headers:", error.response?.headers)
      console.error("Error config:", error.config)
      
      let errorMessage = "Failed to update user"
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    }
  }

  const resetForm = () => {
    setEditUserId(null)
    setNewUser({
      id: null,
      name: "",
      email: "",
      password: "",
      address: {
        region: "",
        "address-direction": "",
        phone: "",
        building: "",
        floor: "",
      },
      role: "customer",
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div 
          className="flex justify-between items-center cursor-pointer mb-4"
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <h2 className="text-xl font-bold">{editUserId ? "Edit User" : "Add New User"}</h2>
          <button className="text-gray-500 hover:text-gray-700">
            {isFormExpanded ? "▼" : "▶"}
          </button>
        </div>
        
        {isFormExpanded && (
          <form ref={formRef} onSubmit={editUserId ? handleUpdateUser : handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#E2C269] focus:border-[#E2C269]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#E2C269] focus:border-[#E2C269]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required={!editUserId}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#E2C269] focus:border-[#E2C269]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#E2C269] focus:border-[#E2C269]"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <AddressForm
              address={newUser.address}
              updateAddress={(address) => setNewUser({ ...newUser, address })}
              errors={formErrors}
            />

            <div className="flex justify-end space-x-2">
              {editUserId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditUserId(null)
                    resetForm()
                  }}
                  className="px-4 py-2 bg-gray-200 text-[#1B2930] rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-[#18608C] text-white rounded-md hover:bg-[#18608C]/90"
              >
                {editUserId ? "Update User" : "Add User"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Users</h2>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E2C269]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage
