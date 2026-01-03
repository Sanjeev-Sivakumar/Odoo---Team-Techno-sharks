// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

/* ================= CONFIG ================= */
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const BAR_COLOR = "#4DA3FF";
const PIE_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#F59608",
  "#AA336A",
  "#FF6666",
];

/* ================= COMPONENT ================= */
export default function Admin() {
  /* ---------- AUTH ---------- */
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("adminLoggedIn") === "true"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  /* ---------- DATA ---------- */
  const [trips, setTrips] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [topActivities, setTopActivities] = useState([]);

  /* ================= LOGIN ================= */
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid admin credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
  };

  /* ================= DATA LOAD ================= */
  useEffect(() => {
    if (!isLoggedIn) return;

    const savedTrips = JSON.parse(localStorage.getItem("trips") || "[]");
    setTrips(savedTrips);

    // Top cities (district-based)
    const cityCount = {};
    savedTrips.forEach((trip) => {
      const district = trip.district || "Unknown";
      cityCount[district] = (cityCount[district] || 0) + 1;
    });
    setTopCities(
      Object.keys(cityCount).map((city) => ({
        city,
        trips: cityCount[city],
      }))
    );

    // Top activities / spots
    const activityCount = {};
    savedTrips.forEach((trip) => {
      (trip.spots || []).forEach((s) => {
        const name = s.spot_name || "Unknown";
        activityCount[name] = (activityCount[name] || 0) + 1;
      });
    });
    setTopActivities(
      Object.keys(activityCount).map((a) => ({
        activity: a,
        count: activityCount[a],
      }))
    );
  }, [isLoggedIn]);

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    const data = trips.map((t) => ({
      Trip_Name: t.name,
      GTID: t.gtid,
      District: t.district,
      Budget: t.totalBudget,
      Total_Spots: (t.spots || []).length,
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "admin_trips_report.csv";
    link.click();
  };

  /* ================= PDF EXPORT ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Globetrotter – Admin Trip Report", 14, 20);

    const tableData = trips.map((t) => [
      t.name,
      t.gtid || "N/A",
      t.district || "N/A",
      `₹${t.totalBudget || 0}`,
      (t.spots || []).length,
    ]);

    doc.autoTable({
      head: [["Trip Name", "GTID", "District", "Budget", "Spots"]],
      body: tableData,
      startY: 30,
    });

    doc.save("admin_trips_report.pdf");
  };

  /* ================= LOGIN UI ================= */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

          {loginError && (
            <p className="text-red-600 text-sm mb-3 text-center">
              {loginError}
            </p>
          )}

          <input
            className="w-full mb-3 p-2 border rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-4 p-2 border rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  /* ================= DASHBOARD UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 bg-white text-black min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* EXPORT BUTTONS */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      {/* TRIPS TABLE */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Trips Overview</h2>
        {trips.length === 0 ? (
          <p>No trips data available.</p>
        ) : (
          <table className="w-full border rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Trip Name</th>
                <th className="p-2">GTID</th>
                <th className="p-2">District</th>
                <th className="p-2">Budget</th>
                <th className="p-2">Spots</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">{t.gtid}</td>
                  <td className="p-2">{t.district}</td>
                  <td className="p-2">₹{t.totalBudget}</td>
                  <td className="p-2">{(t.spots || []).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">Trips by District</h2>
          <BarChart width={450} height={300} data={topCities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="trips" fill={BAR_COLOR} />
          </BarChart>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Top Activities</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={topActivities}
              dataKey="count"
              nameKey="activity"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {topActivities.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
