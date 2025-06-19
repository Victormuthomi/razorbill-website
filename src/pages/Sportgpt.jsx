import { Link } from "react-router-dom";
import bill2 from "../assets/bill2.png"; // use a relevant image if available

export default function Landing() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center text-white py-0 px-6 sm:px-8 md:px-12 transition-all duration-300"
      style={{ background: "transparent" }}
    >
      <div className="bg-transparent p-6 mt-6 rounded-lg max-w-4xl w-full relative">
        {/* Title and Subtitle */}
        <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          Ask Anything About Sports
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mt-4 mb-6 text-gray-400">
          From player stats to game rules — get fast, intelligent answers
          powered by AI.
        </p>

        {/* Optional Sport Image */}
        <img src={bill2} alt="sport" className="mt-6 w-36 md:w-62 mx-auto" />
      </div>

      {/* Button Section */}
      <div className="mt-32 md:mt-16">
        <Link to="/chat">
          <button className="bg-white text-black mt-0 md:mt-8 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-400 transition duration-200">
            Ask SportGPT
          </button>
        </Link>
      </div>
    </section>
  );
}
