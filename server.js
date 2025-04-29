const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

dotenv.config(); // Load environment variables
const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dgmc2nxhl',
  api_key:'124167469576942',
  api_secret: 'nb-W01d3LlHuoaN_wMece5nhNQM',
});

// Middleware
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(fileUpload({ useTempFiles: true })); // Enable file uploads
app.use(cors({
  origin: ['http://localhost:5173'], // Allow only frontend origin
  credentials: true, // Allow cookies/auth headers
}));

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