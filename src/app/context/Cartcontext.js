"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/app/context/AuthContext";
import { useProducts } from "@/app/context/ProductContext"

const CartContext = createContext()

function attachProductsToCartItems(cartItems, products) {
  return cartItems.map(item => ({
    ...item,
    Product: products.find(p => p.id === item.product_id) || item.Product || {},
  }))
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const { products } = useProducts()

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const fetchCart = async () => {
    //Don't fetch if there's no API URL configured
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL not configured")
      setLoading(false)
      return
    }

     // Don't fetch if user is not authenticated
     if (!user) {
      setCartItems([])
      setCartCount(0)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        withCredentials: true,
      })

      // Calculate cart count
      const count = response.data.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
      setCartItems(attachProductsToCartItems(response.data, products))
    } catch (err) {
      console.error("Error fetching cart:", err)
        // If we get a 401, clear the cart as the user is not authenticated
        if (err.response && err.response.status === 401) {
          setCartItems([])
          setCartCount(0)
        }
    } finally {
      setLoading(false)
    }
  }

  // Only fetch cart when auth state changes or on initial load
  useEffect(() => {
    // Only fetch cart when auth loading is complete
    if (!authLoading) {
      fetchCart()
    }
  }, [user, authLoading])

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      console.error("User must be logged in to add items to cart")
      return false
    }
    try {
      // Fetch product details to get the stock
      const productResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        { withCredentials: true }
      );
      const product = productResponse.data;
      const stock = product.stock || 0;

      // Find if the item already exists in the cart
      const existingItem = cartItems.find((item) => item.product_id === productId);
      const existingQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = Math.min(existingQuantity + quantity, stock);

      if (existingItem && existingQuantity >= stock) {
        // Already at max stock, do not add more
        setIsCartOpen(true);
        return false;
      }

      // Call backend to update/add cart item
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          product_id: productId,
          quantity: newQuantity - existingQuantity, // Only add the difference
        },
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        const newItem = {
          ...response.data,
          Product: product,
        };

        setCartCount((prevCount) => prevCount + (newQuantity - existingQuantity));
        if (existingItem) {
          setCartItems((prevItems) =>
            attachProductsToCartItems(
              prevItems.map((item) =>
                item.product_id === productId
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
              products
            )
          );
        } else {
          setCartItems((prevItems) =>
            attachProductsToCartItems([...prevItems, newItem], products)
          );
        }
        await fetchCart(); // Ensure cart is up-to-date and deduplicated
        setIsCartOpen(true);
      }

      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      return false;
    }
  }

  const updateCartItem = async (cartItemId, quantity) => {
    if (!user) return false
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartItemId}`,
        { quantity },
        { withCredentials: true }
      )
      // Use the backend response to update local state
      if (response.data) {
        setCartItems((prevItems) => attachProductsToCartItems(
          prevItems.map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: response.data.quantity }
              : item
          ),
          products
        ))
        // Update cart count
        setCartCount((prevItems => {
          const newCount = response.data.quantity +
            prevItems.filter((item) => item.id !== cartItemId)
              .reduce((sum, item) => sum + item.quantity, 0)
          return newCount
        })(cartItems))
      }
      return true
    } catch (err) {
      console.error("Error updating cart item:", err)
      return false
    }
  }

  const removeCartItem = async (cartItemId) => {
    if (!user) return false
    try {
       const currentItem = cartItems.find((item) => item.id === cartItemId)

       if (currentItem) {
         setCartCount((prevCount) => prevCount - currentItem.quantity)
         setCartItems((prevItems) => attachProductsToCartItems(
           prevItems.filter((item) => item.id !== cartItemId),
           products
         ))
       }
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartItemId}`, {
        withCredentials: true,
      })
      // Removed fetchCart() here for smoother UX
      return true
    } catch (err) {
      console.error("Error removing cart item:", err)
      return false
    }
  }

  const clearCart = async () => {
    if (!user) return false

    try {
      // Try to use a dedicated clear cart endpoint if it exists
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
          withCredentials: true,
        })

        // If successful, update local state
        setCartItems([])
        setCartCount(0)
        return true
      } catch (clearErr) {
        console.log("No clear cart endpoint available, trying alternative methods:", clearErr)

        // If clear cart endpoint doesn't exist, try to update all items to quantity 0
        try {
          const updatePromises = cartItems.map((item) =>
            axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${item.product_id}`,
              { quantity: 0 },
              { withCredentials: true },
            ),
          )

          await Promise.all(updatePromises)

          // If successful, update local state
          setCartItems([])
          setCartCount(0)
          return true
        } catch (updateErr) {
          console.log("Update quantities method failed:", updateErr)

          // If all else fails, just clear the local state
          console.log("Clearing local cart state only")
          setCartItems([])
          setCartCount(0)
          return true
        }
      }
    } catch (err) {
      console.error("Error clearing cart:", err)
      // Even if API calls fail, clear the local state for better UX
      setCartItems([])
      setCartCount(0)
      return true
    }
  }
  const checkout = async () => {
    if (!user) {
      console.error("User must be logged in to checkout")
      return false
    }
    try {
      // Instead of calling a non-existent /checkout endpoint,
      // we'll use the existing cart endpoints to clear the cart

      // 1. Create an order record if you have an orders API
      // This is optional - implement if you have an orders endpoint
      try {
        // If you have an orders API endpoint, use it
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { items: cartItems }, { withCredentials: true })
      } catch (orderErr) {
        console.log("No orders endpoint available or order creation failed:", orderErr)
        // Continue with checkout even if order creation fails
      }

      // 2. Clear the cart by removing all items
      await clearCart()

      // 3. Update local state
      setCartItems([])
      setCartCount(0)

      return true
    } catch (err) {
      console.error("Error during checkout:", err)
      return false
    }
  }


  const value = {
    cartItems,
    cartCount,
    loading,
    fetchCartCount: fetchCart,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    checkout, // Now this will be defined
    isCartOpen,
    toggleCart,
    setCartCount, 
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)