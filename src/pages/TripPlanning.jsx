import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import touristSpotsCSV from "../assets/tourist_spots.csv";

function TripPlanning() {
  const [gtid, setGtid] = useState("");
  const [tripName, setTripName] = useState("");
  const [spotsData, setSpotsData] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [totalBudget, setTotalBudget] = useState("");
  const [startDate, setStartDate] = useState("");  // Start date state
  const [endDate, setEndDate] = useState("");      // End date state

  useEffect(() => {
    fetch(touristSpotsCSV)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setSpotsData(results.data);
          },
        });
      });
  }, []);

  const handleSpotToggle = (spot) => {
    const exists = selectedSpots.find((s) => s.id === spot.id);
    if (exists) {
      setSelectedSpots(selectedSpots.filter((s) => s.id !== spot.id));
    } else {
      setSelectedSpots([...selectedSpots, spot]);
    }
  };

  const allocateTimings = () => {
    const schedule = [];
    let currentHour = 9;

    selectedSpots.forEach((spot) => {
      if (currentHour === 13) {
        schedule.push({ activity: "Lunch Break", startTime: "13:00", endTime: "14:00" });
        currentHour = 14;
      }
      if (currentHour === 16) {
        schedule.push({ activity: "Snack Break", startTime: "16:00", endTime: "16:30" });
        currentHour = 16.5;
      }
      if (currentHour === 19) {
        schedule.push({ activity: "Dinner Break", startTime: "19:00", endTime: "20:00" });
        currentHour = 20;
      }

      const start = `${Math.floor(currentHour)}:${currentHour % 1 === 0 ? "00" : "30"}`;
      currentHour += 2;
      const end = `${Math.floor(currentHour)}:${currentHour % 1 === 0 ? "00" : "30"}`;
      schedule.push({ activity: spot.spot_name, startTime: start, endTime: end });
    });

    return schedule;
  };

  const handleSaveTrip = () => {
    if (!gtid || !tripName || selectedSpots.length === 0 || !totalBudget || !startDate || !endDate) {
      alert("Please fill all fields and select at least one spot!");
      return;
    }

    const trips = JSON.parse(localStorage.getItem("trips") || "[]");
    const schedule = allocateTimings();

    const newTrip = {
      id: Date.now(),
      gtid,
      name: tripName,
      spots: selectedSpots,
      startDate,
      endDate,
      totalBudget: parseInt(totalBudget),
      cost: [
        { name: "Transport", value: parseInt(totalBudget) * 0.3 },
        { name: "Stay", value: parseInt(totalBudget) * 0.4 },
        { name: "Activities", value: parseInt(totalBudget) * 0.2 },
        { name: "Meals", value: parseInt(totalBudget) * 0.1 },
      ],
      schedule,
    };

    trips.push(newTrip);
    localStorage.setItem("trips", JSON.stringify(trips));
    alert("Trip saved successfully!");
    setTripName("");
    setSelectedSpots([]);
    setTotalBudget("");
    setGtid("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 text-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#004080]">Plan a New Trip</h1>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter your GTID"
          value={gtid}
          onChange={(e) => setGtid(e.target.value)}
          className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] placeholder:text-sm"
        />
        <input
          type="text"
          placeholder="Trip Name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] placeholder:text-sm"
        />
        <input
          type="number"
          placeholder="Total Budget (₹)"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] placeholder:text-sm"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="startDate" className="font-semibold text-[#004080]">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="endDate" className="font-semibold text-[#004080]">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-[#004080]">Select Spots</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {spotsData.map((spot) => (
          <div key={spot.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
            <img
              src={spot.image_url || "/assets/placeholder.jpg"}
              alt={spot.spot_name}
              className="w-full h-36 object-cover"
            />
            <div className="p-2">
              <h3 className="font-semibold">{spot.spot_name}</h3>
              <p className="text-sm h-12 overflow-hidden text-gray-600">{spot.description}</p>
              <button
                onClick={() => handleSpotToggle(spot)}
                className={`mt-2 w-full px-3 py-2 rounded-full ${
                  selectedSpots.find((s) => s.id === spot.id)
                    ? "bg-[#4DA3FF] text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {selectedSpots.find((s) => s.id === spot.id) ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveTrip}
        className="mt-6 px-6 py-3 bg-[#004080] text-white rounded-full hover:bg-[#1976D2] transition"
      >
        Save Trip
      </button>
    </div>
  );
}

export default TripPlanning;
