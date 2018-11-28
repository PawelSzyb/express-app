const shopController = require("../controllers/shop");

const express = require("express");
const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/products", shopController.getProductsPage);

router.get("/products/:id", shopController.getSingleProduct);

router.get("/cart", shopController.getCartPage);

router.post("/cart", shopController.postCartItem);

router.get("/orders", shopController.getOrdersPage);

router.get("/checkout", shopController.getCheckoutPage);

module.exports = router;
