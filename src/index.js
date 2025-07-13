// src/index.js
const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/admin_userAuth"); // adjust path if needed

const app = express();

// ── Admin routes ────────────────────────────────────────────
app.use("/admin", adminAuth); // middleware applied to all /admin/* routes

app.get("/admin/getAllUsers", (req, res) =>
  res.send("Hello from the admin route")
);
app.get("/admin/deleteUser", (req, res) =>
  res.send("User deleted successfully")
);
app.get("/admin/updateUser", (req, res) =>
  res.send("User updated successfully")
);

// ── User routes ─────────────────────────────────────────────
app.use("/user", userAuth); // middleware applied to all /user/* routes

app.get("/user/getAllUsers", (req, res) =>
  res.send("Hello from the user route")
);
app.get("/user/deleteUser", (req, res) =>
  res.send("User deleted successfully")
);

// ── Boot the server ─────────────────────────────────────────
app.listen(3000, () =>
  console.log("Server is successfully running on port 3000")
);
