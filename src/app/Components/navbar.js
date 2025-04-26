"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/Cartcontext";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, UserCircle, LogIn } from "lucide-react";
import CartPopup from "./CartPopup";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount, loading, isCartOpen, toggleCart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <header className="top-0 z-50 w-full bg-[#0A1929] shadow-md fixed px-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-4 md:px-12 py-4 md:py-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/DotstripeLogo.png"
              alt="Dot Stripe Logo"
              width={120}
              height={60}
              className="h-16 w-auto"
              priority
            />
          </Link>
        </div>
        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex text-lg font-semibold mx-20 text-white space-x-20">
          <Link href="/what-we-do" className="hover:text-[#3B6EA5] transition-colors">what we do</Link>
          <Link href="/what-we-think" className="hover:text-[#3B6EA5] transition-colors">what we think</Link>
          <Link href="/who-we-are" className="hover:text-[#3B6EA5] transition-colors">who we are</Link>
        </nav>
        {/* Right: Icons */}
        <div className="flex space-x-6 items-center relative">
          {!user ? (
            <Link href="/login" aria-label="Login" className="flex items-center">
              <LogIn className="h-5 w-5 mr-1 text-white hover:text-[#3B6EA5] transition-colors" />
              <span className="text-white hover:text-[#3B6EA5] transition-colors">Login</span>
            </Link>
          ) : (
            <div className="relative flex flex-col items-center" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="focus:outline-none">
                <UserCircle size={28} className="text-white hover:text-[#3B6EA5] transition-colors" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-[110%] right-0 w-48 bg-white border rounded shadow-md z-50">
                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                    Logout
                  </button>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2 hover:bg-gray-200">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/orderHistory" className="block px-4 py-2 hover:bg-gray-200">
                    Orders History
                  </Link>
                </div>
              )}
            </div>
          )}
          <Link href="/cart" className="relative text-white hover:text-[#3B6EA5] transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#3B6EA5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-[#0A1929] shadow-md rounded p-4">
          <nav className="flex flex-col space-y-4 text-white">
            <Link href="/what-we-do" onClick={() => setIsMenuOpen(false)} className="block py-1 hover:text-[#3B6EA5]">
              what we do
            </Link>
            <Link href="/what-we-think" onClick={() => setIsMenuOpen(false)} className="block py-1 hover:text-[#3B6EA5]">
              what we think
            </Link>
            <Link href="/who-we-are" onClick={() => setIsMenuOpen(false)} className="block py-1 hover:text-[#3B6EA5]">
              who we are
            </Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block py-1 hover:text-[#3B6EA5]">
              Login
            </Link>
          </nav>
        </div>
      )}
      <CartPopup isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Header;