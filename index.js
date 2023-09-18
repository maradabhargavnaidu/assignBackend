const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;
require("dotenv").config();
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://bhargavnaidu:fS32Bt4ftvEJ1WpT@database.jnqneb3.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connection Successfull"))
  .catch((err) => console.log(err));

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
    return res.send(user);
  } catch (err) {
    return res.send(err);
  }
});

// Read Endpoint (GET)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(201).json(users);
  } catch (err) {
    return res.status(500).json(err);
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
    return res.send(resp);
  } catch (err) {
    return res.send(err);
  }
});

// Delete Endpoint (DELETE)
app.post("/deleteuser", async (req, res) => {
  const { _id } = req.body;
  // console.log(req.body);
  try {
    const resp = await User.findByIdAndDelete(_id);
    return res.send(resp);
  } catch (err) {
    return res.send(err);
  }
});

app.get("/selectedone/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params.id);
  try {
    const resp = await User.findById(id);
    return res.send(resp);
  } catch (err) {
    return res.send(err);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});
