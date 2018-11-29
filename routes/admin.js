const adminController = require("../controllers/admin");

const express = require("express");
const router = express.Router();

// @route   GET admin/add-product
// @desc    get form to add the products
router.get("/add-product", adminController.addProductPage);

// @route   GET admin/products
// @desc    get products for admin
router.get("/products", adminController.getProductsPage);

// @route   POST admin/add-product
// @desc    adding product to an array
router.post("/add-product", adminController.addProductData);

// @route   GET admin/products
// @desc
router.get("/edit-product/:id", adminController.getEditProductPage);

module.exports = router;
