export default function Hero({ menuOpen }) {
  return (
    <section
      className={`flex flex-col items-center justify-center text-center text-white py-0 px-6 sm:px-8 md:px-12 bg-cover bg-center transition-all duration-300 ${
        menuOpen ? "mt-24" : "" // Apply margin-top when menu is open
      }`}
      style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
    >
      <div className="bg-black/50 p-6 rounded-lg max-w-4xl w-full">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          Watch Live Football Anywhere
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mt-4 mb-6">
          Catch your favorite teams live with the smoothest football streams on
          the planet.
        </p>
        <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition duration-200">
          Get Started
        </button>
      </div>
    </section>
  );
}
