"use client";
import React from "react";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">User Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/advertiser" className="hover:text-gray-300">Advertiser</Link>
          {/* <Link href="/affiliate" className="hover:text-gray-300">Users</Link> */}
        </nav>
      </aside>


      <div className="flex-1 flex flex-col">


        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          {/* <button className="px-4 py-2 bg-red-600 text-white rounded">
            Logout
          </button> */}
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto h-full">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
