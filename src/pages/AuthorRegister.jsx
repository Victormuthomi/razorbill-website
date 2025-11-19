// src/pages/AuthorRegister.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL } from "../api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const countryCodes = [
  { code: "+254", name: "Kenya" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+91", name: "India" },
];

const AuthorRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+254");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return (
      pwd.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial
    );
  };

  const validatePhone = (num) => /^\d{9}$/.test(num);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setPhoneError("");

    if (!validatePassword(password)) {
      setPasswordError(
        "Weak password! Must be at least 8 characters, include uppercase, lowercase, number, and special character. Example: StrongP@ss1",
      );
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setPhoneError("Phone number must be exactly 9 digits, e.g., 712345678");
      return;
    }

    const fullPhone = `${countryCode}${phoneNumber}`;

    setLoading(true);

    try {
      const res = await fetch(`${AUTHOR_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: fullPhone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        navigate("/authors/login");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          Become a Storyteller
        </h1>
        <p className="text-gray-200 text-lg">
          Share your stories, experiences, and insights with the world. Join our
          community of authors and start blogging today!
        </p>
      </div>

      <div className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Author Register
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {passwordError && (
          <p className="text-red-400 text-sm mb-2">{passwordError}</p>
        )}
        {phoneError && (
          <p className="text-red-400 text-sm mb-2">{phoneError}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Phone with country code */}
          <div className="flex space-x-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl bg-gray-800/90 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-200">
          Already registered?{" "}
          <Link
            to="/authors/login"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorRegister;
