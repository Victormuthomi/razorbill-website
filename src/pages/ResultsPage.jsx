import React from "react";
import watch from "../assets/watch.jpeg";

const ResultsPage = () => {
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
        <h2 className="text-4xl mb-6 text-yellow-400">Live Matches Results</h2>

        <p className="text-white text-3xl animate-pulse">
          We're still negotiating with the football gods for today’s results...
          ⚽️✨ <br />
          Check back soon — mean while watch live matches using the link below!
        </p>

        <div className="mt-8">
          <a
            href="/matches"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition duration-200"
          >
            Go to Matches
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
