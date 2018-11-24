const path = require("path");

const rootDirectory = require("../utils/path");

const express = require("express");
const router = express.Router();

const products = [];

// @route   GET admin/add-product
// @desc    get the list of products
router.get("/add-product", (req, res) => {
  res.render("add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product"
  });
});

// @route   GET admin/add-product
// @desc    adding product to a list
router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
