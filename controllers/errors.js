exports.get404Page = (req, res) => {
  res.render("404", {
    pageTitle: "Page Not Found",
    path: "",
    isAuthenticated: req.session.isAuthenticated
  });
};
