"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "@/app/Components/navbar";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState({
    region: "",
    direction: "",
    phone: "",
    building: "",
    floor: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        { name, address, email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        toast.success("Register successful");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Invalid email or password");
      setError("Unable to sign up");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col">
      <Navbar />
      <ToastContainer />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20">
        <div className="bg-white py-8 px-12 rounded-2xl shadow-2xl border border-[#e5e7eb] w-full max-w-md sm:max-w-lg transition-all">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#0A1929]">Create your account</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="Your full name"
              />
            </div>
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
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="region">Region</label>
              <input
                type="text"
                id="region"
                name="region"
                value={address.region}
                onChange={handleChange}
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="Region"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="direction">Direction</label>
              <input
                type="text"
                id="direction"
                name="direction"
                value={address.direction}
                onChange={handleChange}
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="Direction"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="building">Building</label>
              <input
                type="text"
                id="building"
                name="building"
                value={address.building}
                onChange={handleChange}
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="Building"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1 text-[#0A1929]" htmlFor="floor">Floor</label>
              <input
                type="text"
                id="floor"
                name="floor"
                value={address.floor}
                onChange={handleChange}
                className="border border-[#3B6EA5] rounded-lg w-full p-3 bg-gray-100 text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3B6EA5] transition"
                placeholder="Floor"
              />
            </div>
            <button
              type="submit"
              className="bg-[#3B6EA5] text-white py-3 px-4 rounded-lg w-full hover:bg-[#28527a] transition duration-300 text-lg font-semibold mt-2"
            >
              Sign up
            </button>
          </form>
          <div className="my-6 border-t border-gray-200"></div>
          <p className="text-center text-[#0A1929] text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-[#3B6EA5] hover:underline font-medium">Login here</a>
          </p>
        </div>
      </main>
    </div>
  );
}
