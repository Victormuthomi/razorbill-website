import React from "react";
import watch from "../assets/watch.jpeg";

const Results = () => {
  return (
    <div
      className="my-6 py-12"
      style={{
        backgroundImage: `url(${watch})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "calc(100vh - 200px)",
      }}
    >
      <div className="text-center text-white">
        <h2 className="text-3xl mb-6 text-yellow-400">Live Matches Results</h2>

        <p className="text-white text-lg mb-4 animate-pulse">
          Oops! The scores are still warming up! We’re working hard to get those
          live results for you. Stay tuned! ⚽️⌛
        </p>

        <div className="mt-8">
          <a
            href="/results"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition duration-200"
          >
            View Full Results
          </a>
        </div>
      </div>
    </div>
  );
};

export default Results;
