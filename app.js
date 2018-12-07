const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const sequelize = require("./utils/database");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorsController = require("./controllers/errors");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(errorsController.get404Page);

sequelize
  .sync()
  .then(app.listen(3000, () => console.log(`Server started at port ${3000}`)))
  .catch(err => console.log(err));
