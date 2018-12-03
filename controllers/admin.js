const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.addProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.addProductData = (req, res) => {
  const { title, imgUrl, description, price } = req.body;
  const products = new Product(null, title, imgUrl, description, price);
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

exports.postEditProductData = (req, res) => {
  const { product_id, title, imgUrl, description, price } = req.body;
  const updatedProduct = new Product(
    product_id,
    title,
    imgUrl,
    description,
    price
  );
  updatedProduct.saveProduct();
  res.redirect("/admin/products");
};

exports.deleteProduct = (req, res) => {
  const { product_id } = req.body;
  Product.deleteProduct(product_id);
  res.redirect("/admin/products");
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
