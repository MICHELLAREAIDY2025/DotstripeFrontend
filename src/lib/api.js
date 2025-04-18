import axios from "axios"

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Authentication
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password })
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
  }
  return response.data
}

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem("token")
}

// Contact form
export const sendContactMessage = async (messageData) => {
  const response = await api.post("/contact", messageData)
  return response.data
}

// Cart
export const getCart = async () => {
  const response = await api.get("/cart")
  return response.data
}

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/cart/add", { productId, quantity })
  return response.data
}

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/item/${itemId}`, { quantity })
  return response.data
}

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/item/${itemId}`)
  return response.data
}

export default api
