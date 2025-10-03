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

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static File Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Auto-create upload folders
const uploadDirs = [
  'uploads/about',
  'uploads/resumes', // for job applications
];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ✅ Centralized API Entry Point
app.use('/api', require('./api')); // <-- only change you need in future is in /api/index.js

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ LMS API is running');
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
