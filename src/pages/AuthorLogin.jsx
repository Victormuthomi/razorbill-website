// src/pages/AuthorLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL } from "../api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const AuthorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect if already logged in and token + authorId exist
  useEffect(() => {
    const token = localStorage.getItem("authorToken");
    const authorId = localStorage.getItem("authorId");
    if (token && authorId) navigate("/authors/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${AUTHOR_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store token & authorId
      localStorage.setItem("authorToken", data.token);
      localStorage.setItem("authorId", data.authorId);

      // ✅ Redirect to dashboard
      navigate("/authors/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          Welcome Back
        </h1>
        <p className="text-gray-200 text-lg">
          Log in to continue sharing your stories and connect with your readers.
        </p>
      </div>

      <div className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Author Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-200">
          Not registered yet?{" "}
          <Link
            to="/authors/register"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorLogin;
