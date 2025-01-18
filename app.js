import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from './error/error.js';
import reservationRouter from './routes/reservationRoute.js';

const app = express();
dotenv.config({ path: "./config/config.env" });

// Middleware
app.use(express.json({ limit: '10mb' })); // Set payload size limit
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: ['https://rest-frontend-b3wu.vercel.app'], // List allowed origins
  credentials: true, // Enable credentials
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Increase Request Timeout
app.use((req, res, next) => {
  req.setTimeout(120000); // 120 seconds
  next();
});

// Health Check Route
app.get('/api/health', async (req, res) => {
  try {
    // Replace with a valid database check
    await dbConnection(); // Test database connection
    res.status(200).json({ status: 'healthy', message: 'Server is running fine.' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Routes
app.use('/api/v1/reservation', reservationRouter);

// Set Referrer Policy
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Database Connection
dbConnection().catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1); // Exit process if DB connection fails
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
