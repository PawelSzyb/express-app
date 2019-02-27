const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/is-authenticated");

const {
  body
} = require("express-validator/check");

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
  [
    body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title is required"),
    body("price")
    .isFloat()
    .withMessage("Price is invalid"),
    body("description").trim()
  ],
  isAuthenticated,
  adminController.addProductData
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
  [
    body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title is required"),
    body("price")
    .isFloat()
    .withMessage("Price is invalid"),
    body("description").trim()
  ],
  isAuthenticated,
  adminController.postEditProductData
);

// @route   DELETE admin/edit-product
// @desc    delete product
router.delete("/product/:product_id", isAuthenticated, adminController.deleteProduct);

module.exports = router;