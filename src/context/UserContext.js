"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getAllUsers, editUser, deleteUser, registerUser } from "../lib/api"
import { toast } from "react-toastify"

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      console.log("Calling getAllUsers()...")
      const res = await getAllUsers()
      console.log("Fetched users:", res.data) // debug
      setUsers(res.data?.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id, data) => {
    try {
      await editUser(id, data)
      toast.success("User updated")
      fetchUsers()
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  const removeUser = async (id) => {
    try {
      await deleteUser(id)
      toast.success("User deleted")
      fetchUsers()
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  const registerNewUser = async (userData) => {
    try {
      await registerUser(userData)
      toast.success("User registered successfully")
      fetchUsers()
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.response?.data?.message || "Failed to register user")
    }
  }

  useEffect(() => {
    console.log("UsersProvider: useEffect triggered")
    fetchUsers()
  }, [])

  return (
    <UsersContext.Provider value={{ users, loading, fetchUsers, updateUser, removeUser, registerNewUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => useContext(UsersContext)
