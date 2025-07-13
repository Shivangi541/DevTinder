const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dshivangi050:vQ2cmUmtjbO7gyMp@studynode.emsux8j.mongodb.net/DevTinder?retryWrites=true&w=majority"
    );
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the process with failure
  }
};
module.exports = connectDB;
