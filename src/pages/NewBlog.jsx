// src/pages/NewBlog.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL, BLOG_URL } from "../api";

import {
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlineLink,
  AiOutlineDoubleRight, // blockquote
} from "react-icons/ai";

// TipTap
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

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

const NewBlog = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [author, setAuthor] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

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
        setAuthor(data);
      } catch {
        navigate("/authors/login");
      } finally {
        setLoadingAuthor(false);
      }
    };
    fetchAuthor();
  }, [token, authorId, navigate]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      Image,
      CodeBlock,
      HorizontalRule,
    ],
    content: "",
    editorProps: {
      attributes: {
        className:
          "w-full min-h-[200px] p-4 bg-black/60 border border-gray-600 rounded-xl focus:outline-none",
        style: "color: white;", // text visible
      },
    },
  });

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const htmlContent = editor.getHTML();

      const body = {
        title,
        content: htmlContent,
        category,
        image_url: imageFile
          ? URL.createObjectURL(imageFile) // preview only
          : "",
      };

      const res = await fetch(BLOG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to publish blog");

      const data = await res.json();
      console.log("Blog created:", data);
      navigate("/authors/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to publish blog");
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
      {/* Mobile Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-yellow-400 font-playfair text-xl font-bold">
          New Blog
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-yellow-400 text-2xl"
        >
          {sidebarOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-black/70 p-6 flex flex-col justify-between border-r border-gray-700 md:w-64 w-full md:block ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
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
          Create a New Blog
        </h1>
        <p className="text-gray-200 mb-6">
          Fill the form below and preview your blog before publishing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form
            onSubmit={handlePublish}
            className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4"
          >
            {/* Title */}
            <label className="flex flex-col text-gray-200">
              Title *
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 rounded-xl bg-black/50 border border-gray-600 text-white"
                required
              />
            </label>

            {/* Category */}
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

            {/* Image upload (preview only) */}
            <label className="flex flex-col text-gray-200">
              Blog Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
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
                icon={<AiOutlineDoubleRight />}
                active={editor?.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              />
              <TB
                icon={<span className="font-bold">H1</span>}
                active={editor?.isActive("heading", { level: 1 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              />
              <TB
                icon={<span className="font-bold">H2</span>}
                active={editor?.isActive("heading", { level: 2 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              />
              <TB
                icon={<span>{"</>"}</span>}
                active={editor?.isActive("codeBlock")}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              />
              <TB
                icon={<span>―</span>}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              />
            </div>

            {/* Editor */}
            <label className="flex flex-col text-gray-200">Content *</label>
            <EditorContent editor={editor} />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500"
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </form>

          {/* Live Preview */}
          <div className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4">
            <h2 className="text-yellow-400 font-bold text-2xl">Live Preview</h2>
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
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

export default NewBlog;
