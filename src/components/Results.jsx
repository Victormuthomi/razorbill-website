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
        <h2 className="font-playfair text-3xl mb-6 text-yellow-400">
          Live Matches Results
        </h2>

        <p className="font-lora text-white text-lg mb-4`">
          Oops! The scores are still warming up! We’re working hard to get those
          live results for you. Stay tuned! ⚽️⌛
        </p>

        <div className="mt-8">
          <a
            href="/results"
            className="px-8 py-4 font-inter rounded-full bg-white/10 hover:bg-white hover:text-black focus:bg-white focus:text-black text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            View Full Results
          </a>
        </div>
      </div>
    </div>
  );
};

export default Results;
