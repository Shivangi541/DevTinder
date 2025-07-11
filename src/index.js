const express = require("express");
const app = express();
app.use((req, res) => {
  res.send("Hello, World!");
}); // request handler
app.listen(3000, () => {
  console.log("Server is successfully running on port 3000");
});
