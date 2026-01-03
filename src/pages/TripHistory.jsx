import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function TripHistory() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem("trips") || "[]");
    setTrips(savedTrips);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      const filtered = trips.filter((t) => t.id !== id);
      setTrips(filtered);
      localStorage.setItem("trips", JSON.stringify(filtered));
    }
  };

  const generateTimeline = (trip) => {
    if (!trip.spots || trip.spots.length === 0) return [];

    const timeline = [];
    let currentHour = 9;
    let day = 1;

    trip.spots.forEach((spot, idx) => {
      if (currentHour === 13) {
        timeline.push({ day, activity: "Lunch Break", startTime: "13:00", endTime: "14:00" });
        currentHour = 14;
      } else if (currentHour === 16) {
        timeline.push({ day, activity: "Snack Break", startTime: "16:00", endTime: "16:30" });
        currentHour = 16.5;
      } else if (currentHour >= 19) {
        timeline.push({ day, activity: "Dinner Break", startTime: "19:00", endTime: "20:00" });
        day += 1;
        currentHour = 9;
      }

      const start = `${Math.floor(currentHour)}:${currentHour % 1 === 0 ? "00" : "30"}`;
      currentHour += 2; // 2 hours per spot
      const end = `${Math.floor(currentHour)}:${currentHour % 1 === 0 ? "00" : "30"}`;

      timeline.push({ day, activity: spot.spot_name, startTime: start, endTime: end });
    });

    return timeline;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Trip History</h1>

      {trips.length === 0 ? (
        <p className="text-center text-xl">No trips found. Plan a new trip!</p>
      ) : (
        trips.map((trip) => {
          const financialData =
            trip.cost && trip.cost.length > 0
              ? trip.cost
              : [
                  { name: "Transport", value: 1000 },
                  { name: "Stay", value: 2000 },
                  { name: "Activities", value: 1500 },
                  { name: "Meals", value: 500 },
                ];

          const totalBudget = financialData.reduce((sum, item) => sum + item.value, 0);
          const timeline = generateTimeline(trip);

          return (
            <div
              key={trip.id}
              className="border rounded-xl p-6 mb-12 shadow-lg hover:shadow-2xl transition bg-gray-900"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{trip.name}</h2>
                  <p className="text-gray-400">{trip.startDate} - {trip.endDate}</p>
                  <p className="text-gray-400">Destinations planned: {trip.spots?.length || 0}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => alert("View functionality not implemented yet")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => alert("Edit functionality not implemented yet")}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="md:flex md:gap-8 mt-6">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-semibold mb-2">Financial Breakdown</h3>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={financialData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                  <p className="mt-2 font-semibold">Total Budget: ₹{totalBudget}</p>
                </div>

                {/* Daily Timeline */}
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <h3 className="text-xl font-semibold mb-2">Daily Timeline</h3>
                  <table className="w-full text-left border rounded-lg text-gray-300">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="px-3 py-2">Day</th>
                        <th className="px-3 py-2">Activity</th>
                        <th className="px-3 py-2">Start</th>
                        <th className="px-3 py-2">End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeline.map((t, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{t.day}</td>
                          <td className="px-3 py-2">{t.activity}</td>
                          <td className="px-3 py-2">{t.startTime}</td>
                          <td className="px-3 py-2">{t.endTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
