import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from './error/error.js';
import reservationRouter from './routes/reservationRoute.js';

const app = express();
dotenv.config({ path: "./config/config.env" });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // Allow specific origin for production
  credentials: true,                   // Allow credentials
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.use('/api/v1/reservation', reservationRouter);

// Set Referrer Policy
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Database Connection
dbConnection();

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
