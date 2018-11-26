const adminController = require("../controllers/admin");

const express = require("express");
const router = express.Router();

// @route   GET admin/add-product
// @desc    get the list of products
router.get("/add-product", adminController.addProductPage);

// @route   GET admin/products
// @desc
router.get("/products", adminController.getProductsPage);

// @route   POST admin/add-product
// @desc    adding product to an array
router.post("/add-product", adminController.addProductData);

module.exports = router;
