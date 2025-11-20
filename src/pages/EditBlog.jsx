// src/pages/EditBlog.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BLOG_URL, AUTHOR_URL } from "../api";
import {
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
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

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  const editorRef = useRef();

  // Fetch author
  useEffect(() => {
    if (!token || !authorId) navigate("/authors/login");

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

  // Fetch blog data
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
        setCategory(b.category);
        setImageURL(b.image_url || "");
        setContent(b.content || "");
        if (editorRef.current) {
          editorRef.current.getInstance().setHTML(b.content || "");
        }
      } catch (err) {
        console.error(err);
        navigate("/authors/dashboard");
      }
    };
    fetchBlog();
  }, [id, token, navigate]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "razorblogs");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpiitjfzd/upload",
      { method: "POST", body: formData },
    );
    if (!res.ok) throw new Error("Failed to upload image");
    const data = await res.json();
    return data.secure_url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageURL = imageURL;
      if (imageFile) finalImageURL = await uploadToCloudinary(imageFile);

      const htmlContent = editorRef.current.getInstance().getHTML();

      const payload = {
        title,
        category,
        content: htmlContent,
        image_url: finalImageURL,
      };

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

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-4xl font-playfair text-yellow-400 font-bold mb-4">
          Edit Blog
        </h1>
        <p className="text-gray-200 mb-6">
          Update your blog content and preview changes in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <form
            onSubmit={handleUpdate}
            className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4"
          >
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
              Blog Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 p-2 rounded-xl bg-black/50 border border-gray-600 text-white"
              />
            </label>

            <label className="flex flex-col text-gray-200">Content *</label>
            <Editor
              ref={editorRef}
              initialValue={content}
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
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </form>

          {/* Live Preview */}
          <div className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-full rounded-xl object-cover max-h-64"
              />
            ) : imageURL ? (
              <img
                src={imageURL}
                alt="Preview"
                className="w-full rounded-xl object-cover max-h-64"
              />
            ) : null}
            <h3 className="text-white text-xl font-semibold">{title}</h3>
            {category && (
              <span className="text-gray-400 text-sm">{category}</span>
            )}
            <div
              className="prose prose-invert max-w-none text-white"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditBlog;
