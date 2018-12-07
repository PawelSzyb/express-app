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
  Product.create({
    title,
    price,
    imageUrl: imgUrl,
    description
  })
    .then(result => console.log("Done"))
    .catch(err => console.log(err));
};

exports.getEditProductPage = (req, res) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const product_id = req.params.id;
  Product.findByPk(product_id)
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
  const { product_id, title, imageUrl, description, price } = req.body;
  Product.findByPk(product_id)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const { product_id } = req.body;
  Product.deleteProduct(product_id);
  res.redirect("/admin/products");
};

exports.getProductsPage = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render("admin/products", {
        products,
        path: "/admin/products",
        pageTitle: "Admin Products"
      });
    })
    .catch(err => console.log(err));
};
