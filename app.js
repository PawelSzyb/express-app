const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const sequelize = require("./utils/database");

const Product = require("./models/Product");
const User = require("./models/User");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorsController = require("./controllers/errors");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findByPk(1)
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

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: "Janusz", email: "janusz@test.com" });
    }
    return user;
  })
  .then(user => {
    // console.log(user);
    app.listen(3000, () => console.log(`Server started at port ${3000}`));
  })

  .catch(err => console.log(err));
