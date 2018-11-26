const shopController = require("../controllers/shop");

const express = require("express");
const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/products", shopController.getProductsPage);

router.get("/cart", shopController.getCartPage);

router.get("/checkout", shopController.getCheckoutPage);

module.exports = router;
