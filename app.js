

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const apify = require('./routes/apify');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



app.use('/api', authRoutes);  // Your existing auth routes




app.use('/api', apify);

// app.use('/api', pipeline);


// Error handling
app.use(errorHandler);


module.exports = app;
