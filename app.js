const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/User");

const errorsController = require("./controllers/errors");

const mongoConnect = require("./utils/database").mongoConnect;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false, useNewUrlParser: true }));

app.use((req, res, next) => {
  User.findUserById("5c27c04c345ef8215865f91e")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(errorsController.get404Page);

mongoConnect(() => {
  app.listen(3000);
});
