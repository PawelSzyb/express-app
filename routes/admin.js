const path = require("path");

const rootDirectory = require("../utils/path");

const express = require("express");
const router = express.Router();

const products = [];

// @route   GET admin/add-product
// @desc    get the list of products
router.get("/add-product", (req, res) => {
  res.sendFile(path.join(rootDirectory, "views", "add-product.html"));
});

// @route   GET admin/add-product
// @desc    adding product to a list
router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
