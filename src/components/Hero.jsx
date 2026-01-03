import React from "react";

function Hero() {
  const handlePlanTrip = () => {
    const gtid = prompt("Enter your GTID:");
    if (gtid) {
      window.location.href = "/plan-trip";
    }
  };

  const handleTripHistory = () => {
    const gtid = prompt("Enter your GTID:");
    if (gtid) {
      window.location.href = "/"; 
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: `url(${require("../assets/trip.jpg")})`,
        filter: "brightness(0.6)",
      }}
    >
      <div className="text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-4">Globetrotter</h1>
        <p className="text-xl italic mb-10">
          Explore the world, one journey at a time
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={handlePlanTrip}
            className="px-8 py-4 bg-blue-600 rounded-full text-white text-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            Plan New Trip
          </button>
          <button
            onClick={handleTripHistory}
            className="px-8 py-4 bg-gray-600 rounded-full text-white text-lg hover:bg-gray-700 transition transform hover:scale-105"
          >
            Trip History
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
