// Require the habitModel
const Habit = require("../models/habitModel");

// Define an array with the name of the months
const Month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// Controller for habits page
module.exports.habitsPage = (req, res) => {
  // Find all habits in the database
  Habit.find({}, (err, habits) => {
    // Render the dashboard view with habits data
    return res.render("dashboard", {
      title: "Habits Dashboard",
      habits: habits,
    });
  });
};
// Create a new habit
module.exports.create = (req, res) => {
  // Get today's date
  let today = new Date();
  let date = today.getDate();
  // Create a new habit object with the user's input
  Habit.create(
    {
      description: req.body.habit,
      creation_date: date,
      days: ["None", "None", "None", "None", "None", "None", "None"],
      completed: 0,
      streak: 0,
    },
    (err, habit) => {
      if (err) {
        console.log("Error while creating Habit", err);
        return res.redirect("back");
      }
      // Log the created habit and redirect to previous page
      console.log(habit);
      return res.redirect("back");
    }
  );
};

// Action for deleting a habit
module.exports.delete = (req, res) => {
  // Get the ID of the habit to delete
  let id = req.params.id;
  // Delete the habit from the database using its ID
  Habit.findByIdAndDelete(id, function (err, habit) {
    if (err) {
      console.log("error in deleting from database");
      return res.redirect("back");
    }
    // Log success message and redirect to previous page
    console.log("Successfully deleted Habit");
    return res.redirect("back");
  });
};

// Check and update habit's status for the week
module.exports.weeklyview = (req, res) => {
  // Create an array with the dates of the last 7 days
  let date = new Date();
  let days = [];
  for (let i = 0; i < 7; i++) {
    let d =
      date.getDate() + "," + Month[date.getMonth()] + " " + date.getFullYear();
    date.setDate(date.getDate() - 1); //decrease date one by one
    days.push(d);
  }
  // Reverse the array for desired order
  days.reverse();
  // Find all habits in the database
  Habit.find({}, function (error, habits) {
    // Call updateData function to update habits data
    updateData(habits);
    if (error) {
      console.log("Error while fetching data from Atlas DB", error);
      // Render the weekly view with habits and days data
      return res.redirect("/");
    }
    return res.render("weeklyview", {
      title: "Habits Weekly View",
      habits: habits,
      days,
    });
  });
};

// Action for updating habit's status
module.exports.update = (req, res) => {
  // Get the ID of the habit, day of the week and status from the request parameters
  let id = req.params.id;
  let day = req.params.day;
  let status = req.params.status;
  // Find the habit by ID and update its day's status
  Habit.findById(id, (error, habit) => {
    if (error) {
      console.log(error);
      return res.redirect("back");
    }
    habit.days[day] = status;
    habit.save();
    // Update the streak and completion status of the habit
    updateStreakandCompleted(habit);
    return res.redirect("back");
  });
};

// Function to update habit data
let updateData = (habits) => {
  let todaysDate = new Date().getDate();
  // Find the difference between the creation date and today's date
  for (let habit of habits) {
    let id = habit.id;
    let diff = todaysDate - habit.creation_date;

    // If the difference is less than a week, update the days array and creation date
    if (diff > 0 && diff < 8) {
      for (let i = diff, j = 0; i < habit.days.length; i++, j++) {
        habit.days[j] = habit.days[i];
      }
      let remPos = habit.days.length - diff;
      for (let i = remPos; i < habit.days.length; i++) {
        habit.days[i] = "None";
      }
      habit.creation_date = todaysDate;
      // Update the streak and completion status of the habit
      updateStreakandCompleted(habit);
      habit.save();
    }
    // If the difference is more than a week, reset the days array and creation date
    else if (diff > 7) {
      for (let i = 0; i < 7; i++) {
        habit.days[i] = "None";
        habit.creation_date = todaysDate;
        // Update the streak and completion status of the habit
        updateStreakandCompleted(habit);
        habit.save();
      }
    }
  }
};

// Function to update the streak and completion status of the habit
let updateStreakandCompleted = async (habit) => {
  try {
    let curr_completed = 0;
    let maxStreak = 0; // to save latest value
    let curr_streak = 0;
    for (let i = 0; i < habit.days.length; i++) {
      if (habit.days[i] == "Done") {
        curr_completed++;
        curr_streak++;
      } else {
        if (curr_streak > maxStreak) {
          maxStreak = curr_streak;
          curr_streak = 0;
        } else {
          streak = 0;
        }
      }
    }

    if (curr_streak > maxStreak) {
      maxStreak = curr_streak;
    }
    // Update the habit document with the latest streak and completion status
    await Habit.findByIdAndUpdate(habit.id, {
      streak: maxStreak,
      completed: curr_completed,
    });
    // console.log('updated');
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};
