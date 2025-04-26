"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/app/Components/navbar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = await login({ email, password });
      if (userData) {
        if (userData.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        localStorage.setItem("role", userData.role);
        toast.success("Login successful");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24">
        <div className="bg-white py-8 px-12 rounded-2xl shadow-2xl border border-[#e5e7eb] w-full max-w-md sm:max-w-lg transition-all">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#0A1929]">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              className="bg-[#3B6EA5] text-white py-3 px-4 rounded-lg w-full hover:bg-[#28527a] transition duration-300 text-lg font-semibold mt-2"
            >
              Login
            </button>
          </form>
          <div className="my-6 border-t border-gray-200"></div>
          <p className="text-center text-[#0A1929] text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-[#3B6EA5] hover:underline font-medium">Sign up here</a>
          </p>
        </div>
      </main>
    </div>
  );
}
