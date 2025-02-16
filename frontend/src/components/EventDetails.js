import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/eventdetails.css"; // Import styles

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/events/${id}`).then((response) => {
      setEvent(response.data);
    });
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/events/${id}/register`,
        user
      );
      setMessage(response.data.message);
      setUser({ name: "", email: "" }); // Clear form after submission
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="event-details-container">
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>

      <button className="register-btn" onClick={() => setShowForm(true)}>
        Register for Event
      </button>

      {showForm && (
        <div className="register-form">
          {message && <p className="register-message">{message}</p>}
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}
