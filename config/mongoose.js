// import the mongoose library
const mongoose = require("mongoose");

// enable strict mode for queries
mongoose.set("strictQuery", true);

mongoose.set("strictQuery", true);

// get the MongoDB connection URI from the environment variable
var mongoDB = process.env.MONGODB_URL;

// connect to MongoDB using the URI and mongoose options
module.exports = mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("CONNECTION ESTABLISHED"));
