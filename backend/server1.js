const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://example.com"],
  })
);
mongoose.connect("mongodb://127.0.0.1:27017/mytest");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define MongoDB Schema and Model
// Define MongoDB Schema and Model
const friendSchema = new mongoose.Schema({
  name: String,
  image: String,
  
  commentCount: { type: Number, default: 0 },
});

const Friend = mongoose.model("Friend", friendSchema);
const insertInitialFriends = async () => {
  try {
    // Check if there are any existing friends in the database
    const existingFriends = await Friend.find();
    if (existingFriends.length === 0) {
      // If no friends exist, insert initial friends
      const initialFriends = [
        {
          name: "Clark",
          image: "https://i.pravatar.cc/48?u=118836",
          
          commentCount: 0,
        },
        {
          name: "Sarah",
          image: "https://i.pravatar.cc/48?u=933372",
          
          commentCount: 0,
        },
        {
          name: "Anthony",
          image: "https://i.pravatar.cc/48?u=499476",
          
          commentCount: 0,
        },
      ];

      await Friend.insertMany(initialFriends);
      console.log("Initial friends inserted successfully.");
    }
  } catch (error) {
    console.error("Error inserting initial friends:", error);
  }
};
// Routes
app.post("/api/data", async (req, res) => {
  console.log(req.body);
  try {
    // Extract data from request body
    const { name, image, commentCount } = req.body;

    // Save post data to MongoDB
    // You can add more error handling as needed
    const friend = new Friend({
      name,
      image,
      commentCount,
    });
    await friend.save();

    // Save friends data to MongoDB
    // const savedFriends = await Friend.insertMany(friends);

    // Send response
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// Route to retrieve all form data
app.get("/api/data", async (req, res) => {
  try {
    const friend = await Friend.find();
    res.json(friend);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const mainPostSchema = new mongoose.Schema({
  post: String,
});
const MainPost = mongoose.model("MainPost", mainPostSchema);
const insertInitialPosts = async () => {
  try {
    // Check if there are any existing friends in the database
    const existingPosts = await MainPost.find();
    if (existingPosts.length === 0) {
      // If no friends exist, insert initial friends
      const initialPosts = [
        {
          post: "Clark",
          
        },
        
      ];

      await MainPost.insertMany(initialPosts);
      console.log("Initial friends inserted successfully.");
    }
  } catch (error) {
    console.error("Error inserting initial friends:", error);
  }
};
// Routes
// Route to add a new main post
app.post("/api/main-post", async (req, res) => {
  try {
    const { post } = req.body;
    const mainPost = new MainPost({
      post,
    });
    await mainPost.save();
    res.status(201).json({ message: "Main post saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to get the latest main post
app.get("/api/main-post", async (req, res) => {
  try {
    const mainPost = await MainPost.find().sort({ _id: -1 });
    res.json(mainPost);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  app.listen(5000, async () => {
    console.log("Express started on port 5000");
    await insertInitialFriends();
    await insertInitialPosts();
  });