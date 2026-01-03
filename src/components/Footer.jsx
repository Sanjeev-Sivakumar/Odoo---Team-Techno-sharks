import React from "react";
import { FaHome, FaMapMarkedAlt, FaHistory, FaUser } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-white shadow-inner mt-20">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-6 mb-4 md:mb-0">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition gap-2">
            <FaHome /> Home
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition gap-2">
            <FaMapMarkedAlt /> Destinations
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition gap-2">
            <FaHistory /> Trips
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition gap-2">
            <FaUser /> Profile
          </button>
        </div>
        <div className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Globetrotter. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
