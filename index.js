const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;
require("dotenv").config();
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL);

// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: "*",
  })
);
// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profileImage: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => res.send("Server running successfully"));

// Create Endpoint (POST)
app.post("/users", async (req, res) => {
  const { name, email, profileImage } = req.body;
  console.log(req.body);
  const newUser = new User({ name, email, profileImage });
  await newUser.save();
  res.send(newUser);
});

// Read Endpoint (GET)
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Update Endpoint (PUT)
app.post("/updateusers", async (req, res) => {
  const { _id, name, email, profileImage } = req.body;
  console.log(req.body);
  try {
    const res = await User.findByIdAndUpdate(_id.id, {
      name,
      email,
      profileImage,
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete Endpoint (DELETE)
app.post("/deleteuser", async (req, res) => {
  const { _id } = req.body;
  console.log(req.body);
  await User.findByIdAndDelete(_id);
  res.send("User deleted");
});

app.get("/selectedone/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params.id);
  const resp = await User.findById(id);
  console.log(resp);
  res.send(resp);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
