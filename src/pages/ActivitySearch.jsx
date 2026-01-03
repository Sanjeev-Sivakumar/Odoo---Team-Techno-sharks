import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import spotsCSV from "../assets/tourist_spots.csv";

export default function ActivitySearch() {
  const [allActivities, setAllActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [addedActivities, setAddedActivities] = useState([]);

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
            cost: row.cost || "50",
            duration: row.duration || "N/A",
            district: row.district || "Unknown",
            country: row.country || "India",
          }));

        // remove duplicates
        const uniqueActivities = Array.from(
          new Map(cleaned.map((a) => [a.name, a])).values()
        );

        setAllActivities(uniqueActivities);
      },
    });
  }, []);

  // check if activity already added
  const isAdded = (activity) =>
    addedActivities.some((a) => a.name === activity.name);

  // safe filtering
  const filteredActivities = allActivities.filter((act) => {
    const name = act.name?.toLowerCase() || "";
    const type = act.type || "General";

    const matchesSearch = name.includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleAddActivity = (activity) => {
    if (isAdded(activity)) return;
    setAddedActivities([...addedActivities, activity]);
  };

  const handleRemoveActivity = (activity) => {
    setAddedActivities(
      addedActivities.filter((a) => a.name !== activity.name)
    );
  };

  const typeOptions = ["All", ...new Set(allActivities.map((a) => a.type))];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Activity Search
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <p className="text-center py-10">No activities found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{act.name}</h3>
                <p className="text-gray-700">Type: {act.type}</p>
                <p className="text-gray-700">Duration: {act.duration}</p>
                <p className="text-gray-700">Cost: ₹{act.cost}</p>
                <p className="text-gray-700">District: {act.district}</p>
              </div>

              <button
                onClick={() => handleAddActivity(act)}
                disabled={isAdded(act)}
                className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
                  isAdded(act)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isAdded(act) ? "Added ✓" : "Add to Trip"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Added Activities */}
      {addedActivities.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Added Activities
          </h2>
          <ul className="list-disc pl-5">
            {addedActivities.map((act, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center mb-2"
              >
                <span>{act.name}</span>
                <button
                  onClick={() => handleRemoveActivity(act)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg"
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
