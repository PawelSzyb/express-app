const path = require("path");

const productsController = require("../controllers/products");

const express = require("express");
const router = express.Router();

// @route   GET admin/add-product
// @desc    get the list of products
router.get("/add-product", productsController.addProductPage);

// @route   POST admin/add-product
// @desc    adding product to an array
router.post("/add-product", productsController.addProductData);

module.exports = router;
