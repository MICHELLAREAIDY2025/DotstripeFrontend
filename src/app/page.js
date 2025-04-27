"use client";

import Head from "next/head";
//import Header from "@/app/Components/header";
import { useAuth } from '@/context/AuthContext';
import Footer from "@/app/Components/footer";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/Cartcontext";
import Navbar from "@/app/Components/navbar";

export default function Home() {
  const { setCartCount } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);

  const parseProductImage = (imageData) => {
    try {
      if (Array.isArray(imageData) && imageData.length > 0) {
        return imageData[0];
      }
      return '';
    } catch (error) {
      console.error("Error parsing image:", error);
      return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, { withCredentials: true });
        const categoryRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { withCredentials: true });
        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    router.push(`/totes?category=${categoryId}`);
  };

  const openCartPopup = (product) => {
    if (!user) {
      toast.error("Please log in before adding to your cart!");

      setTimeout(() => {
        router.push("/login");
      }, 2500);

      return;
    }

    setSelectedProduct(product);
    setQuantity(1);
    setShowCartModal(true);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
  
    const stock = selectedProduct.stock ?? 0;
  
    if (quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
  
    if (quantity > stock) {
      toast.error(`Only ${stock} item(s) available in stock.`);
      return;
    }
  
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        { product_id: selectedProduct.id, quantity },
        { withCredentials: true }
      );
   
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        withCredentials: true,
      });
      const count = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
  
      toast.success(`Added ${quantity} item(s) to cart!`);
      setShowCartModal(false);
    } catch (error) {
      console.error("Add to Cart Error:", error);
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    }
  };
  
  const latestProducts = [...products].slice(-4).reverse();

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col">
      <Head>
        <title>Home</title>
      </Head>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
          ...YOUR PATHWAY<br />TO TECH EXCELLENCE...
        </h1>
        <div className="mb-8">
          <img src="/images/tech-globe.png" alt="Tech Globe" className="mx-auto w-64 md:w-80" />
        </div>
        <a href="/register" className="bg-[#3B6EA5] text-white py-2 px-6 rounded font-semibold hover:bg-[#28527a] transition mb-8">
          Get Started
        </a>
      </main>

      <Footer />
    </div>
  );
}