import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import spotsCSV from "../assets/tourist_spots.csv";

function PlanTripForm({ tripId }) {
  const [spots, setSpots] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredSpots, setFilteredSpots] = useState([]);

  // Load CSV
  useEffect(() => {
    Papa.parse(spotsCSV, {
      header: true,
      download: true,
      complete: function (results) {
        const data = results.data;
        setSpots(data);

        // Extract unique districts
        const uniqueDistricts = [...new Set(data.map((s) => s.district))].sort();
        setDistricts(uniqueDistricts);
      },
    });
  }, []);

  // Filter spots by selected district
  useEffect(() => {
    if (selectedDistrict) {
      setFilteredSpots(spots.filter((s) => s.district === selectedDistrict));
    } else {
      setFilteredSpots([]);
    }
  }, [selectedDistrict, spots]);

  const toggleSpot = (spot) => {
    if (selectedSpots.find((s) => s.id === spot.id)) {
      setSelectedSpots(selectedSpots.filter((s) => s.id !== spot.id));
    } else {
      setSelectedSpots([...selectedSpots, spot]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white text-black">
      <h2 className="text-3xl font-bold mb-8">Select Destinations</h2>

      {/* District Selector */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Select District</label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full md:w-1/3"
        >
          <option value="">-- Select District --</option>
          {districts.map((d, idx) => (
            <option key={idx} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Spots Grid */}
      {selectedDistrict && filteredSpots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSpots.map((spot, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer ${
                selectedSpots.find((s) => s.id === spot.id)
                  ? "ring-4 ring-blue-500"
                  : ""
              }`}
              onClick={() => toggleSpot(spot)}
            >
              <img
                src={spot.image_url || "https://via.placeholder.com/400x200"}
                alt={spot.spot_name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{spot.spot_name}</h3>
                <p className="text-gray-600">{spot.best_time_to_visit}</p>
              </div>
            </div>
          ))}
        </div>
      ) : selectedDistrict ? (
        <p className="text-center py-10">No spots found for this district.</p>
      ) : (
        <p className="text-center py-10">Please select a district first.</p>
      )}

      {/* Save Button */}
      <button
        onClick={() => {
          localStorage.setItem(
            `trip_${tripId}_spots`,
            JSON.stringify(selectedSpots)
          );
          alert("Spots added to your trip!");
        }}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Save Selected Spots
      </button>

      {/* Selected Spots List */}
      {selectedSpots.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Selected Spots</h3>
          <ul className="list-disc pl-5">
            {selectedSpots.map((s) => (
              <li key={s.id}>
                {s.spot_name} ({s.district})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PlanTripForm;
