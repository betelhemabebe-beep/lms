import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import api from "../services/api";

function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
  const fetchAssignments = async () => {
    try {
      const res = await api.get("/assignments");

      const formattedEvents = res.data.map((assignment) => ({
        title: assignment.title,
        date: assignment.dueDate,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  fetchAssignments();
}, []);

  return (
    <div style={{ 
      padding: "20px",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh"
    }}
  >
    <div
  style={{
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  }}
>
   <h2>Course Calendar</h2>

<p style={{ marginBottom: "15px", color: "#555" }}>
  View upcoming assignments and course deadlines.
</p>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  </div>
  );
}

export default CalendarPage;