"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useProducts } from "@/app/context/ProductContext"
import { useCart } from "@/app/context/CartContext"
import { motion } from "framer-motion"
import Navbar from "@/app/Components/navbar"
import Footer from "@/app/Components/footer"
import { ShoppingCart, Info, Plus, Minus } from "lucide-react"
import { toast } from "react-toastify"

export default function ProductsPage() {
  const { products, loading, error } = useProducts()
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])
  const [latestProducts, setLatestProducts] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const productsPerPage = 9

  useEffect(() => {
    if (!selectedProduct) {
      setQuantity(1)
    }
  }, [selectedProduct])

  useEffect(() => {
    if (products) {
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(product => product.category?.name))]
      setCategories(uniqueCategories.filter(Boolean))

      // Get latest products (newest 6)
      const sorted = [...products].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
      setLatestProducts(sorted.slice(0, 6))

      // For demo purposes, we'll use the first 6 products as "top selling"
      // In a real app, you'd use actual sales data
      setTopProducts(products.slice(0, 6))
    }
  }, [products])

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products?.filter(product => product.category?.name === selectedCategory)

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil((filteredProducts?.length || 0) / productsPerPage)

  const handleAddToCart = async (product, qty = 1) => {
    try {
      await addToCart(product.id, qty)
      toast.success(`${qty} ${product.name}${qty > 1 ? 's' : ''} added to cart!`)
      if (selectedProduct) {
        setSelectedProduct(null)
      }
    } catch (error) {
      toast.error("Failed to add product to cart")
    }
  }

  const ProductCard = ({ product }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative h-48">
        <Image
          src={product.image_url || "/images/product-placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{product.name}</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#18608C] font-bold text-xl">${product.price}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedProduct(product)}
              className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
              title="View Details"
            >
              <Info size={20} />
            </button>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-[#18608C] text-white p-2 rounded-md hover:bg-[#17A0BF] transition-colors duration-300"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
        <Link
          href={`/contact?product=${encodeURIComponent(product.name)}`}
          className="block w-full text-center bg-[#18608C] text-white px-4 py-2 rounded-md hover:bg-[#17A0BF] transition-colors duration-300"
        >
          Inquire
        </Link>
      </div>
    </motion.div>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#031626] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18608C]"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#031626] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">Error loading products</div>
            <p className="text-white">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#031626] flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Products
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover our comprehensive range of technology solutions designed to elevate your business.
            </p>
          </motion.div>

          {/* Latest Products Section */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Latest Products</h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </section>

          {/* Categories Filter */}
          <section className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setCurrentPage(1)
                }}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-[#18608C] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentPage(1)
                  }}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#18608C] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          {/* Filtered Products Grid */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {currentProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#18608C] text-white hover:bg-[#17A0BF]"
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === index + 1
                      ? "bg-[#18608C] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#18608C] text-white hover:bg-[#17A0BF]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="relative h-64 mb-4">
                      <Image
                        src={selectedProduct.image_url || "/images/product-placeholder.png"}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedProduct.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#18608C] font-bold text-2xl">
                        ${selectedProduct.price}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-md">
                          <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                            disabled={quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleAddToCart(selectedProduct, quantity)}
                          className="bg-[#18608C] text-white px-4 py-2 rounded-md hover:bg-[#17A0BF] transition-colors duration-300 flex items-center gap-2"
                        >
                          <ShoppingCart size={20} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    {selectedProduct.category && (
                      <p className="text-sm text-gray-500">
                        Category: {selectedProduct.category.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18608C] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
