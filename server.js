import express from "express";
import "dotenv/config";
import cors from "cors";
import loginRouter from "./routes/authRoutes.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import authRouter from "./routes/authRoutes.js";
import siteRouter from "./routes/siteRoutes.js";

// APP CONFIG
const app = express();
const port = process.env.PORT || 8082;
connectDB();
connectCloudinary();

// MIDDLE WARE
app.use(express.json());
// app.use(cors());

// Your frontend origin which is link wiht these backgrounde
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ice-stupa-dashboard.vercel.app",
  // "https://auth-o39rfryvr-jigmatdorjeys-projects.vercel.app",
];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// Remove this line from your server.js file
// app.use(cors());

// Keep only this configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Requested-With", "Authorization"],
  })
);

// Serve static uploads folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/sites", siteRouter);

app.get("/", (req, res) => {
  res.send("Server is LIbve");
});

app.listen(port, (req, res) => {
  console.log("server is listiern ", port);
});
