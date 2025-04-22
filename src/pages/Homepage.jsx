// src/pages/HomePage.jsx
import razor from "../assets/razor.jpeg";
import Hero from "../components/Hero";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${razor})` }}
    >
      <div className="backdrop-brightness-50 min-h-screen flex flex-col">
        <div className="flex-grow">
          <Hero />
        </div>
      </div>
    </div>
  );
}
