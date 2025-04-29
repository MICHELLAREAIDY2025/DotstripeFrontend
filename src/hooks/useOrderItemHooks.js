import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem } from "@/lib/api"

export const useOrderItems = () => {
  return useQuery({
    queryKey: ["orderItems"],
    queryFn: async () => {
      return await getOrderItems()
    },
    onError: (error) => {
      console.error("Error fetching order items:", error)
    },
  })
}

export const useOrderItem = (id) => {
  return useQuery({
    queryKey: ["orderItem", id],
    queryFn: async () => {
      return await getOrderItemById(id)
    },
    enabled: !!id,
    onError: (error) => {
      console.error(`Error fetching order item ${id}:`, error)
    },
  })
}

export const useCreateOrderItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (itemData) => {
      return await createOrderItem(itemData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] })
    },
    onError: (error) => {
      console.error("Error creating order item:", error)
    },
  })
}

export const useUpdateOrderItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateOrderItem(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] })
    },
    onError: (error) => {
      console.error("Error updating order item:", error)
    },
  })
}

export const useDeleteOrderItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      return await deleteOrderItem(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] })
    },
    onError: (error) => {
      console.error("Error deleting order item:", error)
    },
  })
}
