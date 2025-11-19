// src/pages/AuthorProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL } from "../api";
import {
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineArrowLeft,
} from "react-icons/ai";

const AuthorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authorToken");

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/authors/login");
      return;
    }

    const fetchAuthor = async () => {
      try {
        const res = await fetch(`${AUTHOR_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch author");
        const data = await res.json();
        setAuthor(data.author);
      } catch (err) {
        console.error(err);
        alert("Failed to load author profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id, token, navigate]);

  if (loading)
    return (
      <div className="text-white text-center py-10">Loading author...</div>
    );
  if (!author)
    return <div className="text-white text-center py-10">Author not found</div>;

  return (
    <div className="min-h-screen bg-black/80 flex flex-col items-center p-6 md:p-12 text-white">
      <Link
        to="/authors/dashboard"
        className="self-start mb-4 flex items-center gap-2 text-yellow-400 hover:text-yellow-500"
      >
        <AiOutlineArrowLeft /> Back to Dashboard
      </Link>

      <div className="bg-black/60 p-8 rounded-xl border border-gray-700 w-full max-w-md flex flex-col items-center gap-6">
        {author.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={author.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
            {author.name[0].toUpperCase()}
          </div>
        )}

        <h1 className="text-3xl font-bold text-yellow-400">{author.name}</h1>

        <div className="flex flex-col gap-2 text-gray-300">
          <p>
            <span className="font-semibold text-white">Email:</span>{" "}
            {author.email}
          </p>
          <p>
            <span className="font-semibold text-white">Phone:</span>{" "}
            {author.phone}
          </p>
          <p>
            <span className="font-semibold text-white">Joined:</span>{" "}
            {new Date(author.created_at).toLocaleDateString()}
          </p>
        </div>

        {id === localStorage.getItem("authorId") && (
          <Link
            to={`/authors/edit/${id}`}
            className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-xl font-semibold hover:bg-yellow-500 flex items-center gap-2"
          >
            <AiOutlineEdit /> Edit Profile
          </Link>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("authorToken");
            localStorage.removeItem("authorId");
            navigate("/authors/login");
          }}
          className="mt-2 bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 flex items-center gap-2"
        >
          <AiOutlineLogout /> Logout
        </button>
      </div>
    </div>
  );
};

export default AuthorProfile;
