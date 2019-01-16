const Product = require("../models/Product");

exports.addProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isAuthenticated
  });
};

// exports.addProductData = (req, res) => {
//   const { title, price, description, imageUrl } = req.body;
//   const product = new Product({ title, price, description, imageUrl });
//   product
//     .save()
//     .then(result => res.redirect("/admin/products"))
//     .catch(err => console.log(err));
// };

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
        product,
        isAuthenticated: req.session.isAuthenticated
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProductData = (req, res) => {
  const { product_id, title, imageUrl, description, price } = req.body;
  const user_id = req.user._id;

  Product.findById(product_id)
    .then(product => {
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
  Product.findOneAndDelete(product_id)
    .then(product => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProductsPage = (req, res) => {
  Product.find()
    // .populate("user_id", "name")
    // .select("-price")
    .then(products => {
      res.render("admin/products", {
        products,
        path: "/admin/products",
        pageTitle: "Admin Products",
        isAuthenticated: req.session.isAuthenticated
      });
    })
    .catch(err => console.log(err));
};
