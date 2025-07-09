

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const apify = require('./routes/apify');
const pipeline = require('./routes/pipelineRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - Add all three route files
// const jobRoutes = require('./routes/jobRoutes');
// const csvRoutes = require('./routes/csvRoutes');

app.use('/api', authRoutes);  // Your existing auth routes
// app.use('/api', jobRoutes);   // Job search routes 


// import jobRoutes1 from './routes/apify.js';

app.use('/api', apify);

// app.use('/api', pipeline);

// app.use('/api', csvRoutes);   // CSV download routes

// Error handling
app.use(errorHandler);


module.exports = app;
