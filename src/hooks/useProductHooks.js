import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "@/lib/api"

// Products hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getAllProducts()
      return response.data
    },
    onError: (error) => {
      console.error("Error fetching products:", error)
    },
  })
}

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await getProductById(id)
      return response.data
    },
    enabled: !!id,
    onError: (error) => {
      console.error(`Error fetching product ${id}:`, error)
    },
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData) => {
      const response = await createProduct(productData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error) => {
      console.error("Error creating product:", error)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await updateProduct(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error) => {
      console.error("Error updating product:", error)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await deleteProduct(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error) => {
      console.error("Error deleting product:", error)
    },
  })
}

// Categories hooks
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
