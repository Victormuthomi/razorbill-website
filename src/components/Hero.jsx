import { Link } from "react-router-dom";
import pen from "../assets/pen.png";

export default function Hero({ menuOpen }) {
  return (
    <section
      className={`flex flex-col items-center justify-center text-center text-white py-0 px-6 sm:px-8 md:px-12 bg-cover bg-center transition-all duration-300 ${
        menuOpen ? "mt-24" : ""
      }`}
      style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
    >
      <div className="bg-black/50 p-6 rounded-lg max-w-4xl w-full">
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          All Your Sports, Movies & Shows in One Place
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mt-4 mb-6 text-gray-400">
          Stream live matches, ask SportGPT anything about sports, and soon
          enjoy top movies, trending series, sports results and live TV — all
          from Razorbill.
        </p>

        {/* Feature Links */}
        <div className="flex flex-wrap gap-2 justify-center mt-4 mb-8">
          <Link
            to="/matches"
            className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-90 transition"
          >
            Live Sports
          </Link>
          <Link
            to="/sportgpt"
            className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-90 transition"
          >
            SportGPT
          </Link>
          <Link
            to="/results"
            className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-90 transition"
          >
            Results
          </Link>
          <Link
            to="/movies"
            className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-90 transition"
          >
            Movies & Series (Coming Soon)
          </Link>
        </div>

        {/* Pen Image with hover bounce */}
        <img
          src={pen}
          alt="pen"
          className="mt-0 md:mt-10 w-26 md:w-52 mx-auto transition-transform duration-500 hover:animate-bounce"
        />

        {/* CTA Button */}
        <div className="mt-8 md:mt-6">
          <a
            href="/matches"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition duration-200"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
