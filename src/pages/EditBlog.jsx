// ... existing imports
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

// Senior Logic: Match these exactly with your DB enum/strings
const contentTypes = ["blog", "tdd", "case study"];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Add Type State
  const [type, setType] = useState("blog");
  const [title, setTitle] = useState("");
  // ... rest of your states
  const [content, setContent] = useState("");

  // ... fetch author useEffect

  // 2. Fetch blog data (Updated to sync type)
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${BLOG_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        const b = data.blog;

        setTitle(b.title);
        setCategory(b.category);
        setType(b.type || "blog"); // Sync the type from DB
        setImageURL(b.image_url || "");
        setContent(b.content || "");

        if (b.content) {
          const blocksFromHtml = htmlToDraft(b.content);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (err) {
        console.error(err);
        navigate("/authors/dashboard");
      }
    };
    fetchBlog();
  }, [id, token, navigate]);

  // 3. Update blog (Updated payload)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageURL = imageURL;
      if (imageFile) finalImageURL = await uploadToCloudinary(imageFile);

      // Payload now includes the type
      const payload = {
        title,
        content,
        category,
        type,
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

      if (!res.ok) throw new Error("Failed to update blog");
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/80 flex flex-col md:flex-row">
      {/* 4. Surgical CSS Injector (Fixes the stacking issue immediately) */}
      <style>{`
        .blog-content-preview p { margin-bottom: 1.25rem !important; display: block !important; }
        .blog-content-preview h1, .blog-content-preview h2 { margin-top: 1.5rem; margin-bottom: 0.75rem; color: #fbbf24; }
      `}</style>

      {/* Sidebar ... existing code */}

      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-4xl font-playfair text-yellow-400 font-bold mb-4">
          Edit {type.toUpperCase()}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form
            onSubmit={handleUpdate}
            className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4"
          >
            {/* 5. Content Type Selector */}
            <label className="flex flex-col text-gray-200">
              Content Type
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 p-2 rounded-xl bg-black/50 border border-gray-600 text-white font-mono text-xs uppercase"
              >
                {contentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

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

            {/* ... Category, Image, Toolbar code */}

            <div className="border border-gray-600 rounded-xl bg-black/50 min-h-[300px] p-2 text-white">
              <Editor
                editorState={editorState}
                onChange={handleEditorChange}
                placeholder="Edit your content..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 uppercase tracking-widest"
            >
              {loading ? "Saving Changes..." : "Sync to Production"}
            </button>
          </form>

          {/* Live Preview */}
          <div className="bg-black/60 p-6 rounded-xl border border-gray-700 flex flex-col gap-4">
            <h2 className="text-gray-500 font-mono text-xs uppercase tracking-tighter italic">
              Live_Node_Preview // {type}
            </h2>
            {/* ... Image Preview */}
            <h3 className="text-white text-2xl font-bold leading-tight">
              {title}
            </h3>

            {/* This class "blog-content-preview" is targeted by the <style> tag above */}
            <div
              className="blog-content-preview prose prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
