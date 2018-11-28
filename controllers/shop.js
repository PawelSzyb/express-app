const Product = require("../models/Product");

exports.getProductsPage = (req, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/product-list", {
      products,
      path: "/products",
      pageTitle: "All Products"
    });
  });
};

exports.getSingleProduct = (req, res) => {
  const product_id = req.params.id;
  Product.findProductById(product_id, product => {
    res.render("shop/product-details", {
      product,
      pageTitle: product.title,
      path: "/products"
    });
  });
};

exports.getIndexPage = (req, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/index", { products, path: "/", pageTitle: "Shop" });
  });
};

exports.getCheckoutPage = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};

exports.getOrdersPage = (req, res) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders"
  });
};

exports.getCartPage = (req, res) => {
  res.render("shop/cart", { path: "/cart", pageTitle: "Your Cart" });
};

exports.postCartItem = (req, res) => {
  const prod_id = req.body.product_id;
  console.log(prod_id);
  res.redirect("/cart");
};
