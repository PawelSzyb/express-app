const Product = require("../models/Product");
// const Cart = require("../models/Cart");

exports.addProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.addProductData = (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(result => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

exports.getEditProductPage = (req, res) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const product_id = req.params.id;
  Product.findProductById(product_id)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit-Product",
        path: "/admin/edit-product",
        editing: editMode,
        product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProductData = (req, res) => {
  const { title, imageUrl, description, price } = req.body;

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );

  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const { product_id } = req.body;
  Product.deleteProductById(product_id)
    .then(product => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProductsPage = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        products,
        path: "/admin/products",
        pageTitle: "Admin Products"
      });
    })
    .catch(err => console.log(err));
};
