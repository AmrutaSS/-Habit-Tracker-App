// Importing mongoose for using MongoDB database
const mongoose = require("mongoose");

// Creating a schema for the habit with required fields
const HabitSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Number,
  },
  streak: {
    type: Number,
  },
  creation_date: {
    type: Number,
  },
  days: [], // Array to store the status of the habit for each day
});

// Creating a model for the habit schema
const Habit = mongoose.model("Habit", HabitSchema);

// Exporting the Habit model
module.exports = Habit;
