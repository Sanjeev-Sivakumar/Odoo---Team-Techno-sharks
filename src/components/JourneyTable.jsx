import React, { useState, useEffect } from "react";

function JourneyTable({ tripId }) {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const savedSpots = JSON.parse(localStorage.getItem(`trip_${tripId}_spots`) || "[]");
    setSpots(savedSpots);
  }, [tripId]);

  if (!spots.length) return <p className="text-center py-10">No spots selected yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Place Name</th>
            <th className="border px-4 py-2">Start Time</th>
            <th className="border px-4 py-2">End Time</th>
            <th className="border px-4 py-2">Map</th>
          </tr>
        </thead>
        <tbody>
          {spots.map((spot, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">
                <img
                  src={spot.image_url || "https://via.placeholder.com/100"}
                  alt={spot.spot_name}
                  className="w-24 h-16 object-cover"
                />
              </td>
              <td className="border px-4 py-2">{spot.spot_name}</td>
              <td className="border px-4 py-2">09:00 AM</td>
              <td className="border px-4 py-2">11:00 AM</td>
              <td className="border px-4 py-2">
                <a
                  href={`https://www.google.com/maps?q=${spot.latitude || 11.0168},${spot.longitude || 76.9558}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Map
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JourneyTable;
