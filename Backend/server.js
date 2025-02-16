const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://aniketabtech22:@cluster0.fpd9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

const eventSchema = new mongoose.Schema({
    id: String,
    name: String,
    date: String,
    location: String,
    description: String
});

const Event = mongoose.model('Event', eventSchema);

const registrationSchema = new mongoose.Schema({
    eventId: String,
    user: String
});

const Registration = mongoose.model('Registration', registrationSchema);


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);


// Fetch all events
app.get('/events', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

// Fetch a single event by ID
app.get('/events/:id', async (req, res) => {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
});

// Create a new event
app.post('/events', async (req, res) => {
    const { name, date, location, description } = req.body;
    if (!name || !date || !location || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const newEvent = new Event({ id: uuidv4(), name, date, location, description });
    await newEvent.save();
    res.status(201).json(newEvent);
});

// Register for an event
app.post('/events/:id/register', async (req, res) => {
    const { user } = req.body;
    const eventId = req.params.id;
    if (!user) return res.status(400).json({ message: "User is required" });
    const eventExists = await Event.findOne({ id: eventId });
    if (!eventExists) return res.status(404).json({ message: "Event not found" });
    const newRegistration = new Registration({ eventId, user });
    await newRegistration.save();
    res.status(200).json({ message: "Registration successful" });
});

// Register for an event
app.post('/events/:id/register', async (req, res) => {
    const { name, email } = req.body;
    const eventId = req.params.id;

    if (!name || !email) return res.status(400).json({ message: "Name and Email are required" });

    const eventExists = await Event.findOne({ id: eventId });
    if (!eventExists) return res.status(404).json({ message: "Event not found" });

    const newRegistration = new Registration({ eventId, user: `${name} (${email})` });
    await newRegistration.save();
    res.status(200).json({ message: "Successfully registered for the event!" });
});

// User Registration API
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
