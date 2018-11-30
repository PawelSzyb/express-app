const Product = require("../models/Product");

exports.addProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    editing: false
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

  if (!editMode) {
    return res.redirect("/");
  }
  const product_id = req.params.id;
  Product.findProductById(product_id, product => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit-Product",
      path: "/admin/edit-product",
      editing: editMode,
      product
    });
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
