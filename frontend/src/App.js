import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import EventDetails from "./components/EventDetails";
import CreateEvent from "./components/CreateEvent";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuth } from "./AuthContext";
import "./styles/styles.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1 className="logo">🚀 Hype Events</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/create">Create Event</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
