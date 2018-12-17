const adminController = require("../controllers/admin");

const express = require("express");
const router = express.Router();

// @route   GET admin/add-product
// @desc    get form to add the products
router.get("/add-product", adminController.addProductPage);

// @route   GET admin/products
// @desc    get products for admin
// router.get("/products", adminController.getProductsPage);

// @route   POST admin/add-product
// @desc    adding product
router.post("/add-product", adminController.addProductData);

// @route   GET admin/products
// @desc    get form with product data to edit
// router.get("/edit-product/:id", adminController.getEditProductPage);

// @route   POST admin/edit-product
// @desc    update product with data from form
// router.post("/edit-product", adminController.postEditProductData);

// @route   POST admin/edit-product
// @desc    delete product
// router.post("/delete-product", adminController.deleteProduct);

module.exports = router;
