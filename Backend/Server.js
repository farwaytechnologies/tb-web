// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const blogRoutes = require('./routes/blogRoutes'); // ✅ Import Blog Routes

dotenv.config(); // Load environment variables from .env

const app = express();

// Check for required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env file');
  process.exit(1);
}

// MongoDB Connection (cleaned for driver v4+)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes); // ✅ Use Blog Routes

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ LMS API is running');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
