const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isAuthenticated
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) res.redirect("/login");
    else {
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user;
            req.session.isAuthenticated = true;
            req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          } else {
            res.redirect("/login");
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    }
  });
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Singup",
    isAuthenticated: req.session.isAuthenticated
  });
};

exports.postSignup = (req, res) => {
  const { name, email, password, passwrod2 } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
        res.redirect("/signup");
      } else {
        bcrypt.genSalt(12, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            const newUser = new User({
              name,
              email,
              password: hash,
              cart: { items: [] }
            });

            newUser.save();
            res.redirect("/login");
          });
        });
      }
    })
    .catch(err => console.log(err));
};
