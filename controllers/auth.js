const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLoginPage = (req, res) => {
  let message = req.flash("error");
  if (message.length === 0) {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    messages: message
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    } else {
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            req.session.user = user;
            req.session.isAuthenticated = true;
            req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          } else {
            req.flash("error", "Invalid email or password.");
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
  let message = req.flash("error");
  if (message.length === 0) {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Singup",
    messages: message
  });
};

exports.postSignup = (req, res) => {
  const { name, email, password, passwrod2 } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash("error", "User with this email already exists.");
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
            const emailToSend = {
              to: email,
              from: "shop-node@complete.com",
              subject: "Signup succeeded",
              html: "<h1>You have successfully singed up mate</h1>"
            };
            transporter.sendMail(emailToSend, function(err, res) {
              if (err) console.log(err);
            });
          });
        });
      }
    })
    .catch(err => console.log(err));
};

exports.getReset = (req, res) => {
  let message = req.flash("error");
  if (message.length === 0) {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    messages: message
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "Email is invalid");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        const emailToSend = {
          to: req.body.email,
          from: "shop-node@complete.com",
          subject: "Password reset",
          html: `
            <p>You have requested to change password</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset the password</p>
          `
        };
        transporter.sendMail(emailToSend);
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  }).then(user => {
    let message = req.flash("error");
    if (message.length === 0) {
      message = null;
    }
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      messages: message,
      user_id: user._id.toString()
    });
  });
};
