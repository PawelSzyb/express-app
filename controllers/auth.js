exports.getLoginPage = (req, res) => {
  const isAuthenticated = req
    .get("Cookie")
    .split(";")[1]
    .trim()
    .split("=")[1];

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login"
  });
};

exports.postLogin = (req, res) => {
  res.setHeader("Set-Cookie", "isAuthenticated=true");
  res.redirect("/");
};
