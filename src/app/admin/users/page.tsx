"use client";

import React, { useEffect, useState } from "react";
import useCheckAuth from "../../../../hooks/useCheckAuth";
import AdminLayout from "@/components/AdminLayout";

const AdminUsers = () => {
  const { user, loading } = useCheckAuth({ requireAdmin: true });
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        }
      } catch (err) {
        console.log("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };


  if (loading) {
    return (
      <div>
        <p className="font-bold text-gray-700 text-2xl flex items-center justify-center">
          Verifying Credentials Please wait...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminLayout>

      <div className="p-6">

        <h2 className="text-2xl font-semibold mb-4">All Users</h2>

        {loadingUsers ? (
          <div className="text-center text-lg font-medium py-10">Loading users...</div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden shadow-sm bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border text-left">Name</th>
                  <th className="px-4 py-3 border text-left">Email</th>
                  <th className="px-4 py-3 border text-left">Role</th>
                  <th className="px-4 py-3 border text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{u.username}</td>
                    <td className="px-4 py-3 border">{u.email}</td>
                    <td className="px-4 py-3 border capitalize">{u.isAdmin ? "Admin" : "User"}</td>

                    <td className="px-4 py-3 border text-center">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>

  );
};

export default AdminUsers;
