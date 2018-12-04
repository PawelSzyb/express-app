const db = require("../utils/database");

const Cart = require("./Cart");

module.exports = class Product {
  constructor(id, title, imgUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  saveProduct() {
    return db.execute(
      "INSERT INTO products (title, price, imgUrl, description) VALUES (?,?,?,?)",
      [this.title, this.price, this.imgUrl, this.description]
    );
  }

  static deleteProduct(id) {}

  static fetchAllProducts() {
    return db.execute("SELECT * FROM products");
  }

  static findProductById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
