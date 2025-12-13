"use client"

import AdminLayout from '@/components/AdminLayout'
import React from 'react'
import useCheckAuth from '../../../../hooks/useCheckAuth'

const AffiliateDashboard = () => {
  const { user, loading } = useCheckAuth({ requireRole: 'AFFILIATE' })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-bold text-gray-700 text-2xl">Verifying Credentials... Please wait</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
        <p className="text-gray-600">Welcome to your affiliate dashboard. Manage your campaigns and track your performance here.</p>
      </AdminLayout>
    </div>
  )
}

export default AffiliateDashboard
