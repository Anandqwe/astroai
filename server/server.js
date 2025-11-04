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
// MongoDB is OPTIONAL - server works fine without it
const { MONGO_URI } = process.env;
let mongoConnected = false;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, { 
      dbName: 'astroai',
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    })
    .then(() => {
      mongoConnected = true;
      console.log('✅ MongoDB connected successfully');
    })
    .catch(err => {
      mongoConnected = false;
      const errorMsg = err.message || 'Unknown error';
      
      // Check for specific error types
      if (errorMsg.includes('IP') || errorMsg.includes('whitelist')) {
        console.warn('⚠️  MongoDB Connection Failed: IP Address Not Whitelisted');
        console.warn('   → Add your IP to MongoDB Atlas whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/');
        console.warn('   → Or add 0.0.0.0/0 to allow all IPs (less secure, for development only)');
      } else if (errorMsg.includes('authentication')) {
        console.warn('⚠️  MongoDB Connection Failed: Authentication Error');
        console.warn('   → Check your MongoDB username and password in MONGO_URI');
      } else if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('DNS')) {
        console.warn('⚠️  MongoDB Connection Failed: DNS/Network Error');
        console.warn('   → Check your internet connection and MongoDB Atlas cluster status');
      } else {
        console.warn('⚠️  MongoDB Connection Failed:', errorMsg);
      }
      
      console.warn('   ℹ️  Server will continue without MongoDB (all features still work)');
      console.warn('   ℹ️  To disable this warning, remove MONGO_URI from .env file');
    });
} else {
  console.log('ℹ️  MongoDB not configured (MONGO_URI missing) - running without database');
}

// simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'astroai-backend',
    mongo: mongoConnected ? 'connected' : 'not connected (optional)'
  });
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
