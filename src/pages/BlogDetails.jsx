// src/pages/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BLOG_URL, COMMENTS_URL } from "../api";
import { Facebook, Linkedin } from "lucide-react";
import { SiWhatsapp, SiX } from "react-icons/si";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [readingMode, setReadingMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${BLOG_URL}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog.");
      const data = await res.json();
      setBlog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${COMMENTS_URL}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch comments.");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : data?.comments || []);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading blog...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!blog) return <p className="text-center py-10">Blog not found.</p>;

  const toggleReadingMode = () => setReadingMode((prev) => !prev);
  const authorName = blog.authorName || "Unknown Author";
  const shareUrl = window.location.href;
  const encodedTitle = encodeURIComponent(blog.blog.title);

  const postComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !username.trim()) return;
    try {
      const res = await fetch(COMMENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blog_id: blog.blog.id,
          content: newComment.trim(),
          username: username.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to post comment.");
      setNewComment("");
      setUsername("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDashboardLink = () => {
    return token && authorId
      ? [
          <Link
            key="dashboard"
            to="/authors/dashboard"
            className="hover:text-[#FFD400] transition"
          >
            Dashboard
          </Link>,
          <button
            key="logout"
            onClick={() => {
              localStorage.removeItem("authorToken");
              localStorage.removeItem("authorId");
              navigate("/authors/login");
            }}
            className="hover:text-[#FFD400] transition"
          >
            Logout
          </button>,
        ]
      : [
          <Link
            key="login"
            to="/authors/login"
            className="hover:text-[#FFD400] transition"
          >
            Login
          </Link>,
          <Link
            key="register"
            to="/authors/register"
            className="hover:text-[#FFD400] transition"
          >
            Register
          </Link>,
        ];
  };

  // Related blogs: top 3 by readers, excluding current blog
  const relatedBlogs =
    (blog.allBlogs || [])
      .filter((b) => b.blog.id !== blog.blog.id)
      .sort((a, b) => (b.blog.readers || 0) - (a.blog.readers || 0))
      .slice(0, 3) || [];

  return (
    <main
      className={`${
        readingMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen transition-colors duration-500`}
    >
      {/* Navbar */}
      <nav className="w-full bg-black dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
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
            {toggleDashboardLink()}
          </div>
        </div>
      </nav>

      {/* Blog Header */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 py-12 relative">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-wide leading-tight">
          {blog.blog.title}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          By{" "}
          <Link
            to={`/authors/${blog.blog.author_id}`}
            className="underline hover:text-[#FFD400]"
          >
            {authorName}
          </Link>{" "}
          | {new Date(blog.blog.created_at).toLocaleDateString()} |{" "}
          {blog.blog.category || "Uncategorized"}
        </p>
        {blog.blog.image_url && (
          <img
            src={blog.blog.image_url}
            alt={blog.blog.title || "Blog Image"}
            className="w-full aspect-video object-cover rounded-xl shadow-md my-6"
          />
        )}
        <button
          onClick={toggleReadingMode}
          className="absolute top-6 right-6 px-4 py-2 bg-[#FFD400] rounded-lg hover:bg-yellow-500 transition"
        >
          {readingMode ? "Normal Mode" : "Reading Mode"}
        </button>
      </section>

      {/* Main Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2 space-y-12">
          {/* Blog content */}
          <div
            className={`prose max-w-none md:prose-lg lg:prose-xl [&_ol]:list-decimal [&_ul]:list-disc ${
              readingMode ? "prose-invert text-white" : "text-gray-900"
            }`}
            dangerouslySetInnerHTML={{ __html: blog.blog.content }}
          />

          {/* Share Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <SiWhatsapp
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodedTitle} ${shareUrl}`,
                  "_blank",
                )
              }
              className="w-6 h-6 cursor-pointer text-green-500 hover:text-green-600 transition"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            >
              {copied ? "Copied!" : "📋"}
            </button>
            <Facebook
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  "_blank",
                )
              }
              className="w-6 h-6 cursor-pointer text-blue-700 hover:text-blue-800 transition"
            />
            <Linkedin
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodedTitle}`,
                  "_blank",
                )
              }
              className="w-6 h-6 cursor-pointer text-blue-600 hover:text-blue-700 transition"
            />
            <SiX
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${shareUrl}`,
                  "_blank",
                )
              }
              className="w-6 h-6 cursor-pointer text-[#1DA1F2] hover:text-[#0d95e8] transition"
            />
          </div>

          {/* Comments */}
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Comments</h3>

            {comments.length === 0 ? (
              <p className="text-gray-500 italic">No comments yet.</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className={`flex space-x-4 p-4 rounded-lg ${
                      readingMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                      {c.username?.charAt(0) || "A"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <span className="font-semibold">
                          {c.username || "Anonymous"}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-xs">
                          {c.created_at
                            ? new Date(c.created_at).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <p className="leading-relaxed">{c.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={postComment} className="mt-6 space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                required
              />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD400] resize-none"
                required
              />
              <button className="px-4 py-2 bg-[#FFD400] text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition">
                Post Comment
              </button>
            </form>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-12 lg:sticky lg:top-24">
          {/* Related Blogs */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              Related Blogs
            </h3>
            <ul className="space-y-4">
              {relatedBlogs.map((b) => (
                <li key={b.blog.id} className="flex items-center gap-2">
                  <img
                    src={b.blog.image_url || "/placeholder.jpg"}
                    alt={b.blog.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <Link
                    to={`/blogs/${b.blog.id}`}
                    className="text-[#FFD400] hover:underline text-sm line-clamp-1"
                  >
                    {b.blog.title || "Untitled Blog"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Register / Dashboard CTA */}
          <div
            className={`p-6 rounded-lg text-center shadow-md ${
              readingMode
                ? "bg-gray-800 text-white"
                : "bg-blue-50 text-gray-900"
            }`}
          >
            <h2 className="text-xl font-serif font-bold mb-2">
              Are you a blogger?
            </h2>
            <p className="mb-4">Register now and start sharing your stories!</p>
            <Link
              to={
                token && authorId ? "/authors/dashboard" : "/authors/register"
              }
              className={`inline-block px-6 py-3 rounded-lg font-semibold transition ${
                readingMode
                  ? "bg-[#FFD400] text-gray-900 hover:bg-yellow-500"
                  : "bg-[#1E40AF] text-white hover:bg-blue-700"
              }`}
            >
              {token && authorId ? "Dashboard →" : "Register →"}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
