const path = require("path");

const rootDirectory = require("../utils/path");

const adminRoutes = require("./admin");

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminRoutes.products;
  res.render("shop", { products, docTitle: "Shop" });
});

module.exports = router;
