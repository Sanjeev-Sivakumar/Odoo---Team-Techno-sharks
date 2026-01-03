import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Itinerary({ tripId }) {
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem(`trip_${tripId}_spots`) || "[]");
    // Group by day
    const grouped = savedActivities.reduce((acc, act) => {
      const day = act.day || 1;
      if (!acc[day]) acc[day] = [];
      acc[day].push(act);
      return acc;
    }, {});
    setItinerary(Object.entries(grouped).map(([day, acts]) => ({ day, activities: acts })));
  }, [tripId]);

  const handleDragEnd = (result, dayIndex) => {
    if (!result.destination) return;
    const items = Array.from(itinerary[dayIndex].activities);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities = items;
    setItinerary(newItinerary);

    // Save back to localStorage
    const allActivities = newItinerary.flatMap((d) => d.activities);
    localStorage.setItem(`trip_${tripId}_spots`, JSON.stringify(allActivities));
  };

  return (
    <div className="p-4 bg-white bg-opacity-90 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Itinerary</h2>

      {itinerary.map((dayObj, dayIndex) => (
        <div key={dayObj.day} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Day {dayObj.day}</h3>
          <DragDropContext onDragEnd={(result) => handleDragEnd(result, dayIndex)}>
            <Droppable droppableId={`day-${dayObj.day}`}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {dayObj.activities.map((act, index) => (
                    <Draggable key={act.id} draggableId={`act-${act.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border rounded-lg p-3 bg-gray-100 shadow hover:shadow-md transition flex justify-between items-center"
                        >
                          <span>{act.name}</span>
                          <span className="text-gray-600">{act.duration} | ₹{act.cost}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ))}
    </div>
  );
}
