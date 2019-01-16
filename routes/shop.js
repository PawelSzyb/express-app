const shopController = require("../controllers/shop");
const isAuthenticated = require("../middleware/is-authenticated");

const express = require("express");
const router = express.Router();

// @route   GET /
// @desc    get the index list of products for users
router.get("/", shopController.getIndexPage);

// @route   GET /products
// @desc    get the list of products for users with details btn
router.get("/products", shopController.getProductsPage);

// @route   GET /products/:id
// @desc    get the details about product
router.get("/products/:id", shopController.getSingleProduct);

// @route   GET /cart
// @desc    get the cart of products
router.get("/cart", isAuthenticated, shopController.getCartPage);

// @route   POST /cart
// @desc    add product to the cart
router.post("/cart", isAuthenticated, shopController.postCartItem);

// @route   POST /cart-delete-item"
// @desc    delete product from the cart
router.post(
  "/cart-delete-item",
  isAuthenticated,
  shopController.deleteCartProduct
);

// @route   GET /orders
// @desc    get page to order
router.get("/orders", isAuthenticated, shopController.getOrdersPage);

// @route   POST /orders
// @desc    Create order list
router.post("/create-order", isAuthenticated, shopController.postOrderList);

module.exports = router;
