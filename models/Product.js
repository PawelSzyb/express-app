const path = require("path");
const fs = require("fs");

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
  constructor(title) {
    this.title = title;
  }

  saveProduct() {
    readDataFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAllProducts(cb) {
    readDataFromFile(cb);
  }
};
