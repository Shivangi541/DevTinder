// src/index.js
const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/admin_userAuth"); // adjust path if needed
const connectDB = require("./config/database"); // Ensure database connection is established
const app = express();

connectDB()
  .then(() => {
    console.log("Database connected successfully to 'devtinder'");
    app.listen(3000, () =>
      console.log("Server is successfully running on port 3000")
    );
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit the process with failure
  });
