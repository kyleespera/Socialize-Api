const express = require('express');
const router = express.Router();

// Import all of the API routes from /api/index.js 
const apiRoutes = require('./api');

// Add prefix of `/api` to all of the API routes imported from the `api` directory
router.use('/api', apiRoutes);

// Default response for any other request (Not Found)
router.use((req, res) => {
  res.status(404).send('Route not found!');
});

module.exports = router;
