require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const studentRoutes = require('./routes/students');

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
  origin: '*' // update this to your Vercel frontend URL after deploying
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/students', studentRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ⚠️ KEY CHANGE: Connect to MongoDB but don't block export
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ⚠️ KEY CHANGE: Export app instead of calling app.listen()
module.exports = app;