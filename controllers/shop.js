const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.getProductsPage = (req, res) => {
  Product.fetchAllProducts()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        products: rows,
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

exports.getCartPage = (req, res) => {
  Cart.getCartProducts(cart => {
    Product.fetchAllProducts(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts
      });
    });
  });
};

exports.postCartItem = (req, res) => {
  const prod_id = req.body.product_id;
  Product.findProductById(prod_id, product => {
    Cart.addProduct(prod_id, product.price);
  });
  res.redirect("/products");
};

exports.deleteCartItem = (req, res) => {
  const { product_id } = req.body;
  Product.findProductById(product_id, product => {
    Cart.deleteProductCart(product_id, product.price);
    res.redirect("/cart");
  });
};
