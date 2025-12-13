"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import useCheckAuth from "../../../../../../hooks/useCheckAuth";

const AdminEditBlogs = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const router = useRouter();
  const { user, loading: authLoading } = useCheckAuth({ requireAdmin: true });

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    slug: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const getBlog = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.blog) {
        setError("Blog not found.");
        return;
      }

      const blog = data.blog;

      setForm({
        title: blog.title || "",
        description: blog.description || "",
        content: blog.content || "",
        image: blog.image || "",
        slug: blog.slug || "",
      });
    } catch (error) {
      console.log("Error fetching blog", error);
      setError("Unable to load blog details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Blog updated successfully!");
      router.push("/admin/blogs");
    } catch (error) {
      console.log("Error updating blog", error);
      alert("Error updating blog");
    }

    setUpdating(false);
  };

  if (authLoading || loading) {
    return <p className="text-center py-10 text-xl">Loading blog data...</p>;
  }

  if (!user) return null;

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto p-5">
          <p className="text-center py-10 text-xl text-red-600">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-5">
        <h2 className="text-2xl font-bold mb-5">Edit Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full border p-2 rounded h-40"
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            {updating ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEditBlogs;
