import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import placeholder from "../assets/placeholder.jpg";

function SuggestedDestinations() {
  const [spots, setSpots] = useState([]);
  const [district, setDistrict] = useState("Coimbatore");

  useEffect(() => {
    fetch(require("../assets/tourist_spots.csv"))
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setSpots(results.data);
          },
        });
      });
  }, []);

  const filteredSpots = spots.filter((spot) => spot.district === district);

  return (
    <div>
      <div className="mb-6">
        <label className="mr-2 font-semibold">Select District:</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {Array.from(new Set(spots.map((s) => s.district))).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredSpots.map((spot) => (
          <div
            key={spot.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transform hover:scale-105 transition cursor-pointer"
          >
            <img
              src={spot.image_url || placeholder}
              alt={spot.spot_name}
              className="w-full h-40 object-cover"
              onError={(e) => (e.target.src = placeholder)}
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{spot.spot_name}</h3>
              <p className="text-sm mb-4">{spot.description}</p>
              <button
                onClick={() =>
                  alert(`Planning trip to ${spot.spot_name} in ${district}`)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Plan Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedDestinations;
