// src/pages/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BLOG_URL, COMMENTS_URL } from "../api";
import { Copy, X, Facebook, Linkedin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [readingMode, setReadingMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch blog by ID
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

  // Fetch comments safely
  const fetchComments = async () => {
    try {
      const res = await fetch(`${COMMENTS_URL}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch comments.");
      const data = await res.json();
      // Ensure comments is always an array
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
  if (error)
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!blog) return <p className="text-center py-10">Blog not found.</p>;

  const toggleReadingMode = () => setReadingMode((prev) => !prev);

  const authorName = blog.authorName || "Unknown Author";
  const shareUrl = window.location.href;
  const encodedTitle = encodeURIComponent(blog.blog.title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const relatedBlogs =
    blog.allBlogs
      ?.filter(
        (b) =>
          b.blog.category === blog.blog.category && b.blog.id !== blog.blog.id,
      )
      .slice(0, 3) || [];

  const renderContent = () => {
    const content = blog.blog.content;
    if (content.startsWith("```")) {
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <code>{content.replace(/```/g, "")}</code>
        </pre>
      );
    } else if (content.startsWith(">")) {
      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic">
          {content.replace(/^>\s*/, "")}
        </blockquote>
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <main
      className={`${
        readingMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen`}
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
            <Link to="/login" className="hover:text-[#FFD400] transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-[#FFD400] transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Blog Header */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 relative">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-wide">
          {blog.blog.title}
        </h1>
        <p className="text-gray-500 text-sm mb-2">
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
        <img
          src={blog.blog.image_url || "/placeholder.jpg"}
          alt={blog.blog.title || "Blog Image"}
          className="w-full max-h-96 object-cover rounded-lg my-6"
        />
        <button
          onClick={toggleReadingMode}
          className="absolute top-6 right-6 px-4 py-2 bg-[#FFD400] rounded-lg hover:bg-yellow-500 transition"
        >
          {readingMode ? "Normal Mode" : "Reading Mode"}
        </button>
      </section>

      {/* Main Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2 space-y-8">
          <div className="prose max-w-none">{renderContent()}</div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <a
              href={`https://wa.me/?text=${encodedTitle} ${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-green-600 transition"
            >
              <SiWhatsapp className="w-5 h-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-serif font-bold mb-6">Comments</h3>

            {!comments || comments.length === 0 ? (
              <p className="text-gray-500 italic">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <ul className="space-y-6">
                {comments.map((c) => (
                  <li key={c.id} className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <span
                        className="font-semibold"
                        style={{ color: readingMode ? "#fff" : "#000" }}
                      >
                        {c.username || "Anonymous"}
                      </span>
                      <span style={{ color: readingMode ? "#fff" : "#000" }}>
                        •
                      </span>
                      <span style={{ color: readingMode ? "#fff" : "#000" }}>
                        {c.created_at
                          ? new Date(c.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <p style={{ color: readingMode ? "#fff" : "#000" }}>
                      {c.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={postComment} className="mt-8 space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition"
                required
              />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent resize-none transition"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFD400] text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Post Comment
              </button>
            </form>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              Related Blogs
            </h3>
            <ul className="space-y-4">
              {relatedBlogs.map((b) => (
                <li key={b.blog.id} className="flex items-center gap-2">
                  <img
                    src={b.blog.image_url || "/placeholder.jpg"}
                    alt={b.blog.title || "Blog Image"}
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

          <div
            className={`${
              readingMode
                ? "bg-gray-800 text-white"
                : "bg-blue-50 text-gray-900"
            } p-6 rounded-lg text-center shadow-md`}
          >
            <h2 className="text-xl font-serif font-bold mb-2">
              Are you a blogger?
            </h2>
            <p className="mb-4">Register now and start sharing your stories!</p>
            <Link
              to="/register"
              className={`${
                readingMode
                  ? "bg-[#FFD400] text-gray-900 hover:bg-yellow-500"
                  : "bg-[#1E40AF] text-white hover:bg-blue-700"
              } inline-block px-4 py-2 rounded-lg transition`}
            >
              Register →
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
