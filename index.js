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
  try {
    const newUser = new User({ name, email, profileImage });
    const user = await newUser.save();
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

// Read Endpoint (GET)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

// Update Endpoint (PUT)
app.post("/updateusers", async (req, res) => {
  const { _id, name, email, profileImage } = req.body;
  // console.log(req.body);
  try {
    const resp = await User.findByIdAndUpdate(_id.id, {
      name,
      email,
      profileImage,
    });
    res.send(resp);
  } catch (err) {
    console.log(err);
  }
});

// Delete Endpoint (DELETE)
app.post("/deleteuser", async (req, res) => {
  const { _id } = req.body;
  // console.log(req.body);
  try {
    const resp = await User.findByIdAndDelete(_id);
    res.send(resp);
  } catch (err) {
    console.log(err);
  }
});

app.get("/selectedone/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params.id);
  try {
    const resp = await User.findById(id).then(() => res.send(resp));
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
