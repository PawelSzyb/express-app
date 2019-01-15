const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
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
      { product_id: product._id, quantity: 1 }
    ];
  }
  this.cart = {
    items: updatedCartItems
  };
  return this.save();
};

userSchema.methods.deleteCartProduct = function(product_id) {
  const updatedCart = this.cart.items.filter(item => {
    return item.product_id.toString() !== product_id.toString();
  });
  this.cart.items = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart.items = [];
  return this.save();
};

// userSchema.methods.getCart = function() {
//   const productsIds = this.cart.items.map(i => {
//     return i.product_id;
//   });
//   return Product.find({ _id: { $in: productsIds } }).then(products => {
//     if (this.cart.items.length !== products.length) {
//       const updatedCartItems = this.cart.items.filter(item => {
//         return products.find(
//           prod => prod._id.toString() === item.product_id.toString()
//         );
//       });
//       this.cart.items = updatedCartItems;
//       this.save();
//       // db.collection("users").updateOne(
//       //   { _id: new mongoDB.ObjectId(this._id) },
//       //   { $set: { cart: { items: updatedCartItems } } }
//       // );
//     }
//     return products.map(product => {
//       return {
//         ...product,
//         quantity: this.cart.items.find(item => {
//           return item.product_id.toString() === product._id.toString();
//         }).quantity
//       };
//     });
//   });
// };

module.exports = mongoose.model("User", userSchema);

// const mongoDB = require("mongodb");
// const getDB = require("../utils/database").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDB();
//     return db
//       .collection("user")
//       .insertOne(this)
//       .then(() => res.redirect("/products"))
//       .catch(err => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(el => {
//       return el.product_id.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     let updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems = [
//         ...updatedCartItems,
//         { product_id: new mongoDB.ObjectId(product._id), quantity: 1 }
//       ];
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const db = getDB();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDB.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDB();
//     const productsIds = this.cart.items.map(i => {
//       return i.product_id;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productsIds } })
//       .toArray()
//       .then(products => {
//         if (this.cart.items.length !== products.length) {
//           const updatedCartItems = this.cart.items.filter(item => {
//             return products.find(
//               prod => prod._id.toString() === item.product_id.toString()
//             );
//           });
//           this.cart.items = updatedCartItems;
//           db.collection("users").updateOne(
//             { _id: new mongoDB.ObjectId(this._id) },
//             { $set: { cart: { items: updatedCartItems } } }
//           );
//         }
//         return products.map(product => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(item => {
//               return item.product_id.toString() === product._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }
//   deleteCartProduct(product_id) {
//     const db = getDB();
//     const updatedCart = this.cart.items.filter(item => {
//       return item.product_id.toString() !== product_id.toString();
//     });
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDB.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCart } } }
//       );
//   }

//   addOrder() {
//     const db = getDB();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongoDB.ObjectId(this._id),
//             name: this.name
//           }
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongoDB.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch(err => console.log(err));
//   }
//   getOrders() {
//     const db = getDB();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongoDB.ObjectId(this._id) })
//       .toArray();
//   }

//   static findUserById(user_id) {
//     const db = getDB();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongoDB.ObjectId(user_id) })
//       .then(user => {
//         return user;
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = User;
