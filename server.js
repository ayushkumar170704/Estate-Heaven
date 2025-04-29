const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());  // Parse incoming requests with JSON payloads
app.use('/uploads', express.static('uploads'));  // Serve static files from 'uploads' directory



const corsOptions = {
  origin: ['http://localhost:5173'], // Allow only frontend origin
  credentials: true, // Allow cookies/auth headers
};

app.use(cors(corsOptions));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// MongoDB connection and server startup
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
