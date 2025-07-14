const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/admin_userAuth"); // adjust path if needed
const connectDB = require("./config/database"); // Ensure database connection is established
const app = express();
const User = require("./models/user"); // Import the User model
// creating post api
app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Sarbari",
    lastName: "Dutta",
    email: "dutta69sarbari@gmail.com",
    password: "sar123",
    age: 50,
    gender: "Female",
  });
  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});
connectDB() // Call the connectDB function to establish a connection
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
