import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "@/lib/api"

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getAllCategories()
      return response.data
    },
    onError: (error) => {
      console.error("Error fetching categories:", error)
    },
  })
}

export const useCategory = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await getCategoryById(id)
      return response.data
    },
    enabled: !!id,
    onError: (error) => {
      console.error(`Error fetching category ${id}:`, error)
    },
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await createCategory(categoryData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error) => {
      console.error("Error creating category:", error)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await updateCategory(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error) => {
      console.error("Error updating category:", error)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await deleteCategory(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error) => {
      console.error("Error deleting category:", error)
    },
  })
}
