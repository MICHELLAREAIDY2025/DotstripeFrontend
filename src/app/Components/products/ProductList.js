"use client"

import { useState } from "react"
import { useCategories } from "@/app/context/CategoryContext"
import { useProducts } from "@/app/context/ProductContext"
import { parseProductImage } from "@/utils/image-helpers"
import { FiEdit, FiTrash, FiEye } from "react-icons/fi"
import { toast } from "react-toastify"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import Link from "next/link"

const ProductList = ({
  products = [],
  onEdit,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  showCategoryFilter = false,
}) => {
  const { categories } = useCategories()
  const { removeProduct } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter products based on search term
  const filteredProducts = products?.filter((product) =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id, name) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${name}"?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            removeProduct(id)
            toast.success("Product deleted successfully")
          },
        },
        {
          label: "No",
        },
      ],
    })
  }

  const getCategoryName = (categoryId) => {
    const category = categories?.find((c) => String(c.id) === String(categoryId))
    return category ? category.name : "Unknown"
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Products List</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md flex-grow"
        />

        {showCategoryFilter && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">All Categories</option>
            {categories &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        )}
      </div>

      {filteredProducts?.length === 0 ? (
        <p className="text-center py-4">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-100 p-4 rounded-md shadow">
              <div className="h-32 flex items-center justify-center overflow-hidden bg-white rounded-md mb-2">
                <img
                  src={parseProductImage(product.image_url) || "/images/product-placeholder.png"}
                  alt={product.name || "Product"}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/images/product-placeholder.png"
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mt-2 truncate">{product.name}</h3>
              <p className="text-sm text-gray-700">${Number.parseFloat(product.price).toFixed(2)}</p>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800">
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash size={18} />
                </button>
                <Link href={`/products/${product.id}`} className="text-green-600 hover:text-green-800">
                  <FiEye size={18} />
                </Link>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Category: {getCategoryName(product.category_id)}</p>
                <p>Stock: {product.stock || 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList
