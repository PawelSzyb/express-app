const Product = require("../models/Product");
const { validationResult } = require("express-validator/check");
const deleteFile = require("../helpers/file").deleteFile;

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

exports.addProductData = (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;
  const user_id = req.user._id;
  // console.log(image);

  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add-Product",
      path: "/admin/add-product",
      editing: false,
      hasErrors: true,
      messages: [{ msg: "Attached file is not an image" }],
      product: {
        title,
        price,
        description
      },
      validationErrors: []
    });
  }

  if (!errors.isEmpty()) {
    res.status(422).render("admin/edit-product", {
      pageTitle: "Add-Product",
      path: "/admin/add-product",
      editing: false,
      hasErrors: true,
      messages: errors.array(),
      product: {
        title,
        price,
        description
      },
      validationErrors: errors.array()
    });
  } else {
    const imageUrl = image.path;
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
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(err);
        return next(error);
      });
  }
};

exports.getEditProductPage = (req, res, next) => {
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProductData = (req, res) => {
  const { product_id, title, description, price } = req.body;
  const image = req.file;
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
        product.user_id = user_id;
        if (image) {
          deleteFile(product.imageUrl);
          product.imageUrl = image.path;
        }
        return product.save();
      }
      //  else {
      //   const newProduct = new Product({
      //     title,
      //     imageUrl,
      //     description,
      //     price,
      //     user_id
      //   });
      //   return newProduct.save();
      // }
    })
    .then(() => res.redirect("/admin/products"))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { product_id } = req.body;
  Product.findById(product_id)
    .then(product => {
      if (!product) {
        return next(new Error("Product not found"));
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: product_id, user_id: req.user._id });
    })
    .then(product => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
