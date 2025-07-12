const express = require("express");
const app = express();

app.use(express.json());
app.get("/users/:userID/:name/:password", (req, res) => {
  console.log(req.params);
  res.send("Users route is working!");
}); // dynamic route for testing
app.post("/users", (req, res) => {
  const userData = req.body;

  console.log("Received data:", userData);

  // Simulate saving to database
  res.status(201).send({
    message: "User created successfully!",
    data: userData,
  });
}); // static route for testing
app.use("/test", (req, res) => {
  res.send("Test route is working!");
});

app.listen(3000, () => {
  console.log("Server is successfully running on port 3000");
});
