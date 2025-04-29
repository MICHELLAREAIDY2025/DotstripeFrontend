"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../lib/api"
import { toast } from "react-toastify"

const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    console.log("[CategoryContext] Fetching categories...")
    setLoading(true)
    try {
      const res = await getAllCategories()
      console.log("[CategoryContext] API response:", res)

      // Handle different response formats
      let categoriesData = []
      if (res.data && Array.isArray(res.data.categories)) {
        categoriesData = res.data.categories
      } else if (res.data && Array.isArray(res.data)) {
        categoriesData = res.data
      } else if (res.categories && Array.isArray(res.categories)) {
        categoriesData = res.categories
      }

      setCategories(categoriesData)
    } catch (err) {
      console.error("[CategoryContext] Failed to fetch:", err)
      toast.error("Failed to fetch categories")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (categoryData) => {
    try {
      const response = await createCategory(categoryData)
      await fetchCategories() // Refresh the categories list
      return response.data
    } catch (error) {
      console.error("Error adding category:", error)
      throw error
    }
  }

  const editCategory = async (id, categoryData) => {
    try {
      const response = await updateCategory(id, categoryData)
      await fetchCategories() // Refresh the categories list
      return response.data
    } catch (error) {
      console.error("Error updating category:", error)
      throw error
    }
  }

  const removeCategory = async (id) => {
    try {
      await deleteCategory(id)
      await fetchCategories() // Refresh the categories list
    } catch (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  }

  useEffect(() => {
    console.log("CategoryProvider: useEffect triggered")
    fetchCategories()
  }, [])

  return (
    <CategoryContext.Provider 
      value={{ 
        categories, 
        loading, 
        fetchCategories,
        addCategory,
        editCategory,
        removeCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider")
  }
  return context
}
