const express = require("express");

const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const auth = require("./middlewares/auth");

app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    } else {
      // jwt auhorization
      const token = user.getJWt();
      // cookie validation
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      res.send("Login successful");
      console.log("User logged in successfully:", user);
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});

//profile api
app.get("/profile", auth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User not found in request");
    }
    res.send(user);
    console.log("Profile fetched successfully:", user);
  } catch (error) {
    res.status(400).send("Error reading cookie: " + error.message);
  }
});
app.post("/sendConnectionRequest", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send("Connection request sent successfully");
    console.log(user.firstName + " sent the connection request successfully");
  } catch (error) {
    res.status(400).send("Error sending connection request: " + error.message);
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
