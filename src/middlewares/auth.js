const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming you have a User model defined
const auth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    console.log("JWT token from cookie:", token);
    if (!token) {
      throw new Error("No token found in cookies");
    }
    const decodedMessage = jwt.verify(token, "your_jwt_secret_key");
    console.log("Decoded JWT token:", decodedMessage);
    const userId = decodedMessage._id;
    if (!userId) {
      throw new Error("Invalid token");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(500).send("Internal server error: " + error.message);
  }
};
module.exports = auth;
