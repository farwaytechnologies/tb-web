const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();

// ✅ Check MONGO_URI
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env');
  process.exit(1);
}

// ✅ Connect to MongoDB (clean connection)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Ensure folders (optional, remove if not used)
const uploadDirs = ['uploads/about'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/innovations', require('./routes/innovationRoutes'));
app.use('/api/home', require('./routes/homeContentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/about', require('./routes/aboutRoutes')); // ✅ About Page Text (no image)

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ LMS API is running');
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
