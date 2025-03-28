const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBUriString = process.env.MONGODB_URI_STRING; 
mongoose
  .connect(mongoDBUriString)
  .then(() => {
    console.log("MongoDB Connected successfully.");
  })
  .catch((error) => {
    console.log("Error in MongoDB connection:", error);
  });