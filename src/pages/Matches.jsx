import React, { useMemo } from "react";
import LiveMatches from "../components/LiveMatches";
import TodaysMatches from "../components/TodaysMatches";
import Results from "../components/Results";
import razor from "../assets/razor.jpeg";

export default function MatchesPage() {
  // Memoize style object to prevent recreation on every render
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${razor})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }),
    [],
  );

  return (
    <div className="bg-cover bg-center py-6" style={backgroundStyle}>
      <div className="text-center py-6">
        <h1 className="font-playfair text-4xl text-white mt-6">Matches Page</h1>
        <p className="font-lora text-gray-300 text-lg mt-2">
          Catch live, upcoming, and today's match results!
        </p>
      </div>

      {/* Child Sections */}
      <LiveMatches />
      <TodaysMatches />
      <Results />
    </div>
  );
}
