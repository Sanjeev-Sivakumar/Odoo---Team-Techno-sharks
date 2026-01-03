import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function BudgetSummary({ tripId }) {
  const [budgetData, setBudgetData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [avgPerDay, setAvgPerDay] = useState(0);
  const [days, setDays] = useState(1);

  useEffect(() => {
    const savedSpots = JSON.parse(localStorage.getItem(`trip_${tripId}_spots`) || "[]");

    const transport = savedSpots.reduce((acc, s) => acc + (+s.transportCost || 0), 0);
    const stay = savedSpots.reduce((acc, s) => acc + (+s.stayCost || 0), 0);
    const activities = savedSpots.reduce((acc, s) => acc + (+s.cost || 0), 0);
    const meals = savedSpots.reduce((acc, s) => acc + (+s.mealCost || 0), 0);

    const total = transport + stay + activities + meals;
    const numDays = Math.max(savedSpots.length, 1);

    setBudgetData([
      { name: "Transport", value: transport },
      { name: "Stay", value: stay },
      { name: "Activities", value: activities },
      { name: "Meals", value: meals },
    ]);

    setTotalCost(total);
    setAvgPerDay(Math.round(total / numDays));
    setDays(numDays);
  }, [tripId]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-4 bg-white bg-opacity-90 rounded-lg shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
      <p className="mb-2">Total Estimated Cost: <strong>₹{totalCost}</strong></p>
      <p className="mb-4">Average Per Day ({days} days): <strong>₹{avgPerDay}</strong></p>

      {totalCost > 10000 && (
        <p className="text-red-600 font-semibold mb-4">⚠️ Overbudget Alert!</p>
      )}

      <PieChart width={400} height={300}>
        <Pie
          data={budgetData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {budgetData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
