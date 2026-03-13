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
            type: item.blog.type || "blog", // Mapping the new type field
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
    if (!confirm("Are you sure you want to delete this entry?")) return;

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
      <div className="text-white text-center py-10 font-mono animate-pulse">
        CONNECTING_TO_ALCODIST_HUB...
      </div>
    );

  const isProfileComplete = author?.name && author?.phone && author?.email;
  const totalViews = blogs.reduce((sum, b) => sum + b.readers, 0);

  return (
    <div className="min-h-screen bg-black/80 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10 bg-black">
        <h2 className="text-yellow-400 font-playfair text-xl font-bold uppercase tracking-tighter">
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
        className={`bg-black/70 p-6 flex flex-col justify-between border-r border-white/5 md:w-64 w-full md:block ${
          sidebarOpen ? "block" : "hidden"
        } md:flex md:flex-col sticky top-0 h-screen`}
      >
        <div>
          <h2 className="text-yellow-400 font-playfair text-2xl font-bold mb-8 hidden md:block uppercase tracking-widest text-center">
            ALCODIST
          </h2>

          <nav className="flex flex-col gap-4">
            <Link
              to="/blogs/new"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl hover:bg-yellow-500 transition font-bold uppercase text-xs"
            >
              <AiOutlinePlus /> Create New
            </Link>
            <Link
              to={`/authors/edit/${authorId}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-white/10 transition font-semibold text-xs uppercase"
            >
              <AiOutlineEdit /> Profile Settings
            </Link>
            <Link
              to={`/authors/${authorId}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-white/10 transition font-semibold text-xs uppercase"
            >
              <AiOutlineEye /> Public View
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 px-4 py-2 rounded-xl hover:bg-red-600/20 hover:text-red-500 transition font-bold text-xs uppercase"
        >
          <AiOutlineLogout /> Terminate Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-playfair text-yellow-400 font-bold uppercase tracking-tighter">
              {author?.name || "Author"}
            </h1>
            <p className="mt-2 text-gray-400 font-mono text-xs uppercase tracking-widest">
              Access Level: Startup Founder // {author?.email}
            </p>

            {!isProfileComplete && (
              <div className="mt-4 bg-red-600/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-xl text-xs font-bold inline-block">
                CRITICAL: PROFILE_INCOMPLETE.{" "}
                <Link to={`/authors/edit/${authorId}`} className="underline">
                  FIX_NOW
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 text-center">
            <h2 className="text-gray-500 font-mono text-[10px] uppercase">
              Entries
            </h2>
            <p className="text-white font-bold text-3xl mt-2">{blogs.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 text-center">
            <h2 className="text-gray-500 font-mono text-[10px] uppercase">
              Reach
            </h2>
            <p className="text-yellow-400 font-bold text-3xl mt-2">
              {totalViews}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center">
            <h2 className="text-gray-500 font-mono text-[10px] uppercase mb-2">
              New Content
            </h2>
            <Link
              to="/blogs/new"
              className="text-yellow-400 text-2xl hover:scale-110 transition"
            >
              <AiOutlinePlus />
            </Link>
          </div>
        </div>

        {/* Repository Section */}
        <h2 className="text-xl text-white font-bold mb-6 uppercase tracking-widest border-b border-white/5 pb-2">
          Content_Repository
        </h2>

        {blogs.length === 0 ? (
          <div className="text-gray-500 font-mono text-xs italic p-10 border border-dashed border-white/10 rounded-2xl text-center">
            SYSTEM_EMPTY: No entries found in author database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-yellow-400/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-tighter ${
                        blog.type === "tdd"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : blog.type === "case study"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}
                    >
                      {blog.type}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-white group-hover:text-yellow-400 font-bold text-lg mb-2 leading-tight transition">
                    {blog.title}
                  </h3>

                  <div
                    className="text-gray-400 text-xs mb-4 line-clamp-2 opacity-60 italic"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                  <div className="flex gap-4">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="text-gray-500 hover:text-white transition"
                      title="View"
                    >
                      <AiOutlineEye size={18} />
                    </Link>
                    <Link
                      to={`/blogs/${blog.id}/edit`}
                      className="text-yellow-400/50 hover:text-yellow-400 transition"
                      title="Edit"
                    >
                      <AiOutlineEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500/40 hover:text-red-500 transition"
                      title="Delete"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500">
                    👁️ {blog.readers}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] border-t border-white/5 pt-4">
          ALCODIST_HUB_CORE // SECURE_AUTH_ACTIVE
        </div>
      </main>
    </div>
  );
};

export default AuthorsDashboard;
