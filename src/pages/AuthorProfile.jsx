// src/pages/AuthorProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL, BLOG_URL } from "../api";
import {
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineArrowLeft,
} from "react-icons/ai";

const AuthorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authorToken");
  const localAuthorId = localStorage.getItem("authorId");

  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const privateView = token && localAuthorId === id;
        setIsPrivate(privateView);

        const endpoint = privateView
          ? `${AUTHOR_URL}/${id}`
          : `${AUTHOR_URL}/public/${id}`;
        const headers = privateView ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(endpoint, { headers });
        if (!res.ok) throw new Error("Failed to fetch author");
        const data = await res.json();
        const authorData = data.author || data;
        setAuthor(authorData);

        // fetch blogs only for public profiles
        if (!privateView) {
          const blogsRes = await fetch(`${BLOG_URL}/author/${id}`);
          if (blogsRes.ok) {
            const blogsData = await blogsRes.json(); // <- endpoint returns array directly
            setBlogs(blogsData); // save directly
          }
        }
      } catch (err) {
        console.error(err);
        if (token) navigate("/authors/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token, localAuthorId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authorToken");
    localStorage.removeItem("authorId");
    navigate("/authors/login");
  };

  if (loading)
    return (
      <div className="text-white text-center py-10">Loading profile...</div>
    );
  if (!author)
    return (
      <div className="text-white text-center py-10">Profile not found</div>
    );

  return (
    <div className="min-h-screen bg-black/80 flex flex-col items-center p-6 md:p-12 text-white">
      <Link
        to={isPrivate ? "/authors/dashboard" : "/"}
        className="self-start mb-4 flex items-center gap-2 text-yellow-400 hover:text-yellow-500"
      >
        <AiOutlineArrowLeft /> {isPrivate ? "Back to Dashboard" : "Back"}
      </Link>

      <div className="bg-black/60 p-8 rounded-xl border border-gray-700 w-full max-w-md flex flex-col items-center gap-6">
        {/* Avatar */}
        {author.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={author.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
            {author.name?.[0]?.toUpperCase() || "A"}
          </div>
        )}

        {/* Name */}
        <h1 className="text-3xl font-bold text-yellow-400">{author.name}</h1>

        {/* Bio */}
        {author.bio && (
          <p className="text-gray-300 text-center">{author.bio}</p>
        )}

        {isPrivate ? (
          <>
            {author.email && (
              <p className="w-full text-left text-gray-300 mt-2">
                <span className="font-semibold text-white">Email:</span>{" "}
                {author.email}
              </p>
            )}
            {author.phone && (
              <p className="w-full text-left text-gray-300">
                <span className="font-semibold text-white">Phone:</span>{" "}
                {author.phone}
              </p>
            )}
            {author.created_at && (
              <p className="w-full text-left text-gray-300">
                <span className="font-semibold text-white">Joined:</span>{" "}
                {new Date(author.created_at).toLocaleDateString()}
              </p>
            )}

            {/* Actions */}
            <div className="w-full flex flex-col gap-2 mt-4">
              <Link
                to={`/authors/edit/${id}`}
                className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-semibold hover:bg-yellow-500 flex items-center justify-center gap-2"
              >
                <AiOutlineEdit /> Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <AiOutlineLogout /> Logout
              </button>
            </div>
          </>
        ) : (
          // Public: show blogs
          <>
            {blogs.length === 0 ? (
              <p className="text-gray-300 mt-4">No blogs yet.</p>
            ) : (
              <div className="w-full mt-6">
                <h2 className="text-xl text-yellow-400 font-semibold mb-4">
                  Blogs by {author.name}
                </h2>
                <div className="flex flex-col gap-4">
                  {blogs.slice(0, 5).map(({ blog }) => (
                    <Link
                      key={blog.id}
                      to={`/blogs/${blog.id}`}
                      className="flex gap-3 items-center bg-black/50 p-3 rounded-xl border border-gray-700 hover:border-yellow-400 transition"
                    >
                      {blog.image_url ? (
                        <img
                          src={blog.image_url}
                          alt={blog.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-300">
                          No Image
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-yellow-400 font-semibold">
                          {blog.title}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {blog.content
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .slice(0, 80)}
                          {blog.content.length > 80 ? "..." : ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {blogs.length > 5 && (
                  <Link
                    to={`/blogs/author/${id}`}
                    className="mt-4 inline-block text-yellow-400 font-semibold hover:underline"
                  >
                    View More Blogs
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
