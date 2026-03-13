import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL, BLOG_URL } from "../api";
import {
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
} from "react-icons/ai";
import { Terminal, Database, Rocket, ShieldAlert } from "lucide-react"; // Icons for types

import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "draft-js/dist/Draft.css";

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

// Senior Logic: Content Types
const contentTypes = [
  { id: "blog", label: "Standard Log", icon: <Rocket size={14} /> },
  {
    id: "tdd",
    label: "Technical Blueprint (TDD)",
    icon: <Terminal size={14} />,
  },
  {
    id: "case study",
    label: "Impact Analysis (Case Study)",
    icon: <Database size={14} />,
  },
];

const NewBlog = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("blog"); // NEW FIELD
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Dynamic fields based on type
  const [techStack, setTechStack] = useState(""); // For TDD
  const [impactMetric, setImpactMetric] = useState(""); // For Case Study

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  // Handle Editor with Senior Formatting
  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawContent = convertToRaw(state.getCurrentContent());
    // We use a specific wrapper to ensure Draft.js blocks are treated as paragraphs
    const html = draftToHtml(rawContent);
    setContent(html);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        // Your Cloudinary Logic...
      }

      // We package the extra fields into the body
      const body = {
        title,
        content,
        category,
        type, // Crucial for your new architecture
        image_url: uploadedImageUrl,
        metadata: {
          tech_stack: techStack,
          impact: impactMetric,
        },
      };

      const res = await fetch(BLOG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to publish");

      navigate("/authors/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-sans flex flex-col md:flex-row">
      {/* Sidebar - Kept as per your design but darkened for Alcodist aesthetic */}
      <aside className="bg-black border-r border-white/5 p-8 md:w-72">
        <div className="mb-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black mb-4">
            <Terminal size={20} />
          </div>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600">
            Alcodist_Registry
          </h2>
        </div>
        <nav className="flex flex-col gap-2">
          {contentTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${
                type === t.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "hover:bg-white/5 text-gray-500"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-16 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
            Initialize_New_Record
          </h1>
          <p className="text-xs font-mono text-blue-500 italic uppercase tracking-widest">
            Type: {type} // Node: Meru_Central
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Editor Column */}
          <form onSubmit={handlePublish} className="lg:col-span-7 space-y-8">
            <section className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-gray-600">
                    Entry_Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                    placeholder="Architecture of MO-jobs..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-gray-600">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Fields for TDD / Case Study */}
              {type === "tdd" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-mono uppercase text-blue-500 mb-2 block">
                    System_Stack (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 outline-none"
                    placeholder="NestJS, PostgreSQL, Docker..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-gray-600">
                  Content_Payload
                </label>
                <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
                  {/* Custom Toolbar */}
                  <div className="flex gap-1 p-2 border-b border-white/5 bg-white/[0.02] flex-wrap">
                    {["BOLD", "ITALIC", "UNDERLINE"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setEditorState(
                            RichUtils.toggleInlineStyle(editorState, s)
                          )
                        }
                        className="p-2 hover:bg-white/10 rounded text-[10px] font-mono"
                      >
                        {s[0]}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 min-h-[400px] text-white prose prose-invert">
                    <Editor
                      editorState={editorState}
                      onChange={handleEditorChange}
                      placeholder="Enter technical details..."
                    />
                  </div>
                </div>
              </div>
            </section>

            <button
              disabled={loading}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5"
            >
              {loading ? "SYNCHRONIZING..." : "EXECUTE_PUBLISH"}
            </button>
          </form>

          {/* Senior Preview Column */}
          <aside className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <h2 className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <AiOutlineEye /> Live_Node_Preview
              </h2>
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    className="w-full h-48 object-cover rounded-2xl mb-8 opacity-50"
                    alt="p"
                  />
                )}

                <div className="space-y-4">
                  <span className="text-[9px] font-mono text-blue-500 border border-blue-500/30 px-2 py-1 rounded">
                    {type.toUpperCase()}
                  </span>
                  <h3 className="text-3xl font-bold text-white tracking-tighter leading-none">
                    {title || "UNTITLED_LOG"}
                  </h3>

                  {/* This part fixes your STACKING issue */}
                  <div
                    className="prose prose-invert prose-sm max-w-none 
                            prose-p:text-gray-500 prose-p:leading-relaxed prose-p:mb-6
                            prose-headings:text-white prose-headings:mb-4 prose-headings:mt-8
                            [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NewBlog;
