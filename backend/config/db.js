```javascript
import mongoose from 'mongoose';
import colors from 'colors'; // For adding color to console logs during development

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * This function reads the MongoDB connection URI from the environment variables (MONGO_URI).
 * It uses an asynchronous approach to connect to the database.
 * Upon successful connection, it logs the host name to the console in a distinct color.
 * If the connection fails, it logs the error message and terminates the application process,
 * as the application is dependent on the database connection to function correctly.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves if the connection is successful.
 * If the connection fails, the process will exit.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI from environment variables.
    // Mongoose.connect() returns a promise that resolves to the Mongoose connection object.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log the successful connection host to the console for confirmation.
    // Using `colors` package to make the log more visible in the development console.
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    // Log the error message in red and bold for high visibility if connection fails.
    console.error(`Error: ${error.message}`.red.bold);

    // Exit the Node.js process with a failure code (1).
    // This is a critical step to prevent the application from running
    // in a faulty state without a database connection.
    process.exit(1);
  }
};

export default connectDB;
```