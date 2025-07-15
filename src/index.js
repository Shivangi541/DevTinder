const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/admin_userAuth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user || user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
      console.log("User fetched successfully:", user);
    }
  } catch (error) {
    res.status(400).send("Error fetching user: ", error.message);
  }
});
// feed api get api
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
    console.log("Feed fetched successfully:", users);
  } catch (error) {
    res.status(400).send("Error fetching feed: ", error.message);
  }
});
// demo for findById()
app.get("/userbyID/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
      console.log("User fetched successfully by ID:", user);
    }
  } catch (error) {
    res.status(400).send("Error fetching user by ID: ", error.message);
  }
});
//delete api
app.delete("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOneAndDelete({ email: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
      console.log("User deleted successfully:", user);
    }
  } catch (error) {
    res.status(400).send("Error deleting user: " + error.message);
  }
});
//update api

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
