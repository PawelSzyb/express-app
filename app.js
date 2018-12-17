const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

const errorsController = require("./controllers/errors");

const mongoConnect = require("./utils/database").mongoConnect;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req, res, next) => {
// User.findByPk(1)
//   .then(user => {
//     req.user = user;
//     next();
//   })
//   .catch(err => console.log(err));
// next();
// });

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(errorsController.get404Page);

mongoConnect(() => {
  app.listen(3000);
});
