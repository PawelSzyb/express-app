const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLoginPage = (req, res) => {
  let flashMessage = req.flash("error");
  if (flashMessage.length === 0) {
    flashMessage = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    messages: [],
    flashMessage,
    inputs: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res) => {
  let flashMessage = req.flash("error");
  if (flashMessage.length === 0) {
    flashMessage = null;
  }
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      messages: errors.array(),
      inputs: {
        email,
        password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          messages: [{ msg: "User not found" }],
          inputs: {
            email,
            password
          },
          validationErrors: [{ param: "email" }]
        });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          req.session.user = user;
          req.session.isAuthenticated = true;
          req.session.save(err => {
            if (err) console.log(err);
            res.redirect("/");
          });
        } else {
          res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            messages: [{ msg: "Password Invalid" }],
            inputs: {
              email,
              password
            },
            validationErrors: [{ param: "password" }]
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/login");
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  // let message = req.flash("error");
  // if (message.length === 0) {
  //   message = [];
  // }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Singup",
    messages: [],
    inputs: {
      name: "",
      email: "",
      password: "",
      password2: ""
    },
    validationErrors: []
  });
};

exports.postSignup = (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Singup",
      messages: errors.array(),
      inputs: {
        name,
        email,
        password,
        password2
      },
      validationErrors: errors.array()
    });
  }

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
        if (err) {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        }
      });
    });
  });
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
      .then(user => {
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
        transporter.sendMail(emailToSend, function(err, res) {
          if (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          }
        });
      })

      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
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
      user_id: user._id.toString(),
      passwordToken: token
    });
  });
};

exports.postNewPassword = (req, res) => {
  const { passwordToken, user_id, password } = req.body;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: user_id
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then(hashPass => {
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      resetUser.password = hashPass;
      return resetUser.save();
    })
    .then(() => res.redirect("/login"))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
