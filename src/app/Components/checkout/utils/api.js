import axios from "axios"

export const fetchCheckoutData = async () => {
  try {
    const [shippingRes, userRes, cartRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/shipping`),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, { withCredentials: true }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, { withCredentials: true }),
    ])

    const shipping = parseFloat(shippingRes.data.delivery_fee) || 0
    const userAddress = userRes.data.user?.address || {}
    const cart = cartRes.data || []

    if (cart.length === 0) {
      return { isCartEmpty: true }
    }

    // Use the complete product data from the cart response
    const cartWithDetails = cart.map(item => ({
      id: item.id,
      product_id: item.product_id,
      quantity: parseInt(item.quantity) || 1,
      name: item.Product?.name || "Product unavailable",
      price: parseFloat(item.Product?.price) || 0,
      image: item.Product?.image_url || "/placeholder.jpg",
      description: item.Product?.description,
      stock: parseInt(item.Product?.stock) || 0,
      category: item.Product?.Category?.name
    }))

    // Calculate subtotal using the complete product data
    const subtotal = cartWithDetails.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)

    return { 
      cartWithDetails, 
      userAddress, 
      shipping, 
      isCartEmpty: false,
      orderSummary: {
        subtotal,
        shipping,
        total: subtotal + shipping
      }
    }
  } catch (error) {
    console.error("Error in fetchCheckoutData:", error)
    throw error
  }
}

