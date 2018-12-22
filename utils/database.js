const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://PavelSz:cvF8LN8pIrSR2Cyn@clusterpavel-c57xi.mongodb.net/test?retryWrites=true"
  )
    .then(client => {
      console.log("MongoDB Connected");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err, "Connection to db failed");
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No Database Found";
  }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
