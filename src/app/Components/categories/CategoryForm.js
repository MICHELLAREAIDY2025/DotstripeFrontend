"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useCategories } from "@/app/context/CategoryContext"

const CategoryForm = ({ selectedCategory, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const { addCategory, editCategory } = useCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [selectedCategory])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (selectedCategory) {
        await editCategory(selectedCategory.id, formData)
        toast.success("Category updated successfully")
      } else {
        await addCategory(formData)
        toast.success("Category created successfully")
      }

      setFormData({
        name: "",
        description: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error(`Failed to ${selectedCategory ? "update" : "create"} category: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">{selectedCategory ? "Edit Category" : "Add New Category"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          {selectedCategory && (
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
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#18608C] text-white rounded-md hover:bg-[#18608C]/90 disabled:opacity-70 flex items-center"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                {selectedCategory ? "Updating..." : "Creating..."}
              </>
            ) : selectedCategory ? (
              "Update Category"
            ) : (
              "Add Category"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm
