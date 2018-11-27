const Product = require("../models/Product");

exports.addProductPage = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product"
  });
};

exports.addProductData = (req, res) => {
  const { title, imgUrl, description, price } = req.body;
  const products = new Product(title, imgUrl, description, price);
  products.saveProduct();
  res.redirect("/");
};

exports.getProductsPage = (req, res) => {
  Product.fetchAllProducts(products => {
    res.render("admin/products", {
      products,
      path: "/admin/products",
      pageTitle: "Admin Products"
    });
  });
};
