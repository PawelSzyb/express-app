const Product = require("../models/Product");

exports.addProductPage = (req, res) => {
  res.render("admin/edit-product", {
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

exports.getEditProductPage = (req, res) => {
  const editMode = req.query.edit;
  console.log(editMode);

  if (!editMode) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit-Product",
    path: "/admin/edit-product",
    editing: editMode
  });
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
