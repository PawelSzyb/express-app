const shopController = require("../controllers/shop");

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
router.get("/cart", shopController.getCartPage);

// @route   POST /cart
// @desc    add product to the cart
router.post("/cart", shopController.postCartItem);

// @route   POST /cart-delete-item"
// @desc    delete product from the cart
router.post("/cart-delete-item", shopController.deleteCartItem);

// @route   GET /orders
// @desc    get page to order
router.get("/orders", shopController.getOrdersPage);

router.get("/checkout", shopController.getCheckoutPage);

module.exports = router;
