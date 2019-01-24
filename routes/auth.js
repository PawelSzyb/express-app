const express = require("express");
const router = express.Router();
const { check } = require("express-validator/check");

const authController = require("../controllers/auth");

// @route   GET login
// @desc    get login page
router.get("/login", authController.getLoginPage);

// @route   POST login
// @desc    logging user
router.post("/login", authController.postLogin);

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
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("This email is invalid too :)");
      }
      return true;
    }),
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
