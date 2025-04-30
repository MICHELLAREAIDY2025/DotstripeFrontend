"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getAllProducts, createProduct, updateProduct as updateProductAPI, deleteProduct } from "../../lib/api"
import { toast } from "react-toastify"

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    console.log("[ProductContext] Fetching products...")
    setLoading(true)
    try {
      const response = await getAllProducts()
      console.log("[ProductContext] API response:", response)

      // Handle different response formats
      let productsData = []
      if (response.data && Array.isArray(response.data.products)) {
        productsData = response.data.products
      } else if (response.data && Array.isArray(response.data)) {
        productsData = response.data
      } else if (response.products && Array.isArray(response.products)) {
        productsData = response.products
      }

      setProducts(productsData)
    } catch (err) {
      console.error("[ProductContext] Failed to fetch products:", err)
      toast.error("Failed to fetch products")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData) => {
    try {
      // Check if category_id is valid
      if (!productData.get("category_id") && productData.category_id) {
        // If using a regular object, ensure category_id is included
        console.log("[ProductContext] Using category_id from object:", productData.category_id)
      } else if (productData instanceof FormData) {
        // If using FormData, log the category_id
        console.log("[ProductContext] Using category_id from FormData:", productData.get("category_id"))

        // Ensure category_id is a string (not an object)
        const categoryId = productData.get("category_id")
        if (categoryId && typeof categoryId === "object") {
          productData.delete("category_id")
          productData.append("category_id", String(categoryId))
        }
      }

      const result = await createProduct(productData)
      console.log("[ProductContext] Product created successfully:", result)
      toast.success("Product created successfully")
      fetchProducts()
      return result
    } catch (err) {
      console.error("[ProductContext] Failed to create product:", err)
      // Show more detailed error message
      const errorMessage = err.response?.data?.message || err.message || "Failed to create product"
      toast.error(errorMessage)
      throw err
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      const result = await updateProductAPI(id, productData)
      toast.success("Product updated successfully")
      fetchProducts()
      return result
    } catch (err) {
      console.error("[ProductContext] Failed to update product:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to update product"
      toast.error(errorMessage)
      throw err
    }
  }

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id)
      toast.success("Product deleted successfully")
      fetchProducts()
    } catch (err) {
      console.error("[ProductContext] Failed to delete product:", err)
      toast.error("Failed to delete product")
    }
  }

  useEffect(() => {
    console.log("ProductProvider: useEffect triggered")
    fetchProducts()
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => useContext(ProductContext)
