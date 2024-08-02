const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // Import multer for handling file uploads
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://example.com"],
}));
app.use(express.static('uploads'));
mongoose.connect("mongodb://127.0.0.1:27017/myFormTest", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define MongoDB Schema and Model
const formSchema = new mongoose.Schema({
  title: String,
  genre: String,
  story: String,
  plot: String,
  image: String // Store image path in the database
});

const Form = mongoose.model("Form", formSchema);

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ); // Save uploaded images in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filename for uploaded images
  }
});

const upload = multer({ storage: storage });

// Routes
app.post("/api/data", upload.single('image'), async (req, res) => {
  try {
    // Extract data from request body and file upload
    const { title, genre, story, plot } = req.body;
    const image = req.file?.path; // Get the path of the uploaded image
console.log(req.file)
    // Save data to MongoDB
    const form = new Form({ title, genre, story, plot, image });
    await form.save();

    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Express started on port 5000");
});
