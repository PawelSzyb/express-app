const Product = require("../models/Product");

exports.getProductsPage = (req, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/product-list", {
      products,
      path: "/product-list",
      pageTitle: "All Products"
    });
  });
};

exports.getIndexPage = (req, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/index", { products, path: "/", pageTitle: "Shop" });
  });
};

exports.getCartPage = (req, res) => {
  res.render("shop/cart", { path: "/cart", pageTitle: "Your Cart" });
};

exports.getCheckoutPage = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};
