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
        <h2 className=" font-playfair text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          All Your Sports, Movies & Shows in One Place
        </h2>

        {/* Subtitle */}
        <p className="font-lora text-lg sm:text-xl md:text-2xl max-w-3xl mt-4 mb-6 text-gray-400">
          Stream live matches, ask SportGPT anything about sports, and enjoy top
          movies, trending series, sports results and live TV — all from
          Razorbill.
        </p>

        {/* Feature Links */}
        <div className="flex flex-wrap gap-2 justify-center mt-4 mb-8">
          <Link
            to="/matches"
            className="font-inter  px-3 py-1 inline-block rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Live Sports
          </Link>
          <Link
            to="/sportgpt"
            className="font-inter  px-3 py-1 inline-block rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            SportGPT
          </Link>
          <Link
            to="/results"
            className="font-inter  px-3 py-1 inline-block rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Results
          </Link>
          <Link
            to="/movies"
            className="font-inter  px-3 py-1 inline-block rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Movies & Series
          </Link>
        </div>

        {/* Pen Image with hover bounce */}
        <img
          src={pen}
          alt="pen"
          className="mt-0 md:mt-10 w-26 md:w-52 mx-auto transition-transform duration-500 animate-bounce hover:animate-none"
        />

        {/* CTA Button */}
        <div className="mt-8 md:mt-6">
          <a
            href="/matches"
            className="px-6 py-3 rounded-full bg-white text-black hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/15"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
