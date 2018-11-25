const productsController = require("../controllers/products");

const express = require("express");
const router = express.Router();

router.get("/", productsController.getProductsPage);

module.exports = router;
