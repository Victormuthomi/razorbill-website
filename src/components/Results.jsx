import React from "react";
import watch from "../assets/watch.jpeg"; // Adjust the path to the image

// Define the Results component
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
        height: "100vh", // Ensure full height of the section
      }}
    >
      <div className="text-center text-white">
        <h2 className="text-3xl mb-6">Results</h2>
        <p className="text-lg">This feature will be available soon!</p>
      </div>
    </div>
  );
};

export default Results;
