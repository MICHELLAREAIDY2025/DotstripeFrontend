"use client"

import Sidebar from "@/app/Components/sidebar"
import ProtectAdminRoute from "@/app/Components/protectedroute"

const DashboardLayout = ({ children }) => {
  return (
    <ProtectAdminRoute>
      <div className="flex">
        <Sidebar />
        <main className="ml-20 md:ml-64 flex-1 p-6 min-h-screen bg-gray-50">{children}</main>
      </div>
    </ProtectAdminRoute>
  )
}

export default DashboardLayout
