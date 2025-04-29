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
      await createProduct(productData)
      toast.success("Product created successfully")
      fetchProducts()
    } catch (err) {
      console.error("[ProductContext] Failed to create product:", err)
      toast.error("Failed to create product")
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      await updateProductAPI(id, productData)
      toast.success("Product updated successfully")
      fetchProducts()
    } catch (err) {
      console.error("[ProductContext] Failed to update product:", err)
      toast.error("Failed to update product")
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
