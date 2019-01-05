const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);

// const mongoDb = require("mongodb");
// const getDb = require("../utils/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, user_id) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongoDb.ObjectId(id) : null;
//     this.user_id = user_id;
//   }

//   save() {
//     const db = getDb();
//     if (this._id) {
//       // Update Product
//       return db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // Insert Product
//       return db
//         .collection("products")
//         .insertOne(this)
//         .then(result => {
//           // console.log(result);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }
//   }

//   static deleteProductById(product_id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongoDb.ObjectId(product_id) })
//       .then()
//       .catch(err => console.log(err));
//   }

//   static findProductById(product_id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find(new mongoDb.ObjectId(product_id))
//       .next()
//       .then(product => {
//         // console.log(product);
//         return product;
//       })
//       .catch(err => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(products => {
//         return products;
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = Product;
