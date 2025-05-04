import axios from "axios"

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Important: This enables sending cookies with requests
})

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage
    const token = localStorage.getItem("token")

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Adding token to request:", token.substring(0, 10) + "...")
    } else {
      console.log("No token found in localStorage")
    }

    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => {
    // Check if the response includes a token and save it
    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token)
      console.log("Token saved from response")
    }
    return response
  },
  (error) => {
    // Handle 401 errors globally
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access (401):", error.response.data)
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      // We don't redirect here to avoid circular dependencies with AuthContext
    }
    return Promise.reject(error)
  },
)

// Auth endpoints
export const loginUser = (data) => API.post("/api/users/login", data)
export const registerUser = (data) => API.post("/api/users/register", data)
export const logoutUser = () => API.post("/api/users/logout")
export const getCurrentUser = () => API.get("/api/users/me")

// Users endpoints
export const getAllUsers = () => API.get("/api/users")
export const getUserById = (id) => API.get(`/api/users/${id}`)
export const editUser = (id, updatedData) => API.put(`/api/users/${id}`, updatedData)
export const deleteUser = (id) => API.delete(`/api/users/${id}`)
export const updateUserProfile = (data) => API.put("/api/users/update", data)

// Products endpoints
export const getAllProducts = () => API.get("/api/products")
export const getProductById = (id) => API.get(`/api/products/${id}`)
export const createProduct = (data) => API.post("/api/products", data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
export const deleteProduct = (id) => API.delete(`/api/products/${id}`)

// Categories endpoints
export const getAllCategories = () => API.get("/api/categories")
export const getCategoryById = (id) => API.get(`/api/categories/${id}`)
export const createCategory = (data) => API.post("/api/categories", data)
export const updateCategory = (id, data) => API.put(`/api/categories/${id}`, data)
export const deleteCategory = (id) => API.delete(`/api/categories/${id}`)

// Orders endpoints
export const getOrders = () => API.get("/api/orders").then((res) => res.data)
export const getOrderById = (id) => API.get(`/api/orders/${id}`).then((res) => res.data)
export const createOrder = (data) => API.post("/api/orders", data).then((res) => res.data)
export const updateOrder = (id, data) => API.put(`/api/orders/${id}`, data).then((res) => res.data)
export const deleteOrder = (id) => API.delete(`/api/orders/${id}`).then((res) => res.data)

// Order Items endpoints - Check if your API has these endpoints
// If not, you might need to adjust these to match your API structure
export const getOrderItems = () =>
  API.get("/api/order-items")
    .then((res) => res.data)
    .catch((error) => {
      // If the endpoint doesn't exist, try an alternative
      if (error.response && error.response.status === 404) {
        console.warn("Order items endpoint not found, trying alternative...")
        // Try alternative endpoint if available, or return empty array
        return []
      }
      throw error
    })

export const getOrderItemById = (id) =>
  API.get(`/api/order-items/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        console.warn(`Order item endpoint for ID ${id} not found`)
        return null
      }
      throw error
    })

export const createOrderItem = (data) =>
  API.post("/api/order-items", data)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        console.error("Create order item endpoint not found")
        return null
      }
      throw error
    })

export const updateOrderItem = (id, data) =>
  API.put(`/api/order-items/${id}`, data)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        console.error(`Update order item endpoint for ID ${id} not found`)
        return null
      }
      throw error
    })

export const deleteOrderItem = (id) =>
  API.delete(`/api/order-items/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        console.error(`Delete order item endpoint for ID ${id} not found`)
        return null
      }
      throw error
    })

// Get orders for the logged-in user
export const getUserOrders = () => API.get("/api/orders/user").then((res) => res.data)

// Export the API instance for other uses
export default API
