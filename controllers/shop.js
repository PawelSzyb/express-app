const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.getProductsPage = (req, res) => {
  Product.findAll()
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
  Product.findByPk(product_id)
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
  Product.findAll()
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
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders"
  });
};

exports.postOrderList = (req, res) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getCartPage = (req, res) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCartItem = (req, res) => {
  const prod_id = req.body.product_id;
  let newQuantity = 1;
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prod_id } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prod_id);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.deleteCartItem = (req, res) => {
  const { product_id } = req.body;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: product_id } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
};
