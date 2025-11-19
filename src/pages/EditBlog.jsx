// src/pages/EditBlog.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BLOG_URL, AUTHOR_URL } from "../api";
import {
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlineLink,
  AiOutlineCode,
  AiOutlineHighlight,
} from "react-icons/ai";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";

const categories = [
  "Technology",
  "Agriculture",
  "Entertainment",
  "News",
  "Health",
  "Education",
  "Sports",
  "Lifestyle",
];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  // Fetch author
  useEffect(() => {
    if (!token || !authorId) {
      navigate("/authors/login");
      return;
    }

    const fetchAuthor = async () => {
      try {
        const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setAuthor(data.author);
      } catch {
        navigate("/authors/login");
      } finally {
        setLoadingAuthor(false);
      }
    };
    fetchAuthor();
  }, [token, authorId, navigate]);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      Image,
      CodeBlock,
      Blockquote,
    ],
    content: "",
    editorProps: {
      attributes: {
        className:
          "w-full min-h-[200px] p-4 bg-black/60 border border-gray-600 rounded-xl focus:outline-none",
        style: "color: white;", // text visible like NewBlog
      },
    },
  });

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${BLOG_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        const b = data.blog;
        setTitle(b.title);
        setSlug(generateSlug(b.title));
        setCategory(b.category);
        setImageURL(b.image_url || "");
        if (editor) editor.commands.setContent(b.content);
      } catch (err) {
        console.error(err);
        navigate("/authors/dashboard");
      }
    };
    if (editor) fetchBlog();
  }, [id, token, navigate, editor]);

  const generateSlug = (t) =>
    t
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const htmlContent = editor.getHTML();

    const payload = {
      title,
      slug,
      category,
      content: htmlContent,
      image_url: imageURL,
    };

    try {
      const res = await fetch(`${BLOG_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const TB = ({ onClick, icon, active }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg ${
        active ? "bg-yellow-400 text-black" : "text-white bg-black/40"
      } hover:bg-yellow-500 transition`}
    >
      {icon}
    </button>
  );

  if (loadingAuthor)
    return (
      <div className="text-white text-center py-10">Loading author...</div>
    );

  return (
    <div className="min-h-screen bg-black/80 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-black/70 p-6 flex flex-col justify-between border-r border-gray-700 md:w-64 w-full">
        <div>
          <nav className="flex flex-col gap-4">
            <Link
              to="/blogs/new"
              className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold"
            >
              <AiOutlinePlus /> Create Blog
            </Link>
            <Link
              to={`/authors/edit/${authorId}`}
              className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-gray-700"
            >
              <AiOutlineEdit /> Edit Profile
            </Link>
            <Link
              to={`/authors/${authorId}`}
              className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-gray-700"
            >
              <AiOutlineEye /> View Profile
            </Link>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("authorToken");
            localStorage.removeItem("authorId");
            navigate("/authors/login");
          }}
          className="flex items-center gap-2 text-gray-200 px-4 py-2 rounded-xl hover:bg-red-600 font-semibold"
        >
          <AiOutlineLogout /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-4xl font-playfair text-yellow-400 font-bold mb-4">
          Edit Blog
        </h1>
        <p className="text-gray-200 mb-6">
          Update your blog content and preview changes in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form
            onSubmit={handleUpdate}
            className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4"
          >
            <label className="flex flex-col text-gray-200">
              Title *
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                className="mt-1 p-2 rounded-xl bg-black/50 border border-gray-600 text-white"
                required
              />
            </label>

            <label className="flex flex-col text-gray-200">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 p-2 rounded-xl bg-black/50 border border-gray-600 text-white"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-gray-200">
              Image URL
              <input
                type="text"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                className="mt-1 p-2 rounded-xl bg-black/50 border border-gray-600 text-white"
              />
            </label>

            {/* Toolbar */}
            <div className="flex gap-2 flex-wrap bg-black/40 p-3 rounded-xl border border-gray-700">
              <TB
                icon={<AiOutlineBold />}
                active={editor?.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
              <TB
                icon={<AiOutlineItalic />}
                active={editor?.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
              <TB
                icon={<AiOutlineUnderline />}
                active={editor?.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
              <TB
                icon={<AiOutlineOrderedList />}
                active={editor?.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
              <TB
                icon={<AiOutlineUnorderedList />}
                active={editor?.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
              <TB
                icon={<AiOutlineLink />}
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url)
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url })
                      .run();
                }}
              />
              <TB
                icon={<AiOutlineCode />}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              />
              <TB
                icon={<AiOutlineHighlight />}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              />
            </div>

            <label className="flex flex-col text-gray-200">Content *</label>
            <EditorContent editor={editor} />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500"
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </form>

          {/* Live Preview */}
          <div className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4">
            {imageURL && (
              <img
                src={imageURL}
                alt="Preview"
                className="w-full rounded-xl object-cover max-h-64"
              />
            )}
            <h3 className="text-white text-xl font-semibold">{title}</h3>
            {category && (
              <span className="text-gray-400 text-sm">{category}</span>
            )}
            <div
              className="prose prose-invert max-w-none text-white"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditBlog;
