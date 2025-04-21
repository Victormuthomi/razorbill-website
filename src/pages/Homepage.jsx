// src/pages/HomePage.jsx
import razor from "../assets/razor.jpeg";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${razor})` }}
    >
      <div className="backdrop-brightness-50 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Hero />
        </div>
        <Footer />
      </div>
    </div>
  );
}
