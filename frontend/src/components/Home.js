import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/events").then((response) => {
      setEvents(response.data);
    });
  }, []);

  return (
    <div className="home-container">
      <h2 className="section-title">🔥 Upcoming Events</h2>
      <div className="event-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>{event.date} - {event.location}</p>
            <Link to={`/events/${event.id}`} className="details-btn">🔍 View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}