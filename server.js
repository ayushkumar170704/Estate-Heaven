const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/uploads', express.static('uploads'));


// Add this to your server.js or app.js file (where you initialize Express)
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only the frontend's origin
  credentials: true, // Allow credentials (cookies or authorization headers)
};

app.use(cors(corsOptions));


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
