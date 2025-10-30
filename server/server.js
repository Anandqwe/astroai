const express = require('express');           // web server
const cors = require('cors');                 // allow frontend to call server
const dotenv = require('dotenv');             // load .env
const mongoose = require('mongoose');         // MongoDB connection

dotenv.config();                              // read .env

const app = express();                        // create express app
const PORT = process.env.PORT || 5000;        // pick port from env or 5000

// allow your Vite dev server (port 3000) to call this API
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
}));
app.use(express.json());                      // parse JSON bodies

// connect to MongoDB (only if MONGO_URI is provided)
const { MONGO_URI } = process.env;
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, { dbName: 'astroai' })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Mongo error:', err.message));
} else {
  console.warn('MONGO_URI missing — skipping MongoDB connection');
}

// simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'astroai-backend' });
});

// NASA routes
const nasaRoutes = require('./routes/nasaroutes'); // import once
app.use('/api/nasa', nasaRoutes);                  // mount at /api/nasa

// AI (Gemini) routes
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// start server
app.listen(PORT, () => {
  console.log(`AstroAI backend running on http://localhost:${PORT}`);
});
