/**
 * =================================================================
 * Main Server Entry Point - E-Commerce Platform
 * =================================================================
 *
 * Description:
 * This file is the primary entry point for the Node.js/Express backend server.
 * It performs the following key functions:
 * 1. Initializes the Express application.
 * 2. Loads environment variables using 'dotenv'.
 * 3. Establishes a connection to the MongoDB database via Mongoose.
 * 4. Configures essential middleware, including CORS, JSON body parsing,
 *    and an HTTP request logger (morgan).
 * 5. Mounts the API route handlers for various resources (products, users, orders).
 * 6. Implements logic to serve the React frontend's static build files in production.
 * 7. Sets up custom error handling middleware for 404 Not Found and other server errors.
 * 8. Starts the server and listens for incoming requests on the specified port.
 * 9. Includes handlers for unhandled promise rejections and uncaught exceptions for graceful shutdown.
 *
 * Tech Stack: Node.js, Express, Mongoose, JWT, Stripe
 *
 */

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import route handlers
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import configRoutes from './routes/configRoutes.js';

// --- INITIALIZATION ---

// Load environment variables from the .env file into process.env
dotenv.config();

// Establish connection to the MongoDB database
connectDB();

// Initialize the Express application
const app = express();

// --- MIDDLEWARE CONFIGURATION ---

// Enable Cross-Origin Resource Sharing (CORS) for all routes.
// In a production environment, it's recommended to restrict this to the frontend's domain
// for enhanced security. e.g., app.use(cors({ origin: 'https://yourfrontend.com' }))
app.use(cors());

// Enable the express.json middleware to parse incoming JSON payloads.
// This is a replacement for the deprecated body-parser.
app.use(express.json());

// Enable middleware to parse URL-encoded bodies (e.g., from form submissions).
app.use(express.urlencoded({ extended: true }));

// Use morgan for HTTP request logging in development mode for easier debugging.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- API ROUTES ---

// A simple health check route to confirm the API is running.
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'E-Commerce API is running successfully.' });
});

// Mount the route handlers for different API resources.
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); // For handling image uploads
app.use('/api/config', configRoutes); // For providing client-side config (e.g., Stripe keys)

// --- STATIC ASSETS & PRODUCTION DEPLOYMENT ---

// In ES modules, __dirname is not available by default. This is the standard workaround.
const __dirname = path.resolve();

// Make the 'uploads' directory static, so images can be accessed via URL.
// For example, an image at /uploads/image.jpg can be accessed from http://localhost:PORT/uploads/image.jpg
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Production-specific logic: serve the frontend's static build files.
if (process.env.NODE_ENV === 'production') {
  // Set the frontend/build folder as a static directory.
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // For any route that is not an API route, serve the frontend's index.html file.
  // This is crucial for client-side routing (e.g., React Router) to work correctly.
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // Development-specific route for the root URL.
  app.get('/', (req, res) => {
    res.send('API is running on development server...');
  });
}

// --- ERROR HANDLING MIDDLEWARE ---

// Custom middleware to handle 404 errors (routes that are not found).
// This should be placed after all other routes.
app.use(notFound);

// Custom global error handler. Catches errors passed by `next(error)`.
// This should be the last piece of middleware.
app.use(errorHandler);

// --- SERVER STARTUP ---

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `✅ Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});

// --- GRACEFUL SHUTDOWN ---

// Handle unhandled promise rejections (e.g., database connection errors).
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`.red.bold);
  // Close the server gracefully before exiting the process.
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions (e.g., programming errors).
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`.red.bold);
  console.error(err.stack);
  // Close the server gracefully before exiting the process.
  server.close(() => process.exit(1));
});