import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BLOG_URL, AUTHOR_URL } from "../api";

export default function RazorBlogsLanding() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestLimit, setLatestLimit] = useState(4); // Limit Latest Blogs initially
  const [trendingLimit, setTrendingLimit] = useState(5);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(BLOG_URL);
        if (!res.ok) throw new Error("Failed to fetch blogs.");
        const data = await res.json();
        const blogsWithAuthors = data.map((blog) => ({
          ...blog,
          author: {
            id: blog.blog?.author_id || "unknown",
            name: blog.authorName || "Unknown",
            avatar_url: blog.authorAvatar || null,
          },
        }));
        setBlogs(blogsWithAuthors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading)
    return <p className="text-center text-gray-700 py-10">Loading blogs...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 py-10">
        Error loading blogs: {error}
      </p>
    );
  if (!blogs || blogs.length === 0)
    return (
      <p className="text-center text-gray-700 py-10">
        No blogs available at the moment
      </p>
    );

  const featuredBlog = blogs[0];
  const latestBlogs = blogs.slice(1, latestLimit + 1);

  const categories = Array.from(
    new Set(blogs.map((b) => b.blog?.category).filter(Boolean)),
  );
  const blogsByCategory = categories.map((cat) => ({
    category: cat,
    blogs: blogs.filter((b) => b.blog?.category === cat).slice(0, 3),
  }));

  const trendingBlogs = [...blogs]
    .sort((a, b) => (b.blog?.readers || 0) - (a.blog?.readers || 0))
    .slice(0, trendingLimit);

  const authorMap = {};
  blogs.forEach((b) => {
    const id = b.author.id || "unknown";
    if (!authorMap[id]) {
      authorMap[id] = {
        name: b.author.name || "Unknown",
        avatar_url: b.author.avatar_url || null,
        count: 0,
      };
    }
    authorMap[id].count += 1;
  });

  const topBloggers = Object.entries(authorMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const handleLoadMore = () => setLatestLimit(latestLimit + 4);

  const handleLogout = () => {
    localStorage.removeItem("authorToken");
    localStorage.removeItem("authorId");
    navigate("/authors/login");
  };

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* Top Navbar */}
      <nav className="w-full bg-white/90 backdrop-blur border-b border-gray-200 fixed z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-sm">
          <div className="flex space-x-6 font-medium">
            <Link to="/" className="hover:text-[#FFD400] transition">
              Home
            </Link>
            <Link to="/blogs" className="hover:text-[#FFD400] transition">
              Blogs
            </Link>
            <Link to="/authors" className="hover:text-[#FFD400] transition">
              Authors
            </Link>
          </div>
          <div className="flex space-x-6 font-medium">
            {token && authorId ? (
              <>
                <Link
                  to="/authors/dashboard"
                  className="hover:text-[#FFD400] transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-500 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/authors/login"
                  className="hover:text-[#FFD400] transition"
                >
                  Login
                </Link>
                <Link
                  to="/authors/register"
                  className="hover:text-[#FFD400] transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-28 px-6 md:px-12 text-center mt-16">
        {/* Brand Label */}
        <div className="text-sm text-yellow-400 uppercase mb-2 tracking-wide">
          RazorBlogs
        </div>

        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 leading-tight tracking-wide">
          Where Stories Grow.
        </h1>

        <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
          Read, write, and grow with a community of modern storytellers.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="#latest"
            className="inline-block px-8 py-3 bg-[#FFD400] text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
          >
            Explore Blogs
          </Link>
          {!token && (
            <Link
              to="/authors/register"
              className="inline-block px-8 py-3 bg-[#1E40AF] text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Join as Blogger
            </Link>
          )}
        </div>
      </section>
      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Featured + Latest Blogs */}
        <div className="lg:col-span-2 space-y-12">
          {/* Featured Blog */}
          {featuredBlog && (
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <img
                src={featuredBlog.blog.image_url}
                alt={featuredBlog.blog.title}
                className="w-full h-96 object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 group-hover:underline transition">
                    {featuredBlog.blog.title}
                  </h2>
                  <p className="text-gray-200 mb-4">
                    By{" "}
                    {featuredBlog.author.id ? (
                      <Link
                        to={`/authors/${featuredBlog.author.id}`}
                        className="underline hover:text-[#FFD400] transition"
                      >
                        {featuredBlog.author.name}
                      </Link>
                    ) : (
                      featuredBlog.author.name
                    )}{" "}
                    |{" "}
                    {new Date(
                      featuredBlog.blog.created_at,
                    ).toLocaleDateString()}
                  </p>
                  <div
                    className="text-gray-200 line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: featuredBlog.blog.content,
                    }}
                  />
                  <Link
                    to={`/blogs/${featuredBlog.blog.id}`}
                    className="inline-block px-6 py-2 bg-[#FFD400] text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Latest Blogs */}
          <div id="latest">
            <h2 className="text-3xl font-serif font-bold mb-6 tracking-wide">
              Latest Blogs
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {latestBlogs.map((blog) => (
                <Link
                  key={blog.blog.id}
                  to={`/blogs/${blog.blog.id}`}
                  className="block rounded-xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 bg-gray-50 group"
                >
                  <img
                    src={blog.blog.image_url}
                    alt={blog.blog.title}
                    className="w-full h-48 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-[#FFD400] transition-colors">
                      {blog.blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      By{" "}
                      {blog.author.id ? (
                        <Link
                          to={`/authors/${blog.author.id}`}
                          className="underline hover:text-[#FFD400] transition"
                        >
                          {blog.author.name}
                        </Link>
                      ) : (
                        blog.author.name
                      )}{" "}
                      | {new Date(blog.blog.created_at).toLocaleDateString()}
                    </p>
                    <div
                      className="text-gray-700 line-clamp-3 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: blog.blog.content?.slice(0, 300),
                      }}
                    />
                    <span className="text-[#FFD400] font-medium">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {latestLimit < blogs.length - 1 && (
              <button
                onClick={handleLoadMore}
                className="mt-6 px-6 py-2 bg-[#FFD400] text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Load More Blogs
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-12 sticky top-24">
          {/* Categories */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Categories</h3>
            {blogsByCategory.map(({ category, blogs }) => (
              <div key={category} className="mb-6">
                <h4 className="text-xl font-semibold mb-2">{category}</h4>
                <ul className="space-y-2">
                  {blogs.map((b) => (
                    <li key={b.blog.id} className="flex items-center gap-2">
                      <img
                        src={b.blog.image_url}
                        alt={b.blog.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <Link
                        to={`/blogs/${b.blog.id}`}
                        className="text-[#FFD400] hover:underline text-sm line-clamp-1"
                      >
                        {b.blog.title.slice(0, 30)}
                        {b.blog.title.length > 30 && "..."}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trending Blogs */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Trending</h3>
            <ul className="space-y-4">
              {trendingBlogs.map((b) => (
                <li key={b.blog.id}>
                  <Link
                    to={`/blogs/${b.blog.id}`}
                    className="block hover:underline text-gray-800"
                  >
                    {b.blog.title.slice(0, 40)}
                    {b.blog.title.length > 40 && "..."}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    {b.author.name} | {b.blog.readers || 0} readers
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Bloggers */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Top Bloggers</h3>
            <ul className="space-y-4">
              {topBloggers.map(([id, blogger]) => (
                <li key={id} className="flex items-center space-x-3">
                  {blogger.avatar_url ? (
                    <img
                      src={blogger.avatar_url}
                      alt={blogger.name || "Unknown"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                      {(blogger.name || "?").charAt(0)}
                    </div>
                  )}
                  <div>
                    <Link
                      to={`/authors/${id}`}
                      className="text-gray-800 font-medium hover:text-[#FFD400] transition"
                    >
                      {blogger.name || "Unknown"}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {blogger.count} blogs • ⭐ Top Blogger
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Register as Blogger */}
          {!token && (
            <div className="p-8 bg-blue-50 rounded-lg text-center shadow-md mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">
                Become a Storyteller
              </h2>
              <p className="mb-4 text-gray-700">
                Share your ideas, insights, and experiences — start your journey
                with RazorBlog today.
              </p>
              <Link
                to="/authors/register"
                className="inline-block px-6 py-3 bg-[#1E40AF] text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Register as Blogger →
              </Link>
            </div>
          )}

          {/* Join WhatsApp Group */}
          <div className="p-8 bg-yellow-50 rounded-lg text-center shadow-md">
            <h2 className="text-2xl font-serif font-bold mb-2">
              Join the RazorBlog Hub
            </h2>
            <p className="mb-4 text-gray-700">
              Connect with fellow storytellers and readers — share ideas, get
              inspired, and grow together.
            </p>
            <a
              href="https://chat.whatsapp.com/KFKfAVTal37GX1EdGUGjjH"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Join WhatsApp Group →
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
