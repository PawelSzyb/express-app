exports.get404Page = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isAuthenticated
  });
};

exports.get500Page = (req, res) => {
  res.status(500).render("500", {
    pageTitle: "Something went wrong",
    path: "/500",
    isAuthenticated: req.session.isAuthenticated
  });
};
