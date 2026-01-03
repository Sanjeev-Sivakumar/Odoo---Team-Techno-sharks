// App.jsx
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import TripPlanning from "./pages/TripPlanning";
import TripHistory from "./pages/TripHistory";
import CitySearch from "./pages/CitySearch";
import ActivitySearch from "./pages/ActivitySearch";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/plan-trip" element={<TripPlanning />} />
      <Route path="/trip-history" element={<TripHistory />} />
      <Route path="/city-search" element={<CitySearch />} />
      <Route path="/activity-search" element={<ActivitySearch />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
