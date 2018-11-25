const Product = require("../models/Product");

exports.addProductPage = (req, res) => {
  res.render("add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product"
  });
};

exports.addProductData = (req, res) => {
  const products = new Product(req.body.title);
  products.saveProduct();
  res.redirect("/");
};

exports.getProductsPage = (req, res) => {
  const products = Product.fetchAllProducts();
  res.render("shop", { products, path: "/", pageTitle: "Shop" });
};
