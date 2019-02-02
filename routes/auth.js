const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator/check");
const User = require("../models/User");

const authController = require("../controllers/auth");

// @route   GET login
// @desc    get login page
router.get("/login", authController.getLoginPage);

// @route   POST login
// @desc    logging user
router.post(
  "/login",
  [
    body("email", "Invalid email")
      .isEmail()
      .normalizeEmail(),
    body("password").trim()
  ],
  authController.postLogin
);

// @route   POST logout
// @desc    logging out user
router.post("/logout", authController.postLogout);

// @route   GET signup
// @desc    get registration page
router.get("/signup", authController.getSignup);

// @route   POST signup
// @desc    post signup data
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email is invalid too :)");
        // }
        // return true;
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("Email already exists.");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password must be atleast 6 characters long")
      .isLength({
        min: 6
      })
      .trim(),
    body("password2")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      })
  ],
  authController.postSignup
);

// @route   GET reset password
// @desc    display reset password form
router.get("/reset", authController.getReset);

// @route   POST reset password
// @desc    send email with link to reset password
router.post("/reset", authController.postReset);

// @route   GET reset password
// @desc    display form to change password
router.get("/reset/:token", authController.getNewPassword);

// @route   POST new password
// @desc    change password for new one
router.post("/new-password", authController.postNewPassword);

module.exports = router;
