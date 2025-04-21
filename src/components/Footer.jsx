import { FaFacebookF, FaInstagram } from "react-icons/fa"; // For Facebook and Instagram icons
import { FaXTwitter } from "react-icons/fa6"; // For X (Twitter) icon

export default function Footer() {
  return (
    <footer className="text-center text-white py-6 bg-black/60 mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        {/* Copyright */}
        <p>&copy; {new Date().getFullYear()} Razorbill. All rights reserved.</p>

        {/* Disclaimer */}
        <p className="text-sm mt-2">
          Disclaimer: This site does not store any files on its server. All
          contents are provided by non-affiliated third parties.
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-4">
          {/* X (Twitter) Icon */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaXTwitter size={24} />
          </a>
          {/* Facebook Icon */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaFacebookF size={24} />
          </a>
          {/* Instagram Icon */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
