"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/Cartcontext"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, UserCircle, LogIn, Menu, X, LogOut, Settings, ShoppingBag } from "lucide-react"
import CartPopup from "./CartPopup"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cartCount, loading, isCartOpen, toggleCart } = useCart()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const userIconRef = useRef(null)

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full h-16 bg-[#0A1929] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
      </div>
    )

  return (
    <header className="top-0 z-50 w-full bg-[#0A1929] shadow-md fixed">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-4 md:px-8 lg:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-32 md:h-14 md:w-36">
              <Image src="/images/DotstripeLogo.png" alt="Dot Stripe Logo" fill className="object-contain" priority />
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex text-base lg:text-lg font-medium text-white space-x-8 lg:space-x-16">
          <Link href="/what-we-do" className="hover:text-[#3B6EA5] transition-colors py-2">
            What We Do
          </Link>
          <Link href="/what-we-think" className="hover:text-[#3B6EA5] transition-colors py-2">
            What We Think
          </Link>
          <Link href="/who-we-are" className="hover:text-[#3B6EA5] transition-colors py-2">
            Who We Are
          </Link>
        </nav>

        {/* Right: Icons */}
        <div className="hidden md:flex space-x-6 items-center">
          {!user ? (
            <Link
              href="/login"
              aria-label="Login"
              className="flex items-center text-white hover:text-[#3B6EA5] transition-colors"
            >
              <LogIn className="h-5 w-5 mr-1.5" />
              <span>Login</span>
            </Link>
          ) : (
            <div className="relative" ref={userIconRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white hover:text-[#3B6EA5] transition-colors focus:outline-none"
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                <UserCircle size={24} className="mr-1.5" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50"
                  ref={dropdownRef}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-2" />
                    Profile Settings
                  </Link>

                  <Link
                    href="/orderHistory"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Order History
                  </Link>

                  {user.role === "admin" && (
                    <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings size={16} className="mr-2" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleCart}
            className="relative text-white hover:text-[#3B6EA5] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#3B6EA5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0A1929] border-t border-gray-700 px-4 py-3">
          <nav className="flex flex-col space-y-3 text-white">
            <Link href="/what-we-do" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#3B6EA5]">
              What We Do
            </Link>
            <Link href="/what-we-think" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#3B6EA5]">
              What We Think
            </Link>
            <Link href="/who-we-are" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#3B6EA5]">
              Who We Are
            </Link>

            <div className="border-t border-gray-700 my-2"></div>

            {!user ? (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-2 hover:text-[#3B6EA5]"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            ) : (
              <>
                <div className="py-2">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-2 hover:text-[#3B6EA5]"
                >
                  <Settings size={16} className="mr-2" />
                  Profile Settings
                </Link>

                <Link
                  href="/orderHistory"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-2 hover:text-[#3B6EA5]"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Order History
                </Link>

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 hover:text-[#3B6EA5]"
                  >
                    <Settings size={16} className="mr-2" />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full text-left py-2 text-red-400 hover:text-red-300"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </>
            )}

            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center py-2 hover:text-[#3B6EA5]"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </nav>
        </div>
      )}

      <CartPopup isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  )
}

export default Navbar
