import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BLOG_URL, COMMENTS_URL } from "../api";
import {
  Facebook,
  Linkedin,
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Terminal,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { SiWhatsapp, SiX } from "react-icons/si";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  const fetchData = async () => {
    try {
      const [blogRes, allBlogsRes, commentsRes] = await Promise.all([
        fetch(`${BLOG_URL}/${id}`),
        fetch(BLOG_URL),
        fetch(`${COMMENTS_URL}/${id}`),
      ]);

      if (!blogRes.ok) throw new Error("Entry not found.");

      const blogData = await blogRes.json();
      const allData = await allBlogsRes.json();
      const commData = await commentsRes.json();

      setBlog(blogData);
      setAllBlogs(allData);
      setComments(
        Array.isArray(commData) ? commData : commData?.comments || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-blue-500 text-[10px] tracking-widest">
        DECRYPTING_LOG...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-500">
        {error}
      </div>
    );

  const authorName = blog.authorName || "System_Admin";
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
      if (res.ok) {
        setNewComment("");
        setUsername("");
        fetchData(); // Refresh comments
      }
    } catch (err) {
      console.error(err);
    }
  };

  const relatedBlogs = allBlogs
    .filter((b) => b.blog.id !== blog.blog.id)
    .sort((a, b) => (b.blog.readers || 0) - (a.blog.readers || 0))
    .slice(0, 3);

  return (
    <main className="bg-[#020202] text-gray-300 min-h-screen selection:bg-blue-600 font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Back_To_Archive
          </button>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-8 h-8 bg-white rounded flex items-center justify-center text-black shadow-lg shadow-white/5"
            >
              <Terminal size={16} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 py-20">
        {/* Main Content Column */}
        <article className="lg:col-span-8 space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-mono text-blue-400 uppercase tracking-widest">
                {blog.blog.category || "General_Log"}
              </span>
              <span className="text-[10px] font-mono text-gray-600 uppercase">
                Ver_4.0.2
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1]">
              {blog.blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <ShieldCheck size={14} />
                </div>
                <span className="text-[11px] font-mono text-white uppercase tracking-wider">
                  {authorName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-600 uppercase">
                <Clock size={12} />{" "}
                {new Date(blog.blog.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-600 uppercase">
                <Eye size={12} /> {blog.blog.readers || 0} Records
              </div>
            </div>
          </header>

          {blog.blog.image_url && (
            <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <img
                src={blog.blog.image_url}
                alt="Log Header"
                className="w-full h-auto object-cover opacity-90"
              />
            </div>
          )}

          {/* Body Content */}
          <section
            className="prose prose-invert max-w-none 
            prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tighter
            prose-p:text-gray-400 prose-p:leading-relaxed prose-p:font-light
            prose-pre:bg-[#080808] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl
            prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
            [&_ul]:list-square [&_ol]:list-decimal"
            dangerouslySetInnerHTML={{ __html: blog.blog.content }}
          />

          {/* Social Share Terminal */}
          <div className="pt-12 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <Share2 size={12} /> Broadcast_To:
              </span>
              <div className="flex items-center gap-4">
                <SiWhatsapp
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${encodedTitle} ${shareUrl}`,
                      "_blank"
                    )
                  }
                  className="cursor-pointer hover:text-green-500 transition"
                />
                <SiX
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${shareUrl}`,
                      "_blank"
                    )
                  }
                  className="cursor-pointer hover:text-white transition"
                />
                <Linkedin
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/shareArticle?url=${shareUrl}`,
                      "_blank"
                    )
                  }
                  className="cursor-pointer hover:text-blue-500 transition"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded hover:bg-white hover:text-black transition"
                >
                  {copied ? "COPIED" : "COPY_LINK"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments System */}
          <section className="pt-20 space-y-12">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <MessageSquare size={20} className="text-blue-500" />{" "}
              Interaction_Logs
            </h3>

            <div className="space-y-6">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-white/10 text-gray-500 font-mono italic">
                    {c.username?.charAt(0) || "?"}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white uppercase">
                        {c.username || "Guest_User"}
                      </span>
                      <span className="text-[9px] font-mono text-gray-700 uppercase">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={postComment}
              className="bg-[#080808] border border-white/5 p-8 rounded-[2rem] space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="AUTHOR_NAME"
                  className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="WRITE_RESPONSE..."
                rows={4}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500 transition resize-none"
                required
              />
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all">
                Submit_To_Archive
              </button>
            </form>
          </section>
        </article>

        {/* Sidebar: System Data */}
        <aside className="lg:col-span-4 space-y-12 lg:sticky lg:top-32 h-fit">
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-8">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              Related_Archives
            </h3>
            <div className="space-y-8">
              {relatedBlogs.map((b) => (
                <Link
                  key={b.blog.id}
                  to={`/blogs/${b.blog.id}`}
                  className="group block space-y-3"
                >
                  <div className="flex items-center gap-2 text-[9px] font-mono text-blue-500 uppercase">
                    <Clock size={10} />{" "}
                    {new Date(b.blog.created_at).toLocaleDateString()}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-500 transition-colors leading-snug">
                    {b.blog.title}
                  </h4>
                  <div className="flex items-center justify-between text-[9px] font-mono text-gray-700 uppercase">
                    <span>By: {b.authorName}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={10} /> {b.blog.readers}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/blogs"
              className="block text-center py-3 border border-dashed border-white/10 rounded-xl text-[9px] font-mono uppercase tracking-widest hover:border-blue-500 hover:text-white transition-all"
            >
              View_All_Logs
            </Link>
          </div>

          <div className="p-8 bg-blue-600 rounded-[2.5rem] space-y-4">
            <h3 className="text-lg font-bold text-white">Join the Archive.</h3>
            <p className="text-xs text-blue-100 font-light leading-relaxed">
              Have a technical retrospective or startup insight to share?
              Request contributor access to the Alcodist Registry.
            </p>
            <Link
              to="/authors/register"
              className="flex items-center gap-2 text-[10px] font-mono text-white font-bold uppercase pt-4"
            >
              Get_Access <ChevronRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
