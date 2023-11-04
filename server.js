const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");
const morgan = require('morgan'); // HTTP request logger middleware

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Middleware for parsing application/json
app.use(express.json());
// Routes
app.use(routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Establishing database connection and starting the server
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
