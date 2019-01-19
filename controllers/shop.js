const Product = require("../models/Product");
const Order = require("../models/Order");
// const Cart = require("../models/Cart");

exports.getProductsPage = (req, res) => {
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        products,
        path: "/products",
        pageTitle: "All Products"
      });
    })
    .catch(err => console.log(err));
};

exports.getSingleProduct = (req, res) => {
  const product_id = req.params.id;
  Product.findById(product_id)
    .then(product => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products"
      });
    })
    .catch(err => console.log(err));
};

exports.getIndexPage = (req, res) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        products,
        path: "/",
        pageTitle: "Shop"
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckoutPage = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};

exports.getOrdersPage = (req, res) => {
  Order.find({ user: req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders
      });
    })
    .catch(err => console.log(err));
};

exports.postOrderList = (req, res) => {
  req.user
    .populate("cart.items.product_id")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          product: { ...item.product_id._doc },
          quantity: item.quantity
        };
      });
      const newOrder = new Order({
        items: products,
        user: req.user._id
      });
      return newOrder.save();
    })
    .then(() => {
      req.user.clearCart();
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getCartPage = (req, res) => {
  req.user
    .populate("cart.items.product_id")
    .execPopulate()
    .then(user => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items
      });
    });
};

exports.postCartItem = (req, res) => {
  const product_id = req.body.product_id;
  Product.findById(product_id)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect("/products"))
    .catch(err => console.log(err));
};

exports.deleteCartProduct = (req, res) => {
  const { product_id } = req.body;
  req.user
    .deleteCartProduct(product_id)
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
};
