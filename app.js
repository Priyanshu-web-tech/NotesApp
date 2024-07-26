const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const Note = require("./models/note");

dotenv.config(); // Load environment variables from .env file

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Middleware for PUT and DELETE requests

mongoose
  .connect(
    "mongodb+srv://ps:mern@cluster0.p7q6roa.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.use(express.static("./public"));

// Get all notes
app.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: "desc" });
    res.render("index", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).send("Server Error");
  }
});

// Create a new app
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  try {
    await Note.create({ title, content });
    res.redirect("/");
  } catch (err) {
    console.error("Error creating note:", err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a note
app.delete("/notes/:id/delete", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting note:", err.message);
    res.status(500).send("Server Error");
  }
});

// Get a specific note for editing
app.get("/notes/:id/edit", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    res.render("edit", { note });
  } catch (err) {
    console.error("Error fetching note for editing:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update a specific note
app.put("/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  try {
    await Note.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect("/");
  } catch (err) {
    console.error("Error updating note:", err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
