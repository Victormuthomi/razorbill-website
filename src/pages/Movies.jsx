import bill from "../assets/bill.png"; // Keep the pen image

export default function Movies() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center text-white py-0 px-6 sm:px-8 md:px-12 transition-all duration-300"
      style={{
        background: "transparent", // Set the page background to transparent
      }}
    >
      <div className="bg-transparent p-6 rounded-lg max-w-4xl w-full relative">
        {/* Title and Subtitle */}
        <h2 className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight animate">
          Movies, Series & Shows Coming Soon
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mt-4 mb-6 text-gray-400">
          You'll soon be able to enjoy thrilling movies, trending series, and
          live TV all in one place.
        </p>

        {/* Pen Image */}
        <img
          src={bill}
          alt="bill"
          className="mt-0 w-36 md:w-62 mx-auto animate duration-1"
        />
      </div>

      {/* Button Section */}
      <div className="mt-14 md:mt-16">
        <button
          disabled
          className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg cursor-not-allowed hover:bg-white/10 transition duration-200"
        >
          Coming Soon
        </button>
      </div>
    </section>
  );
}
