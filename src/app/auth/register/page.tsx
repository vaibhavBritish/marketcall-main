"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../../Redux/userSlice'
import type { AppDispatch } from '../../../../Redux/store'

const Register = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  
  const [formdata, setformdata] = useState({
    username: "",
    email: "",
    password: "",
    userType: "" as "AFFILIATE" | "ADVERTISER" | ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formdata.userType) {
      alert("Please select your account type")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Registration Failed")
        setLoading(false)
        return
      }

      alert("Registration Successful! Please login to continue.")

      // Redirect to login page with success message
      router.push("/auth/login?message=Registration successful! Please login with your credentials.")
    } catch (error) {
      console.error("Registration error:", error)
      alert("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <section className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-2">Create an Account</h2>
        <p className="text-center text-gray-600 text-sm mb-6">Choose your account type to get started</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Username</label>
            <input
              type="text"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your username"
              name="username"
              value={formdata.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Email</label>
            <input
              type="email"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
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
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password (min. 6 characters)"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2">Account Type <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="userType"
                  value="AFFILIATE"
                  checked={formdata.userType === "AFFILIATE"}
                  onChange={handleChange}
                  className="mr-3"
                  required
                />
                <div className="flex-1">
                  <div className="font-medium">Affiliate</div>
                  <div className="text-sm text-gray-600">Promote products and earn commissions</div>
                </div>
              </label>
              
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="userType"
                  value="ADVERTISER"
                  checked={formdata.userType === "ADVERTISER"}
                  onChange={handleChange}
                  className="mr-3"
                  required
                />
                <div className="flex-1">
                  <div className="font-medium">Advertiser</div>
                  <div className="text-sm text-gray-600">Advertise your products and manage campaigns</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}

export default Register