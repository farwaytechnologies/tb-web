const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

// ✅ MongoDB Connect
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not defined');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/innovations', require('./routes/innovationRoutes'));
app.use('/api/home', require('./routes/homeContentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes')); // Contact route

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ LMS API is running');
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ message: 'Server error' });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
