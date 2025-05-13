"use client"

import { useState, useEffect } from "react"
import { useCategories } from "@/app/context/CategoryContext"
import { useProducts } from "@/app/context/ProductContext"
import { toast } from "react-toastify"
import { parseProductImage } from "@/utils/image-helpers"

const ProductForm = ({ selectedProduct, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: null,
  })
  const [imagePreview, setImagePreview] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isFormExpanded, setIsFormExpanded] = useState(true)

  const { categories } = useCategories()
  const { addProduct, updateProduct } = useProducts()

  // Set form data when editing a product
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        stock: selectedProduct.stock || "",
        category_id: selectedProduct.category_id || "",
        image: null, // Don't set the file input
      })

      // Set image preview if available
      if (selectedProduct.image_url) {
        setImagePreview(parseProductImage(selectedProduct.image_url))
      } else {
        setImagePreview("")
      }
    } else {
      // Reset form when not editing
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        image: null,
      })
      setImagePreview("")
    }
  }, [selectedProduct])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      console.log("Selected image file:", file);
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log("Image preview created");
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      setFormData((prev) => ({ ...prev, image: file }))
    } catch (error) {
      console.error("Error handling image:", error)
      toast.error("Error processing image")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      console.log("Submitting form with data:", formData);
      // Create FormData for multipart/form-data submission
      const productFormData = new FormData()
      productFormData.append("name", formData.name)
      productFormData.append("description", formData.description)
      productFormData.append("price", formData.price)
      productFormData.append("stock", formData.stock)
      productFormData.append("category_id", formData.category_id)

      // Only append image if a new one is selected
      if (formData.image) {
        console.log("Appending image to FormData:", formData.image);
        productFormData.append("image", formData.image)
      } else {
        console.log("No image to append to FormData");
      }

      if (selectedProduct) {
        console.log("Updating existing product:", selectedProduct.id);
        // Update existing product
        const response = await updateProduct(selectedProduct.id, productFormData)
        console.log("Update product response:", response);
        toast.success("Product updated successfully")
      } else {
        console.log("Creating new product");
        // Create new product
        const response = await addProduct(productFormData)
        console.log("Create product response:", response);
        toast.success("Product created successfully")
      }

      // Reset form and notify parent component
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        image: null,
      })
      setImagePreview("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error(`Failed to ${selectedProduct ? "update" : "create"} product: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div 
        className="flex justify-between items-center cursor-pointer mb-4"
        onClick={() => setIsFormExpanded(!isFormExpanded)}
      >
        <h2 className="text-xl font-bold">{selectedProduct ? "Edit Product" : "Add New Product"}</h2>
        <button className="text-gray-500 hover:text-gray-700">
          {isFormExpanded ? "▼" : "▶"}
        </button>
      </div>

      {isFormExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a category</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB</p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
              <div className="h-40 w-40 border rounded-md overflow-hidden bg-gray-100">
                <img
                  src={imagePreview || "/images/product-placeholder.png"}
                  alt="Product preview"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/images/product-placeholder.png"
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {selectedProduct && (
              <button
                type="button"
                onClick={onSuccess}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-[#18608C] text-white rounded-md hover:bg-[#18608C]/90 disabled:opacity-70 flex items-center"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  {selectedProduct ? "Updating..." : "Creating..."}
                </>
              ) : selectedProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProductForm
