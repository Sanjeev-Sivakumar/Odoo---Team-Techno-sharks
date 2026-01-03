import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import spotsCSV from "../assets/tourist_spots.csv"; // your CSV file

export default function CitySearch() {
  const [allCities, setAllCities] = useState([]); // All cities from CSV
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [addedCities, setAddedCities] = useState([]);

  // Load CSV and extract unique cities
  useEffect(() => {
    Papa.parse(spotsCSV, {
      download: true,
      header: true,
      complete: function (results) {
        const data = results.data;

        // Map CSV to city objects
        const citiesFromCSV = data.map((spot) => ({
          name: spot.city || spot.spot_name, // fallback to spot name
          district: spot.district || "Unknown",
          country: spot.country || "Unknown",
          popularity: spot.popularity || Math.floor(Math.random() * 100),
          costIndex: spot.costIndex || Math.floor(Math.random() * 100),
        }));

        // Remove duplicates by city name
        const uniqueCities = Array.from(
          new Map(citiesFromCSV.map((c) => [c.name, c])).values()
        );

        setAllCities(uniqueCities);
      },
    });
  }, []);

  // Filter cities based on search and country
  const filteredCities = allCities.filter((city) => {
    const matchesSearch = city.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === "All" || city.country?.toLowerCase() === countryFilter.toLowerCase();
    return matchesSearch && matchesCountry;
  });

  const handleAddCity = (city) => {
    if (addedCities.find((c) => c.name === city.name)) {
      alert(`${city.name} is already added to your trip.`);
      return;
    }
    setAddedCities([...addedCities, city]);
    alert(`${city.name} added to your trip.`);
  };

  const handleRemoveCity = (city) => {
    setAddedCities(addedCities.filter((c) => c.name !== city.name));
  };

  // Extract unique countries for filter dropdown
  const countryOptions = ["All", ...new Set(allCities.map((c) => c.country))];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 text-black bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">City Search</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/3"
        />

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/4"
        >
          {countryOptions.map((c, idx) => (
            <option key={idx} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* City List */}
      {filteredCities.length === 0 ? (
        <p className="text-center py-10">No cities found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{city.name}</h3>
                <p className="text-gray-700">
                  District: {city.district}, Country: {city.country}
                </p>
                <p className="text-gray-700">Popularity: {city.popularity}</p>
                <p className="text-gray-700">Cost Index: {city.costIndex}</p>
              </div>
              <button
                onClick={() => handleAddCity(city)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add to Trip
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Added Cities */}
      {addedCities.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Cities Added to Trip</h2>
          <ul className="list-disc pl-5">
            {addedCities.map((city, idx) => (
              <li key={idx} className="flex justify-between items-center mb-2">
                <span>
                  {city.name} ({city.country})
                </span>
                <button
                  onClick={() => handleRemoveCity(city)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
