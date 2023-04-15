const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
// Home page route
router.get("/", homeController.home);
// Route for habits-related routes
router.use("/habit", require("./habit"));
module.exports = router;
