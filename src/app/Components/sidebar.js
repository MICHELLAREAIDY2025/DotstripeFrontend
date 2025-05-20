"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, ChevronLeft, ChevronRight, LogOut, Home } from "lucide-react"

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  const menuItems = [
    {
      title: "Home",
      icon: <Home size={20} />,
      path: "/",
    },
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
    },
    {
      title: "Orders",
      icon: <ShoppingBag size={20} />,
      path: "/admin/orders",
    },
    {
      title: "Products",
      icon: <Package size={20} />,
      path: "/admin/products",
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
  ]

  const isActive = (path) => {
    if (path === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard"
    }
    return pathname === path || (pathname.startsWith(`${path}/`) && path !== "/admin")
  }

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } min-h-screen bg-[#031626] text-white transition-all duration-300 flex flex-col fixed left-0 top-0 h-full z-10`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-6 border-b border-[#0E4459]">
        {collapsed ? (
          <div className="relative h-12 w-12">
            <Image 
              src="/images/DotStripeLogo.png" 
              alt="Dot Stripe" 
              width={48} 
              height={48} 
              className="object-contain" 
              priority
            />
          </div>
        ) : (
          <div className="relative h-16 w-40">
            <Image
              src="/images/DotStripeLogo.png"
              alt="Dot Stripe"
              width={160}
              height={64}
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-[#18608C] rounded-full p-1 text-white hover:bg-[#17A0BF] transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Menu Items */}
      <div className="flex-1 py-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                  isActive(item.path) ? "bg-[#18608C] text-white" : "text-gray-300 hover:bg-[#0E4459] hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#0E4459]">
        <button
          onClick={logout}
          className="flex items-center w-full py-3 px-4 text-gray-300 hover:text-white hover:bg-[#0E4459] rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
