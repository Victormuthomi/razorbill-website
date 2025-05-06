import pen from "../assets/pen.png";

export default function Hero({ menuOpen }) {
  return (
    <section
      className={`flex flex-col items-center justify-center text-center text-white py-0 px-6 sm:px-8 md:px-12 bg-cover bg-center transition-all duration-300 ${
        menuOpen ? "mt-24" : "" // Apply margin-top when menu is open
      }`}
      style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
    >
      <div className="bg-black/50 p-6 rounded-lg max-w-4xl w-full">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight animate-pulse">
          Watch Live Sports Anywhere
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mt-4 mb-6 text-gray-400">
          Catch your favorite teams live with the smoothest sports streams on
          the planet.
        </p>

        <img
          src={pen} // Use the imported image
          alt="pen" // Description for accessibility
          className="mt-20 w-24 md:w-52 mx-auto animate-bounce duration-5" // Optional styling to ensure responsiveness
        />
        <div className="mt-48 md:mt-28">
          <a
            href="/matches" // Replace with the correct path to your Matches page
            className="bg-white text-black px-8 py-4  rounded-full font-semibold text-lg hover:bg-gray-200 transition duration-200"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
