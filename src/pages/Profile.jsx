// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
    language: "English",
  });
  const [savedDestinations, setSavedDestinations] = useState([]);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile") || "{}");
    setProfile({
      name: savedProfile.name || "",
      email: savedProfile.email || "",
      photo: savedProfile.photo || "",
      language: savedProfile.language || "English",
    });

    const trips = JSON.parse(localStorage.getItem("trips") || "[]");
    const destinations = trips.flatMap((t) => t.spots.map((s) => s.spot_name));
    setSavedDestinations(destinations);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile((prev) => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile saved successfully!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      localStorage.removeItem("profile");
      localStorage.removeItem("trips");
      setProfile({ name: "", email: "", photo: "", language: "English" });
      setSavedDestinations([]);
      alert("Account deleted successfully!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#004080]">User Profile</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center mb-4">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-2 border-2 border-[#4DA3FF]"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-2 border-2 border-[#4DA3FF]">
              <span className="text-gray-500">No Photo</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] text-gray-900"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] text-gray-900"
        />

        <select
          name="language"
          value={profile.language}
          onChange={handleChange}
          className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] text-gray-900"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
          <option value="Spanish">Spanish</option>
        </select>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#4DA3FF] rounded-full hover:bg-[#1976D2] transition text-white"
        >
          Save Profile
        </button>

        <button
          onClick={handleDeleteAccount}
          className="px-6 py-3 bg-[#EF4444] rounded-full hover:bg-[#CC0000] transition text-white"
        >
          Delete Account
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-[#004080]">Saved Destinations</h2>
        {savedDestinations.length === 0 ? (
          <p className="text-gray-600">No saved destinations yet.</p>
        ) : (
          <ul className="list-disc pl-5 text-gray-700">
            {savedDestinations.map((dest, idx) => (
              <li key={idx}>{dest}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
