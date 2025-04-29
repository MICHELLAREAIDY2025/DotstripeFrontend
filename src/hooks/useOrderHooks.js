import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "@/lib/api"

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders()
    },
    onError: (error) => {
      console.error("Error fetching orders:", error)
    },
  })
}

export const useOrder = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      return await getOrderById(id)
    },
    enabled: !!id,
    onError: (error) => {
      console.error(`Error fetching order ${id}:`, error)
    },
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderData) => {
      return await createOrder(orderData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error) => {
      console.error("Error creating order:", error)
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateOrder(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error) => {
      console.error("Error updating order:", error)
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      return await deleteOrder(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error) => {
      console.error("Error deleting order:", error)
    },
  })
}
