// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    localStorage.setItem("userRole", role); // store role in localStorage
    if (role === "Admin") navigate("/admin");
    else navigate("/dashboard");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-black cursor-pointer" onClick={() => navigate("/dashboard")}>
        Globetrotter
      </h1>

      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => navigate("/plan-trip")}
        >
          Plan Trip
        </button>
        <button
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          onClick={() => navigate("/trip-history")}
        >
          Trip History
        </button>

        {/* Role selector */}
        <select
          defaultValue={localStorage.getItem("userRole") || "User"}
          onChange={handleRoleChange}
          className="border px-3 py-1 rounded text-black"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
    </nav>
  );
}
