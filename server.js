import express from "express";
import "dotenv/config";
import cors from 'cors'
import loginRouter from "./routes/authRoutes.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js"
import authRouter from "./routes/authRoutes.js";
import siteRouter from "./routes/siteRoutes.js";


// APP CONFIG
const app = express();
const port = process.env.PORT || 8082
connectDB()
connectCloudinary();


// MIDDLE WARE
app.use(express.json());
app.use(cors());


// Serve static uploads folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/sites", siteRouter);

app.get("/", (req, res) => {
  res.send("Server is LIbve");
});

app.listen(port, (req, res) => {
  console.log("server is listiern ",port);
});
