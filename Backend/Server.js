// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env
dotenv.config();

const app = express();

// ✅ Check for MongoDB URI
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env file');
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ Route Imports
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const blogRoutes = require('./routes/blogRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const innovationRoutes = require('./routes/innovationRoutes');
const homeContentRoutes = require('./routes/homeContentRoutes'); // ✅ Added HomeContent API

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/innovations', innovationRoutes);
app.use('/api/home', homeContentRoutes); // ✅ Home content route

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ LMS API is running');
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
