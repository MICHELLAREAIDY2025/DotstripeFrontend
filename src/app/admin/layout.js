"use client"

import ProtectAdminRoute from "@/app/Components/AdminProtectedroute"

export default function AdminLayout({ children }) {
  return <ProtectAdminRoute>{children}</ProtectAdminRoute>
}