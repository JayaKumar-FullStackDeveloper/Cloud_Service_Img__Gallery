// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connection'); // Ensure this connects to your MongoDB
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
// const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
connectDB(); // Connect to MongoDB
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/user', userRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000; // Default to 4000 if PORT is not set
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
