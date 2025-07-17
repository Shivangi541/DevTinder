const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/admin_userAuth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");
app.use(express.json());
const bcrypt = require("bcrypt");
const { validateUserInput } = require("./utils/validation");
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // validation
    const validationError = validateUserInput(req);
    if (validationError) {
      return res.status(400).send(validationError);
    }

    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully" + passwordHash);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("User created successfully");
    console.log("User created successfully:", user);
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});
//login api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
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
app.patch("/user/:_id", async (req, res) => {
  const userId = req.params?._id;
  const data = req.body;
  try {
    const allowed_updates = ["about", "lastName", "skills", "password", "age"];
    const isallowedUpdates = Object.keys(data).every((k) => {
      allowed_updates.includes(k);
    });
    if (!isallowedUpdates) {
      return res.status(400).send("Invalid updates");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
      console.log("User updated successfully:", user);
    }
  } catch (error) {
    res.status(400).send("Error updating user: " + error.message);
  }
});
app.patch("/user", async (req, res) => {
  const emailId = req.body.email;
  const data = req.body;
  try {
    const user = await User.findOneAndUpdate(
      {
        email: emailId,
      },
      data,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
      console.log("User updated successfully:", user);
    }
  } catch (error) {
    res.status(400).send("Error updating user: " + error.message);
  }
});
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
