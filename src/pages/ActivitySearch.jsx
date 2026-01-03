import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import spotsCSV from "../assets/tourist_spots.csv";

export default function ActivitySearch() {
  const [allActivities, setAllActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [addedActivities, setAddedActivities] = useState([]);
  const [maxCost, setMaxCost] = useState("");
  const [minDuration, setMinDuration] = useState("");

  useEffect(() => {
    Papa.parse(spotsCSV, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleaned = results.data
          .filter((row) => row.spot_name) // remove empty rows
          .map((row, index) => ({
            id: index,
            name: row.activity_name || row.spot_name || "Unknown Activity",
            type: row.activity_type || "General",
            cost: Number(row.cost) || 0,
            duration: Number(row.duration) || 0, // assume duration in hours
            district: row.district || "Unknown",
            country: row.country || "India",
          }));

        // Remove duplicates
        const uniqueActivities = Array.from(
          new Map(cleaned.map((a) => [a.name, a])).values()
        );

        setAllActivities(uniqueActivities);
      },
    });
  }, []);

  // Filter activities safely with parentheses
  const filteredActivities = allActivities.filter((act) => {
    const name = (act.name?.toLowerCase()) || "";
    const type = act.type || "General";
    const cost = act.cost || 0;
    const duration = act.duration || 0;

    const matchesSearch = name.includes(search.toLowerCase());
    const matchesType = (typeFilter === "All") || (type === typeFilter);
    const matchesCost = (maxCost === "" || cost <= Number(maxCost));
    const matchesDuration = (minDuration === "" || duration >= Number(minDuration));

    return matchesSearch && matchesType && matchesCost && matchesDuration;
  });

  const handleAddActivity = (activity) => {
    if (addedActivities.find((a) => a.name === activity.name)) {
      return;
    }
    setAddedActivities([...addedActivities, activity]);
  };

  const handleRemoveActivity = (activity) => {
    setAddedActivities(
      addedActivities.filter((a) => a.name !== activity.name)
    );
  };

  // Options for type dropdown
  const typeOptions = ["All", ...new Set(allActivities.map((a) => a.type))];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Activity Search</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/3"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/4"
        >
          {typeOptions.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Max Cost"
          value={maxCost}
          onChange={(e) => setMaxCost(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/5"
        />
        <input
          type="number"
          placeholder="Min Duration (hrs)"
          value={minDuration}
          onChange={(e) => setMinDuration(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/5"
        />
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <p className="text-center py-10">No activities found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => {
            const isAdded = !!addedActivities.find((a) => a.name === act.name);
            return (
              <div
                key={act.id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold">{act.name}</h3>
                  <p className="text-gray-700">Type: {act.type}</p>
                  <p className="text-gray-700">Duration: {act.duration} hrs</p>
                  <p className="text-gray-700">Cost: ₹{act.cost}</p>
                  <p className="text-gray-700">District: {act.district}</p>
                  <p className="text-gray-700">Country: {act.country}</p>
                </div>

                <button
                  onClick={() => (isAdded ? handleRemoveActivity(act) : handleAddActivity(act))}
                  className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
                    isAdded ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isAdded ? "Added" : "Add to Trip"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Added Activities */}
      {addedActivities.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Added Activities</h2>
          <ul className="list-disc pl-5">
            {addedActivities.map((act) => (
              <li key={act.id} className="flex justify-between mb-2">
                <span>{act.name}</span>
                <button
                  onClick={() => handleRemoveActivity(act)}
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
