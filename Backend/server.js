const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.SECRET_KEY || "fallback-secret-key"; // Fallback value

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
  id: String,
  name: String,
  date: String,
  location: String,
  description: String,
});
const Event = mongoose.model("Event", eventSchema);

// Registration Schema
const registrationSchema = new mongoose.Schema({
  eventId: String,
  userId: String,
});
const Registration = mongoose.model("Registration", registrationSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Access Denied" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    req.userId = decoded.id;
    next();
  });
};

// Register User
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already in use" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
});

// Login User

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Check if email & password exist
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Find user in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 🔹 Generate JWT token (fix `SECRET_KEY`)
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    // 🔹 Send token & user data
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all events
app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Fetch a single event by ID
app.get("/events/:id", async (req, res) => {
  const event = await Event.findOne({ id: req.params.id });
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
});

// Create an event
app.post("/events", async (req, res) => {
  const { name, date, location, description } = req.body;
  if (!name || !date || !location || !description) return res.status(400).json({ message: "All fields are required" });

  const newEvent = new Event({ id: uuidv4(), name, date, location, description });
  await newEvent.save();
  res.status(201).json(newEvent);
});

app.get("/events/:id/registrations", async (req, res) => {
  const eventId = req.params.id;
  const registrations = await Registration.find({ eventId });
  res.json(registrations);
});

// Register for an event (Requires authentication)
app.post("/events/:id/register", verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.userId;

  const eventExists = await Event.findOne({ id: eventId });
  if (!eventExists) return res.status(404).json({ message: "Event not found" });

  const newRegistration = new Registration({ eventId, userId });
  await newRegistration.save();

  res.status(200).json({ message: "Registered successfully" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
