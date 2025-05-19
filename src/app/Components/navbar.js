"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/Cartcontext"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { ShoppingCart, UserCircle, LogIn, Menu, X, LogOut, Settings, ShoppingBag, ChevronDown } from "lucide-react"
import CartPopup from "./CartPopup"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cartCount, loading, isCartOpen, toggleCart } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false)
  const [isMobileWhatWeDoOpen, setIsMobileWhatWeDoOpen] = useState(false)

  const dropdownRef = useRef(null)
  const userIconRef = useRef(null)
  const whatWeDoRef = useRef(null)
  const whatWeDoButtonRef = useRef(null)

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleWhatWeDo = () => setIsWhatWeDoOpen(!isWhatWeDoOpen)

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle user dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }

      // Handle What We Do dropdown
      if (
        whatWeDoRef.current &&
        !whatWeDoRef.current.contains(event.target) &&
        whatWeDoButtonRef.current &&
        !whatWeDoButtonRef.current.contains(event.target)
      ) {
        setIsWhatWeDoOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNavigation = (path) => {
    router.push(path)
    setIsMenuOpen(false)
    setIsMobileWhatWeDoOpen(false)
  }

  // Check if current path is in What We Do section
  const isInWhatWeDo = pathname?.startsWith("/what-we-do")

  if (loading)
    return (
      <div className="fixed top-0 left-0 w-full h-16 bg-[#031626] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
      </div>
    )

  return (
    <header className="top-0 z-50 w-full bg-[#031626] shadow-md fixed">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-4 md:px-8 lg:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-24 w-56 md:h-28 md:w-64 flex items-center">
              <Image
                src="/images/DotStripeLogo.png"
                alt="Dot Stripe Logo"
                width={256}
                height={100}
                className="object-contain"
                priority
              />
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
        <nav className="hidden md:flex text-base lg:text-lg font-medium text-white">
          <ul className="flex items-center h-full space-x-8 lg:space-x-12">
            {/* What We Do with dropdown */}
            <li className="relative" ref={whatWeDoRef}>
              <button
                ref={whatWeDoButtonRef}
                className={`flex items-center hover:text-[#17A0BF] transition-colors py-2 px-1 ${isInWhatWeDo ? "text-[#17A0BF]" : ""}`}
                onClick={toggleWhatWeDo}
                onMouseEnter={() => setIsWhatWeDoOpen(true)}
              >
                What we do
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isWhatWeDoOpen ? "rotate-180" : ""}`} />
              </button>

              {isWhatWeDoOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  onMouseLeave={() => setIsWhatWeDoOpen(false)}
                >
                  <Link href="/what-we-do/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Services
                  </Link>
                  <Link href="/what-we-do/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Products
                  </Link>
                </div>
              )}
            </li>

            <li className="flex items-center">
              <Link href="/what-we-think" className="hover:text-[#17A0BF] transition-colors py-2 px-1">
                What we think
              </Link>
            </li>
            <li className="flex items-center">
              <Link href="/about" className="hover:text-[#17A0BF] transition-colors py-2 px-1">
                Who we are
              </Link>
            </li>
            <li className="flex items-center">
              <Link href="/contact" className="hover:text-[#17A0BF] transition-colors py-2 px-1">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: Icons */}
        <div className="hidden md:flex items-center">
          {!user ? (
            <Link
              href="/login"
              aria-label="Login"
              className="flex items-center text-white hover:text-[#17A0BF] transition-colors mr-6"
            >
              <LogIn className="h-5 w-5 mr-1.5" />
              <span>Login</span>
            </Link>
          ) : (
            <div className="relative mr-8" ref={userIconRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white hover:text-[#17A0BF] transition-colors focus:outline-none"
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                <UserCircle size={24} className="mr-2" />
                <span className="max-w-[120px] truncate">{user.name}</span>
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
            className="relative text-white hover:text-[#17A0BF] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#18608C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#031626] border-t border-gray-700 px-4 py-3">
          <nav className="flex flex-col space-y-3 text-white">
            {/* Mobile What We Do with dropdown */}
            <div>
              <button
                onClick={() => setIsMobileWhatWeDoOpen(!isMobileWhatWeDoOpen)}
                className={`flex items-center justify-between w-full text-left py-2 hover:text-[#17A0BF] ${isInWhatWeDo ? "text-[#17A0BF]" : ""}`}
              >
                <span>What we do</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMobileWhatWeDoOpen ? "rotate-180" : ""}`} />
              </button>

              {isMobileWhatWeDoOpen && (
                <div className="pl-4 border-l border-gray-700 ml-2 mt-1 space-y-2">
                  <button
                    onClick={() => handleNavigation("/what-we-do/services")}
                    className="block py-2 text-left w-full hover:text-[#17A0BF]"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => handleNavigation("/what-we-do/products")}
                    className="block py-2 text-left w-full hover:text-[#17A0BF]"
                  >
                    Products
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => handleNavigation("/what-we-think")} className="text-left py-2 hover:text-[#17A0BF]">
              What we think
            </button>
            <button onClick={() => handleNavigation("/about")} className="text-left py-2 hover:text-[#17A0BF]">
              Who we are
            </button>
            <button onClick={() => handleNavigation("/contact")} className="text-left py-2 hover:text-[#17A0BF]">
              Contact
            </button>

            <div className="border-t border-gray-700 my-2"></div>

            {!user ? (
              <button
                onClick={() => handleNavigation("/login")}
                className="flex items-center py-2 hover:text-[#17A0BF]"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </button>
            ) : (
              <>
                <div className="py-2">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center py-2 hover:text-[#17A0BF] text-left w-full"
                >
                  <Settings size={16} className="mr-2" />
                  Profile Settings
                </button>

                <button
                  onClick={() => handleNavigation("/orderHistory")}
                  className="flex items-center py-2 hover:text-[#17A0BF] text-left w-full"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Order History
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => handleNavigation("/admin")}
                    className="flex items-center py-2 hover:text-[#17A0BF] text-left w-full"
                  >
                    <Settings size={16} className="mr-2" />
                    Admin Panel
                  </button>
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

            <button
              onClick={() => handleNavigation("/cart")}
              className="flex items-center py-2 hover:text-[#17A0BF] text-left w-full"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>
          </nav>
        </div>
      )}

      <CartPopup isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  )
}

export default Navbar
