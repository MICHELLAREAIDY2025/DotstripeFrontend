"use client"

import { useState } from "react"
import { useCategories } from "@/app/context/CategoryContext"
import { FiEdit, FiTrash } from "react-icons/fi"
import { toast } from "react-toastify"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"

const CategoryList = ({ onEdit }) => {
  const { categories, loading: isLoading, removeCategory } = useCategories()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter categories based on search term
  const filteredCategories = categories?.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id, name) => {
    confirmAlert({
      title: "Confirm Delete",
      message: (
        <div className="text-lg font-medium text-gray-700">
          Are you sure you want to delete "{name}"? This action cannot be undone.
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          className: "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md",
          onClick: () => {
            removeCategory(id)
            toast.success("Category deleted successfully")
          },
        },
        {
          label: "No",
          className: "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md",
          onClick: () => {},
        },
      ],
      overlayClassName: "bg-black bg-opacity-50",
      customUI: ({ onClose, title, message, buttons }) => {
        return (
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <div className="mb-6">{message}</div>
            <div className="flex justify-end space-x-4">
              {buttons.map((button, i) => (
                <button
                  key={i}
                  onClick={() => {
                    button.onClick()
                    onClose()
                  }}
                  className={button.className}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )
      }
    })
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Categories List</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {filteredCategories?.length === 0 ? (
        <p className="text-center py-4">No categories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="border p-2 text-center">{category.id}</td>
                  <td className="border p-2">{category.name}</td>
                  <td className="border p-2">{category.description}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => onEdit(category)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <FiEdit className="inline-block h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
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
  )
}

export default CategoryList
