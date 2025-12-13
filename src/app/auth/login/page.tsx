"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../Redux/userSlice";
import type { AppDispatch } from "../../../../Redux/store";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  
  // Get message from URL params if any
  const message = searchParams?.get("message");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (data?.user) {
        dispatch(setUser(data.user));
        
        // Redirect based on user role
        const userType = data.user.userType;
        if (data.user.isAdmin) {
          router.push("/admin");
        } else if (userType === "AFFILIATE") {
          router.push("/dashboard/affiliate");
        } else if (userType === "ADVERTISER") {
          router.push("/dashboard/advertiser");
        } else {
          // Fallback for users without a role
          alert("Login Successful");
          router.push("/");
        }
      } else {
        alert("Login failed - user data not received");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <section className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600 text-sm mb-6">Login to access your dashboard</p>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("successful") || message.includes("Registration")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {decodeURIComponent(message)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register here
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
