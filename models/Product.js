const mongoDb = require("mongodb");
const getDb = require("../utils/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save() {
    const db = getDb();
    if (this._id) {
      // Update Product
      return db.collection("products").updateOne(
        { _id: mongoDb.ObjectId(this._id) },
        {
          $set: {
            title: this.title,
            price: this.price,
            description: this.description,
            imageUrl: this.imageUrl
          }
        }
      );
    } else {
      // Insert Product
      return db
        .collection("products")
        .insertOne(this)
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  static findProductById(product_id) {
    const db = getDb();
    return db
      .collection("products")
      .find(new mongoDb.ObjectId(product_id))
      .next()
      .then(product => {
        // console.log(product);
        return product;
      })
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;
