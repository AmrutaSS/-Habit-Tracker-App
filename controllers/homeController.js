// Function for rendering the home page
module.exports.home = (req, res) => {
  // Render the home page with the specified title
  return res.render("home", {
    title: "Homepage",
  });
};
