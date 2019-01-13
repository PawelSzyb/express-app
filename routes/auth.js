const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

// @route   GET login
// @desc    get login page
router.get("/login", authController.getLoginPage);

// @route   POST login
// @desc    logging user
router.post("/login", authController.postLogin);

// @route   POST login
// @desc    logging user
router.post("/logout", authController.postLogout);

module.exports = router;
