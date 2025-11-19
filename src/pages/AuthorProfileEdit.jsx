// src/pages/AuthorProfileEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AUTHOR_URL } from "../api";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineDelete,
} from "react-icons/ai";

const AuthorProfileEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const storedId = localStorage.getItem("authorId");
  const authorId = params.id || storedId;
  const token = localStorage.getItem("authorToken");

  const [author, setAuthor] = useState({ name: "", email: "", phone: "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countryCode, setCountryCode] = useState("+254");

  // Fetch author details
  const fetchAuthor = async () => {
    if (!authorId || !token) {
      setError("Missing author information. Please login again.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch author data.");
      const data = await res.json();
      const a = data.author || data;

      // Split phone into country code + number if possible
      if (a.phone?.startsWith("+")) {
        const code = a.phone.slice(0, a.phone.length - 9);
        const number = a.phone.slice(-9);
        setCountryCode(code);
        setAuthor({
          name: a.name || "",
          email: a.email || "",
          phone: number || "",
        });
      } else {
        setAuthor({
          name: a.name || "",
          email: a.email || "",
          phone: a.phone || "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [authorId, token]);

  const isStrongPassword = (pwd) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && !isStrongPassword(password)) {
      setError("Password too weak. Example: StrongPass123!");
      return;
    }

    setLoading(true);
    try {
      const body = {
        name: author.name,
        email: author.email,
        phone: countryCode + author.phone,
      };
      if (password) body.password = password;

      const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Update failed");
      } else {
        setSuccess("Profile updated successfully!");
        setTimeout(() => navigate("/authors/dashboard"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      setLoading(true);
      const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      localStorage.removeItem("authorToken");
      localStorage.removeItem("authorId");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          Edit Profile
        </h1>
        <p className="text-gray-200 text-lg">
          Update your details to keep your profile current.
        </p>
      </div>

      <div className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Default Avatar */}
          <div className="flex justify-center mb-4">
            <img
              src="/default-avatar.png"
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border border-gray-500"
            />
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={author.name}
            onChange={(e) =>
              setAuthor((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={author.email}
            onChange={(e) =>
              setAuthor((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Phone */}
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="+254">+254 (Kenya)</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={author.phone}
              onChange={(e) =>
                setAuthor((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="flex-1 px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              pattern="\d{9}"
              title="Enter 9 digits"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-xl hover:bg-yellow-500 transition"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <AiOutlineDelete /> Delete Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthorProfileEdit;
