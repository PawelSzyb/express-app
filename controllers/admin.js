const Product = require("../models/Product");
const { validationResult } = require("express-validator/check");

exports.addProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    editing: false,
    hasErrors: false,
    messages: [],
    validationErrors: []
  });
};

exports.addProductData = (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  const user_id = req.user._id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render("admin/edit-product", {
      pageTitle: "Add-Product",
      path: "/admin/add-product",
      editing: false,
      hasErrors: true,
      messages: errors.array(),
      product: {
        title,
        imageUrl,
        price,
        description
      },
      validationErrors: errors.array()
    });
  } else {
    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      user_id
    });
    product
      .save()
      .then(result => res.redirect("/admin/products"))
      .catch(err => console.log(err));
  }
};

exports.getEditProductPage = (req, res) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const product_id = req.params.id;
  Product.findById(product_id)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit-Product",
        path: "/admin/edit-product",
        editing: editMode,
        messages: [],
        product,
        hasErrors: false,
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProductData = (req, res) => {
  const { product_id, title, imageUrl, description, price } = req.body;
  const user_id = req.user._id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render("admin/edit-product", {
      pageTitle: "Edit-Product",
      path: "/admin/edit-product",
      editing: true,
      hasErrors: false,
      messages: errors.array(),
      product: {
        title,
        imageUrl,
        description,
        price
      },
      validationErrors: errors.array()
    });
  }

  Product.findById(product_id)
    .then(product => {
      if (product.user_id.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      if (product) {
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        product.user_id = user_id;

        return product.save();
      } else {
        const newProduct = new Product({
          title,
          imageUrl,
          description,
          price,
          user_id
        });
        return newProduct.save();
      }
    })
    .then(() => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const { product_id } = req.body;

  Product.deleteOne({ _id: product_id, user_id: req.user._id })
    .then(product => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProductsPage = (req, res) => {
  Product.find({ user_id: req.user._id })
    // .populate("user_id", "name")
    // .select("-price")
    .then(products => {
      res.render("admin/products", {
        products,
        path: "/admin/products",
        pageTitle: "Admin Products"
      });
    })
    .catch(err => console.log(err));
};
