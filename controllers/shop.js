const Product = require("../models/Product");
const Order = require("../models/Order");
// const Cart = require("../models/Cart");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const renderProductsWithPagination = require('../helpers/renderPagination').renderProductsWithPagination

exports.getProductsPage = (req, res, next) => {
  renderProductsWithPagination(req, res, next, "shop/product-list", "/products", "All Products")
  // Product.find()
  //   .then(products => {
  //     res.render("shop/product-list", {
  //       products,
  //       path: "/products",
  //       pageTitle: "All Products"
  //     });
  //   })
  //   .catch(err => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
  //   });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndexPage = (req, res, next) => {
  renderProductsWithPagination(req, res, next, 'shop/index', "/", "Shop")
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteCartProduct = (req, res) => {
  const { product_id } = req.body;
  req.user
    .deleteCartProduct(product_id)
    .then(() => res.redirect("/cart"))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoices = (req, res, next) => {
  const { order_id } = req.params;
  Order.findById(order_id)
    .then(order => {
      if (!order) {
        return next(new Error("Order not found"));
      }
      if (order.user.toString() !== req.user._id.toString()) {
        return next(new Error("Not authorized"));
      }

      const invoiceName = `invoice-${order_id}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);

      res.header("Content-Type", "application/pdf");
      res.header(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(25).text("Invoice", {
        align: "center",
        paragraphGap: 25
      });

      let total = 0;
      order.items.forEach(item => {
        total += item.quantity * item.product.price;
        pdfDoc
          .fontSize(15)
          .list([
            `${item.product.title} x ${item.quantity} - $${item.product.price}`
          ]);
      });

      pdfDoc.text("", {
        paragraphGap: 25
      });
      pdfDoc.fontSize(21).text(`Total: $${total}`, {
        align: "right"
      });

      pdfDoc.end();

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.header("Content-Type", "application/pdf");
      //   res.header(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch(err => next(err));
};
