const express = require("express");
const router = express.Router();

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
router.post("/signup", authController.postSignup);

module.exports = router;
