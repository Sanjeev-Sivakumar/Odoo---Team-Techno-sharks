import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [userType, setUserType] = useState("User");

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem("trips") || "[]");
    setTrips(savedTrips);
  }, []);

  const promptGTIDAndNavigate = (path) => {
    const gtid = prompt("Please enter your GTID to continue:");
    if (gtid) {
      localStorage.setItem("currentGTID", gtid);
      navigate(path);
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    if (e.target.value === "Admin") navigate("/Admin");
  };

  const suggestedDestinations = [
    { name: "Marudhamalai Temple", desc: "Ancient hill temple with scenic views.", img: "/assets/placeholder.jpg" },
    { name: "VOC Park & Zoo", desc: "Popular zoo and recreational park.", img: "/assets/placeholder.jpg" },
    { name: "Dhyanalinga", desc: "Meditative temple attracting spiritual visitors.", img: "/assets/placeholder.jpg" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white pt-24"
      style={{ backgroundImage: "url('/assets/trip.jpg')" }}
    >
      {/* Navbar */}
      <div className="flex flex-col justify-center items-center sm:items-start absolute top-0 left-0 w-full h-32 bg-white/50 backdrop-blur-md px-6">
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-semibold text-blue-700 text-center sm:text-left">
              GlobeTrotter
            </h1>
            <p className="text-2xl font-light text-blue-600 mt-2 text-center sm:text-left">
              Discover your next adventure with us
            </p>
          </div>

          {/* User/Admin Dropdown - Positioned to the right */}
          <div>
            <select
              value={userType}
              onChange={handleUserTypeChange}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-36">
        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
          <button
            onClick={() => promptGTIDAndNavigate("/plan-trip")}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ease-in-out transform hover:scale-105"
          >
            Plan New Trip
          </button>
          <button
            onClick={() => promptGTIDAndNavigate("/trip-history")}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ease-in-out transform hover:scale-105"
          >
            Trip History
          </button>
          <button
            onClick={() => navigate("/city-search")}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ease-in-out transform hover:scale-105"
          >
            City Search
          </button>
          <button
            onClick={() => navigate("/activity-search")}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ease-in-out transform hover:scale-105"
          >
            Activity Search
          </button>
        </div>

        {/* Recent Trips */}
        <div className="mb-16">
          <h2 className="text-5xl font-semibold mb-8 text-center text-blue-700">Your Recent Trips</h2>
          {trips.length === 0 ? (
            <div className="text-center py-16 bg-white/70 p-8 rounded-lg shadow-xl">
              <p className="text-xl mb-4 text-blue-700">No trips planned yet!</p>
              <button
                onClick={() => promptGTIDAndNavigate("/plan-trip")}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ease-in-out"
              >
                Plan a New Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => promptGTIDAndNavigate("/trip-history")}
                  className="cursor-pointer border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white/80"
                >
                  <img
                    src={trip.coverPhoto || "/assets/placeholder.jpg"}
                    alt={trip.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-blue-700">{trip.name}</h3>
                    <p className="text-gray-700 text-sm mb-2">{trip.startDate} - {trip.endDate}</p>
                    <p className="text-gray-700 text-sm mb-4">{trip.spots?.length || 0} Destinations</p>
                    <div className="flex flex-wrap gap-2">
                      {trip.spots?.map((spot, idx) => (
                        <div
                          key={idx}
                          className="border rounded-full px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 transition-all"
                        >
                          {spot.spot_name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested Destinations */}
        <div className="mb-16">
          <h2 className="text-5xl font-semibold mb-8 text-center text-blue-700">Suggested Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedDestinations.map((dest, idx) => (
              <div
                key={idx}
                onClick={() => promptGTIDAndNavigate("/plan-trip")}
                className="border rounded-xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white/80"
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-blue-700">{dest.name}</h3>
                <p className="text-gray-700 text-sm mb-4">{dest.desc}</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ease-in-out">
                  Plan a Trip
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
