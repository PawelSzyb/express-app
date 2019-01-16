const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/is-authenticated");

const express = require("express");
const router = express.Router();

// @route   GET admin/add-product
// @desc    get form to add the products
router.get("/add-product", isAuthenticated, adminController.addProductPage);

// @route   GET admin/products
// @desc    get products for admin
router.get("/products", isAuthenticated, adminController.getProductsPage);

// @route   POST admin/add-product
// @desc    adding product
router.post(
  "/add-product",
  isAuthenticated,
  adminController.postEditProductData
);

// @route   GET admin/products
// @desc    get form with product data to edit
router.get(
  "/edit-product/:id",
  isAuthenticated,
  adminController.getEditProductPage
);

// @route   POST admin/edit-product
// @desc    update product with data from form
router.post(
  "/edit-product",
  isAuthenticated,
  adminController.postEditProductData
);

// @route   POST admin/edit-product
// @desc    delete product
router.post("/delete-product", isAuthenticated, adminController.deleteProduct);

module.exports = router;
