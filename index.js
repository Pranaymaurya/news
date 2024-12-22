import express from 'express';
import connectDB from './Config/db.js';
import router from './Routes/Allroutes.js';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv

// Initialize dotenv to load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Built-in middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// API routes
app.use("/api/", router);

// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
