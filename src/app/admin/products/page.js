"use client"

import { useState } from "react"
import ProductForm from "@/app/Components/products/ProductForm"
import ProductList from "@/app/Components/products/ProductList"
import CategoryForm from "@/app/Components/categories/CategoryForm"
import CategoryList from "@/app/Components/categories/CategoryList"
import { useProducts } from "@/app/context/ProductContext"
import ProtectAdminRoute from "@/app/Components/AdminProtectedRoute"

const AdminItemsPage = () => {
  const [tab, setTab] = useState("products")
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("")

  // Use the context instead of the direct hook
  const { products, loading: isLoading } = useProducts()

  // Filter products based on selectedCategory
  const filteredProducts = selectedCategory
    ? products?.filter((p) => String(p.category_id) === String(selectedCategory))
    : products

  const handleEdit = (product) => {
    setEditingProduct(product)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <ProtectAdminRoute>
      <div className="p-1">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 px-4 pt-4">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded ${
              tab === "products" ? "bg-[#E2C269] text-[#1B2930]" : "bg-gray-200 text-[#1B2930]"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setTab("categories")}
            className={`px-4 py-2 rounded ${
              tab === "categories" ? "bg-[#E2C269] text-[#1B2930]" : "bg-gray-200 text-[#1B2930]"
            }`}
          >
            Categories
          </button>
        </div>

        {/* Product Tab */}
        {tab === "products" && (
          <div className="space-y-6">
            <ProductForm selectedProduct={editingProduct} onSuccess={() => setEditingProduct(null)} />
            <ProductList
              onEdit={handleEdit}
              products={filteredProducts}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showCategoryFilter={true}
            />
          </div>
        )}

        {/* Category Tab */}
        {tab === "categories" && (
          <div className="space-y-6">
            <CategoryForm selectedCategory={editingCategory} onSuccess={() => setEditingCategory(null)} />
            <CategoryList onEdit={(cat) => setEditingCategory(cat)} />
          </div>
        )}
      </div>
    </ProtectAdminRoute>
  )
}

export default AdminItemsPage
