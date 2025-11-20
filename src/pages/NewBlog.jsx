// src/pages/NewBlog.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL, BLOG_URL } from "../api";

import {
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineCopy,
} from "react-icons/ai";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

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
  const [content, setContent] = useState(""); // live content state

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  const editorRef = useRef();

  // Fetch author info
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

  // Cloudinary upload
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "razorblogs");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpiitjfzd/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) throw new Error("Failed to upload image");
    const data = await res.json();
    return data.secure_url;
  };

  // Publish blog
  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = "";
      if (imageFile) uploadedImageUrl = await uploadToCloudinary(imageFile);

      const body = {
        title,
        content, // saved as HTML
        category,
        image_url: uploadedImageUrl,
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

  if (loadingAuthor)
    return (
      <div className="text-white text-center py-10">Loading author...</div>
    );

  // Copy code block content
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

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
          {/* Form */}
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

            {/* Image upload */}
            <label className="flex flex-col text-gray-200">
              Blog Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 p-2 rounded-xl bg-black/50 border border-gray-600 text-white"
              />
            </label>

            {/* Editor */}
            <label className="flex flex-col text-gray-200">Content *</label>
            <Editor
              ref={editorRef}
              initialValue=""
              previewStyle="vertical"
              height="300px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              language="en-US"
              hideModeSwitch={true}
              toolbarItems={[
                ["heading", "bold", "italic", "strike"],
                ["hr", "quote", "code", "link"],
                ["ul", "ol"],
                ["image"],
              ]}
              onChange={() =>
                setContent(editorRef.current.getInstance().getHTML())
              }
            />

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
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Add copy button for code blocks */}
            {content &&
              Array.from(document.querySelectorAll(".prose pre code")).forEach(
                (block) => {
                  if (!block.parentElement.querySelector(".copy-btn")) {
                    const btn = document.createElement("button");
                    btn.innerText = "Copy";
                    btn.className =
                      "copy-btn absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs";
                    btn.onclick = () => copyCode(block.innerText);
                    block.parentElement.style.position = "relative";
                    block.parentElement.appendChild(btn);
                  }
                },
              )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewBlog;
