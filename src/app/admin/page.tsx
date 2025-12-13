"use client"

import AdminLayout from '@/components/AdminLayout'
import useCheckAuth from '../../../hooks/useCheckAuth'

const AdminDashboard = () => {
  const { user, loading } = useCheckAuth({ requireAdmin: true })

  if (loading) {
    return (
      <div className=''>
        <p className='font-bold text-gray-700 text-2xl flex items-center justify-center'>Verifying Credentials Please wait...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <AdminLayout>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white shadow-md rounded-xl p-6 border">
            <h3 className="text-gray-700 text-lg font-semibold mb-2">Total Blogs</h3>
            <p className="text-3xl font-bold text-blue-600">24</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 border">
            <h3 className="text-gray-700 text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-green-600">132</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 border">
            <h3 className="text-gray-700 text-lg font-semibold mb-2">Admins</h3>
            <p className="text-3xl font-bold text-purple-600">3</p>
          </div>

        </div>
      </AdminLayout>
    </div>
  )
}

export default AdminDashboard
