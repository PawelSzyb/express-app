const User = require("../models/User");

exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isAuthenticated
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findById("5c312502c6906c1428e8d390")
    .then(user => {
      if (user) {
        req.session.user = user;
        req.session.isAuthenticated = true;
        res.redirect("/");
      } else {
        res.redirect("/user/login");
      }
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
