import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from 'cookie-parser'
dotenv.config();
import storyRoute from "./routes/storyRoute.js";
import authorRoute from "./routes/authorRoute.js";
import  userRoute from './routes/userRoute.js';
import uploadRoute from './routes/uploadRoutes.js';
import connectDB from "./config/db.js";
const port = process.env.PORT || 8081;
const app = express();
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
await connectDB();
app.use(cors());
// mongoose.connect("mongodb://127.0.0.1:27017/myProject");
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.json());
app.use(express.urlencoded( { extended : true} )); // for parsing
app.use(cookieParser())
app.get("/", (req, res) => {
  console.log("/ logged")
  res.send("Hello World");
});

app.use("/api/story", storyRoute);
app.use("/api/users", userRoute);
app.use("/api/author", authorRoute);
app.use("/api/upload", uploadRoute);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
