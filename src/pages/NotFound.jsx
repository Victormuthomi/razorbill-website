import pen from "../assets/pen.png"; // your custom image

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-white px-6 py-12">
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>

      <img src={pen} alt="Page not found" className="w-64 md:w-86 mb-6" />

      <p className="mb-6 text-lg">
        The page you're looking for doesn’t exist or might be under
        construction. Check Later
      </p>

      <a
        href="/"
        className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
