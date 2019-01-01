const mongoDB = require("mongodb");
const getDB = require("../utils/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDB();
    return db
      .collection("user")
      .insertOne(this)
      .then(() => res.redirect("/products"))
      .catch(err => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(el => {
      return el.product_id.toString() === product._id.toString();
    });
    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems = [
        ...updatedCartItems,
        { product_id: new mongoDB.ObjectId(product._id), quantity: 1 }
      ];
    }

    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDB.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDB();
    const productsIds = this.cart.items.map(i => {
      return i.product_id;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productsIds } })
      .toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(item => {
              return item.product_id.toString() === product._id.toString();
            }).quantity
          };
        });
      });
  }

  static findUserById(user_id) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({ _id: new mongoDB.ObjectId(user_id) })
      .then(user => {
        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
