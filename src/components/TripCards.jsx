// src/components/TripCards.jsx
import React, { useState } from "react";
import TripHistory from "../pages/TripHistory";
import placeholder from "../assets/placeholder.jpg";

export default function TripCards({ trips, onDeleteTrip }) {
  const [selectedTripId, setSelectedTripId] = useState(null);

  const handleViewTrip = (tripId) => {
    setSelectedTripId(tripId);
  };

  const handleClose = () => {
    setSelectedTripId(null);
  };

  const handleDelete = (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      if (onDeleteTrip) onDeleteTrip(tripId);
    }
  };

  if (!trips || trips.length === 0) return (
    <div className="text-center py-10 text-white">
      <p className="text-xl mb-4">No trips planned yet!</p>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer"
          >
            <img
              src={trip.coverPhoto || placeholder}
              alt={trip.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{trip.name}</h3>
              <p className="text-gray-300 mb-1">
                {trip.startDate} - {trip.endDate}
              </p>
              <p className="text-gray-400 mb-2">
                Destinations: {trip.spots?.length || 0}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleViewTrip(trip.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="flex-1 px-4 py-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTripId && (
        <TripHistory tripId={selectedTripId} onClose={handleClose} />
      )}
    </>
  );
}
