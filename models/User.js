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
    // const cartProduct = this.cart.items.findIndex(el => {
    //   return el._id === product._id;
    // });
    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDB.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
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
