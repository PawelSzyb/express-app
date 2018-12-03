const path = require("path");
const fs = require("fs");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch previus cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Find existing product
      const existingProductIndex = cart.products.findIndex(
        product => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProductCart(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const product = cart.products.find(prod => prod.id === id);
      if (!product) return;

      const pordQty = product.qty;
      cart.totalPrice = cart.totalPrice - productPrice * pordQty;

      const updatedCartProducts = cart.products.filter(prod => prod.id !== id);
      cart.products = [...updatedCartProducts];
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static getCartProducts(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        return null;
      } else {
        cb(cart);
      }
    });
  }
};
