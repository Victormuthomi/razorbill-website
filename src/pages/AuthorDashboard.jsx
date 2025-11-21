// src/pages/AuthorsDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL, BLOG_URL } from "../api";
import {
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai";

const AuthorsDashboard = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  useEffect(() => {
    if (!token || !authorId) {
      localStorage.removeItem("authorToken");
      localStorage.removeItem("authorId");
      navigate("/authors/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch author info
        const authorRes = await fetch(`${AUTHOR_URL}/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!authorRes.ok) throw new Error("Failed to fetch author");
        const data = await authorRes.json();
        setAuthor(data.author);

        // Fetch blogs for this author only
        const blogsRes = await fetch(`${BLOG_URL}/author/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blogsData = blogsRes.ok ? await blogsRes.json() : [];

        // Sort by readers descending
        const sortedBlogs = blogsData
          .map((item) => ({
            id: item.blog.id,
            title: item.blog.title,
            content: item.blog.content,
            image_url: item.blog.image_url,
            category: item.blog.category,
            readers: item.blog.readers || 0,
            created_at: item.blog.created_at,
            updated_at: item.blog.updated_at,
            authorName: item.authorName || data.author.name || "Author",
          }))
          .sort((a, b) => b.readers - a.readers);

        setBlogs(sortedBlogs);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("authorToken");
        localStorage.removeItem("authorId");
        navigate("/authors/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, authorId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authorToken");
    localStorage.removeItem("authorId");
    navigate("/authors/login");
  };

  const handleDelete = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`${BLOG_URL}/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");

      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  if (loading)
    return (
      <div className="text-white text-center py-10">Loading dashboard...</div>
    );

  const isProfileComplete = author?.name && author?.phone && author?.email;
  const totalViews = blogs.reduce((sum, b) => sum + b.readers, 0);

  return (
    <div className="min-h-screen bg-black/80 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-yellow-400 font-playfair text-xl font-bold">
          Dashboard
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-yellow-400 text-2xl focus:outline-none"
        >
          {sidebarOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-black/70 p-6 flex flex-col justify-between border-r border-gray-700 md:w-64 w-full md:block ${
          sidebarOpen ? "block" : "hidden"
        } md:flex md:flex-col`}
      >
        <div>
          <h2 className="text-yellow-400 font-playfair text-2xl font-bold mb-6 md:hidden">
            Menu
          </h2>

          <nav className="flex flex-col gap-4">
            <Link
              to="/blogs/new"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl hover:bg-yellow-500 transition font-semibold"
            >
              <AiOutlinePlus /> Create Blog
            </Link>
            <Link
              to={`/authors/edit/${authorId}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-gray-700 transition font-semibold"
            >
              <AiOutlineEdit /> Edit Profile
            </Link>
            <Link
              to={`/authors/${authorId}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-gray-700 transition font-semibold"
            >
              <AiOutlineEye /> View Profile
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 relative">
        {/* Header: Welcome + Logout */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-playfair text-yellow-400 font-bold">
              Welcome, {author?.name || "Author"}
            </h1>
            <div className="mt-2 text-gray-200">
              👋 Hello {author?.name || "Author"}, welcome back! Ready to create
              something amazing today?
            </div>

            {!isProfileComplete && (
              <div className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded-xl font-medium inline-block">
                ⚠️ Your profile is incomplete.{" "}
                <Link
                  to={`/authors/edit/${authorId}`}
                  className="underline font-semibold"
                >
                  Update your profile
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-red-600 transition font-semibold mt-4 sm:mt-0"
          >
            <AiOutlineLogout /> Logout
          </button>
        </div>

        {/* Note about platform */}
        <div className="mb-4 text-gray-300 italic text-sm">
          ⚡ RazorBlogs is free to use, but authors are responsible for
          promoting their own blogs and content.
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/60 p-6 rounded-xl shadow-md border border-gray-700 hover:border-yellow-400 transition text-center">
            <h2 className="text-gray-200 font-semibold">Total Blogs</h2>
            <p className="text-yellow-400 font-bold text-2xl mt-2">
              {blogs.length}
            </p>
          </div>
          <div className="bg-black/60 p-6 rounded-xl shadow-md border border-gray-700 hover:border-yellow-400 transition text-center">
            <h2 className="text-gray-200 font-semibold">Total Views</h2>
            <p className="text-yellow-400 font-bold text-2xl mt-2">
              {totalViews}
            </p>
          </div>
          <div className="bg-black/60 p-6 rounded-xl shadow-md border border-gray-700 hover:border-yellow-400 transition text-center">
            <h2 className="text-gray-200 font-semibold">Create Blog</h2>
            <Link
              to="/blogs/new"
              className="inline-block mt-2 bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition"
            >
              <AiOutlinePlus /> New
            </Link>
          </div>
        </div>

        {/* Blogs Section */}
        <h2 className="text-2xl text-white font-semibold mb-6">Your Blogs</h2>
        {blogs.length === 0 ? (
          <p className="text-gray-200">You have not created any blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-gray-700 shadow-md hover:border-yellow-400 transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-yellow-400 font-bold text-lg mb-2">
                    {blog.title}
                  </h3>
                  <div
                    className="text-gray-200 text-sm mb-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                  <div className="text-gray-400 text-xs">
                    👁️ Readers: {blog.readers}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex gap-2">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="text-blue-400 hover:underline text-sm font-semibold flex items-center gap-1"
                    >
                      👁️ View
                    </Link>
                    <Link
                      to={`/blogs/${blog.id}/edit`}
                      className="text-yellow-400 hover:underline text-sm font-semibold flex items-center gap-1"
                    >
                      <AiOutlineEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 hover:underline text-sm font-semibold flex items-center gap-1"
                    >
                      <AiOutlineDelete /> Delete
                    </button>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-gray-400 text-sm italic">
          💡 Remember to keep your profile updated. <br />⚡ You can manage all
          your blogs here.
        </div>
      </main>
    </div>
  );
};

export default AuthorsDashboard;
