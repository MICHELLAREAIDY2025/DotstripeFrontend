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

  const checkAdminStatus = () => {
    const storedRole = localStorage.getItem("role")
    const token = localStorage.getItem("token")

    console.log("Checking admin status - Role:", storedRole)
    console.log("Checking admin status - Token:", token ? "Present" : "Missing")

    if (storedRole === "admin" && token) {
      setIsAdmin(true)
      fetchUsers()
    } else if (user && user.role === "admin") {
      setIsAdmin(true)
      fetchUsers()
    } else {
      setIsAdmin(false)
      toast.error("Access denied. Admins only.")
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication token missing")
        setLoading(false)
        return
      }

      // Ensure the token is set in the headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      const res = await axios.get(`${API_URL}/api/users`, {
        withCredentials: true,
      })

      console.log("Users API response:", res.data)

      // Handle different response formats
      let usersData = []
      if (res.data && Array.isArray(res.data.users)) {
        usersData = res.data.users
      } else if (res.data && Array.isArray(res.data)) {
        usersData = res.data
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        usersData = res.data.data
      }

      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Error fetching users: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    setFilteredUsers(users.filter((user) => roleFilter === "all" || user.role === roleFilter))
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setFormErrors({})

    if (!validateAddress(newUser.address)) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      await axios.post(`${API_URL}/api/users/register`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      fetchUsers()
      resetForm()
      toast.success("User added successfully!")
    } catch (error) {
      console.error("Error adding user:", error)
      toast.error("Failed to add user: " + (error.response?.data?.message || error.message))
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
    const address = {
      region: user.address?.region || "",
      "address-direction": user.address?.["address-direction"] || "",
      phone: user.address?.phone || "",
      building: user.address?.building || "",
      floor: user.address?.floor || "",
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

    if (!validateAddress(newUser.address)) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      await axios.put(`${API_URL}/api/users/${editUserId}`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      fetchUsers()
      resetForm()
      toast.success("User updated successfully!")
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user: " + (error.response?.data?.message || error.message))
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
        <h2 className="text-xl font-bold mb-4">{editUserId ? "Edit User" : "Add New User"}</h2>
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
            onChange={(address) => setNewUser({ ...newUser, address })}
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
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#E2C269] text-[#1B2930] rounded-md hover:bg-[#E2C269]/90"
            >
              {editUserId ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Users List</h2>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-[#E2C269] focus:border-[#E2C269]"
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
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="border p-2 text-center">{user.id}</td>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2 text-center">{user.role}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <FiEdit className="inline-block h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash className="inline-block h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default UsersPage
