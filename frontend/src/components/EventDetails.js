import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "../styles/eventdetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Fetch event details
    axios.get(`http://localhost:5000/events/${id}`).then((response) => {
      setEvent(response.data);
    });

    // Check if user is already registered
    if (user) {
      axios.get(`http://localhost:5000/events/${id}/registrations`)
        .then((response) => {
          const registrations = response.data;
          const userRegistered = registrations.some(reg => reg.userId === user.id);
          setIsRegistered(userRegistered);
        })
        .catch(error => {
          console.error("Error checking registration:", error);
        });
    }
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) return alert("You must be logged in to register.");
    if (isRegistered) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/events/${event.id}/register`,
        {}, 
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setMessage(response.data.message || "Registered successfully!");
      setIsRegistered(true);
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

      {message && <p className="register-message">{message}</p>}
      {isRegistered ? (
        <p>You are already registered for this event</p>
      ) : (
        <button className="register-btn" onClick={handleRegister}>
          Register for Event
        </button>
      )}
    </div>
  );
}
