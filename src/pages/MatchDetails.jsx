import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MatchDetails = () => {
  const { matchId } = useParams(); // Extract matchId from the URL
  const [matchData, setMatchData] = useState(null);
  const [streamDetails, setStreamDetails] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);

  // Fetching match details when the component mounts
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await fetch(
          `https://streamed.su/api/matches/${matchId}`,
        );
        const data = await response.json();

        if (data) {
          setMatchData(data); // Set match data
        } else {
          throw new Error("No match data found.");
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
        setMatchData(null);
      }
    };

    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]); // Dependency on matchId

  // Fetching stream data when a stream is selected
  useEffect(() => {
    if (selectedStream) {
      const fetchStreamDetails = async (streamId) => {
        try {
          const response = await fetch(`/api/stream/${streamId}/${matchId}`);
          const data = await response.json();

          if (data && data.embedUrl) {
            setStreamDetails(data); // Set stream details
          } else {
            throw new Error("Stream details not available.");
          }
        } catch (error) {
          console.error("Error fetching stream details:", error);
          setStreamDetails(null);
        }
      };

      fetchStreamDetails(selectedStream); // Trigger the fetch when a stream is selected
    }
  }, [selectedStream, matchId]); // Dependency on selectedStream and matchId

  if (!matchData) {
    return (
      <div className="text-white text-center py-10">
        Loading match details...
      </div>
    ); // Show loading until match data is fetched
  }

  // Safely accessing matchData.teams to avoid errors
  const homeTeam = matchData.teams ? matchData.teams.home : null;
  const awayTeam = matchData.teams ? matchData.teams.away : null;

  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      {/* Match Header */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-white mb-8">
        {homeTeam && awayTeam
          ? `${homeTeam.name} vs ${awayTeam.name}`
          : "Loading teams..."}
      </h2>

      {/* Match Details */}
      <div className="text-white mb-8">
        <p>Date: {new Date(matchData.date).toLocaleString()}</p>
        <p>Location: {matchData.location || "Unknown Location"}</p>
      </div>

      {/* Display Available Streams */}
      <h3 className="text-xl text-white mb-4">Available Streams</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {matchData.sources && matchData.sources.length > 0 ? (
          matchData.sources.map((stream) => (
            <div
              key={stream.id}
              className="text-white text-center py-4 px-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
              onClick={() => setSelectedStream(stream.id)} // Handle stream selection
            >
              <h3 className="font-semibold">{stream.source}</h3>
              <p>{stream.language}</p>
              <p>{stream.hd ? "HD" : "SD"}</p>
            </div>
          ))
        ) : (
          <p className="text-white">No available streams at the moment.</p>
        )}
      </div>

      {/* Show the selected stream details */}
      {streamDetails ? (
        <div className="text-center">
          <h3 className="text-2xl text-white mb-4">
            Streaming from: {streamDetails.source}
          </h3>
          <iframe
            title="Match Stream"
            src={streamDetails.embedUrl} // Using the embed URL from the API response
            width="100%"
            height="600"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p className="text-center text-white">
          Select a stream to watch the match.
        </p>
      )}
    </div>
  );
};

export default MatchDetails;
