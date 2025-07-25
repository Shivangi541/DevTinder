require("module-alias/register");
const express = require("express");

const connectDB = require("./config/database");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const authRouter = require("@routes/auth_route");
const requestRouter = require("@routes/request");
const profileRouter = require("@routes/profile_route");
const userRouter = require("@routes/user_route");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
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
