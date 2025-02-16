import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import EventDetails from "./components/EventDetails";
import CreateEvent from "./components/CreateEvent";
import Register from "./components/Register"; // Import Register page
import "./styles/styles.css";

export default function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">🚀 Hype Events</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create">Create Event</Link></li>
          <li><Link to="/register">Register</Link></li> {/* Add Register Link */}
        </ul>
      </nav>
      {/* ✅ Correct usage of Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/register" element={<Register />} /> {/* Register Route */}
      </Routes>
    </div>
  );
}
