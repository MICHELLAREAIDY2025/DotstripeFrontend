"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getAllCategories } from "../lib/api"
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

  useEffect(() => {
    console.log("CategoryProvider: useEffect triggered")
    fetchCategories()
  }, [])

  return (
    <CategoryContext.Provider value={{ categories, loading, fetchCategories }}>{children}</CategoryContext.Provider>
  )
}

export const useCategories = () => useContext(CategoryContext)
