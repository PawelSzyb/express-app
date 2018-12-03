const path = require("path");
const fs = require("fs");

const Cart = require("./Cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const readDataFromFile = cb => {
  fs.readFile(p, (err, data) => {
    if (!err) {
      return cb(JSON.parse(data));
    }
    cb([]);
  });
};

module.exports = class Product {
  constructor(id, title, imgUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  saveProduct() {
    if (this.id) {
      readDataFromFile(products => {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProduct), err => {
          console.log(err);
        });
      });
    } else {
      this.id = Math.random().toString();
      readDataFromFile(products => {
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      });
    }
  }

  static deleteProduct(id) {
    readDataFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProductCart(id, product.price);
        }
      });
    });
  }

  static fetchAllProducts(cb) {
    readDataFromFile(cb);
  }

  static findProductById(id, cb) {
    readDataFromFile(products => {
      const product = products.find(el => el.id === id);
      cb(product);
    });
  }
};
