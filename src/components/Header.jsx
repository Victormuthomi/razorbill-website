import { useState } from "react";

export default function Header() {
  // State to toggle the menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 bg-black/60 text-white shadow-lg">
      <div className="flex items-center">
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Razorbill Logo"
            className="h-10 w-auto mr-2"
          />{" "}
          {/* Logo image */}
          <h1 className="text-2xl font-bold tracking-wide">Razorbill</h1>{" "}
          {/* Logo text */}
        </a>
      </div>

      {/* Desktop Menu */}
      <nav className="space-x-6 hidden md:flex">
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Home
        </a>
        <a
          href="https://example.com/matches"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Matches
        </a>
        <a
          href="https://example.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          About
        </a>
      </nav>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-0 w-full bg-black/80 text-white p-4 md:hidden">
          <nav className="flex flex-row items-center justify-center space-x-6">
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Home
            </a>
            <a
              href="https://example.com/matches"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Matches
            </a>
            <a
              href="https://example.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              About
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
