import React from "react";
import LiveMatches from "../components/LiveMatches";
import TodaysMatches from "../components/TodaysMatches";
import Results from "../components/Results";

// Importing images as React components
import razor from "../assets/razor.jpeg"; // Adjust the path

export default function MatchesPage() {
  return (
    <div
      className="bg-cover bg-center py-6"
      style={{
        backgroundImage: `url(${razor})`,
        backgroundSize: "cover", // Ensures the image covers the entire background
        backgroundPosition: "center", // Keeps the image centered
        backgroundAttachment: "fixed", // Keeps the background fixed while scrolling
      }}
    >
      {/* Section for the image at the top before the matches */}
      <div className="text-center py-6">
        <h1 className="text-4xl text-white mt-6">Matches Page</h1>
        <p className="text-white text-lg mt-2">
          Catch live, upcoming, and today's match results!
        </p>
      </div>

      {/* Live Matches */}
      <LiveMatches />
      {/* Today's Matches */}
      <TodaysMatches />
      {/* Match Results */}
      <Results />
    </div>
  );
}
