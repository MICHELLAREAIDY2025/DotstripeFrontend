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
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] })

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(["products"])

      // Optimistically update to the new value
      queryClient.setQueryData(["products"], (old) => {
        return old.map((product) => {
          if (product.id === id) {
            return {
              ...product,
              ...data,
              // Keep the existing image_url if no new image is provided
              image_url: data.image ? undefined : product.image_url,
            }
          }
          return product
        })
      })

      // Return a context object with the snapshotted value
      return { previousProducts }
    },
    onError: (err, newProduct, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["products"], context.previousProducts)
      console.error("Error updating product:", err)
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["products"] })
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
