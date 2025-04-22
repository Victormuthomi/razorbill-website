// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import razor from "../assets/razor.jpeg"; // your background image
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${razor})` }}
    >
      <div className="backdrop-brightness-50 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Outlet /> {/* This renders the nested route component */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
