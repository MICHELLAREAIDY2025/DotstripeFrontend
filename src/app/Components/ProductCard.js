import React, { useState } from 'react'
import { useCart } from '../context/Cartcontext'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const handleQuantityChange = (newQuantity) => {
    // Ensure quantity is at least 1 and not more than available stock
    const validQuantity = Math.min(Math.max(1, newQuantity), product.stock)
    setQuantity(validQuantity)
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to your cart",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      router.push("/login")
      return
    }

    if (product.stock < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available in stock`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setIsAddingToCart(true)
      await addToCart(product.id, quantity)
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name} added to your cart`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      setQuantity(1) // Reset quantity after successful add
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add item to cart",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock <= 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#18608C] font-bold">${product.price}</span>
          <span className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              disabled={quantity <= 1 || product.stock <= 0}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-12 text-center border-x py-1 focus:outline-none"
              disabled={product.stock <= 0}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              disabled={quantity >= product.stock || product.stock <= 0}
            >
              +
            </button>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock <= 0}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            product.stock <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#18608C] hover:bg-[#17A0BF]"
          } transition-colors duration-200`}
        >
          {isAddingToCart ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Adding...
            </span>
          ) : product.stock <= 0 ? (
            "Out of Stock"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard 