const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
require('dotenv').config();

// initializing app
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());  // Use CORS after initializing app
app.use(express.json()); // For parsing application/json

// Define Routes
app.use('/api/auth', authRoutes); // Register the auth routes
app.use('/api', protectedRoutes); // Register the protected routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
